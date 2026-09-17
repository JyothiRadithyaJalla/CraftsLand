-- ====================================================================
-- CRAFTSLAND MIGRATION 14 — PRODUCTION DATABASE HARDENING
-- ====================================================================
-- 1. ORDER STATE MACHINE TRIGGER: Rejects out-of-order transitions at DB level
-- 2. AUDIT LOGS TABLE & TRIGGERS: Append-only audit logging for security-sensitive admin/staff actions
-- 3. RESERVATION HARDENING: Past-date rejection, duplicate same-slot prevention, concurrency locking
-- 4. RPC UPDATE: Concurrency-safe create_verified_reservation & get_guest_order_by_token
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. ORDER STATE MACHINE DATABASE ENFORCEMENT
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fn_enforce_order_state_machine()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- If order_status has not changed, permit other column updates (e.g. payment_status, notes)
  IF OLD.order_status IS NOT DISTINCT FROM NEW.order_status THEN
    RETURN NEW;
  END IF;

  -- Enforce strict forward state progression:
  -- PENDING -> ACCEPTED -> PREPARING -> READY -> COMPLETED
  -- CANCELLED is allowed from non-terminal states
  CASE OLD.order_status
    WHEN 'PENDING' THEN
      IF NEW.order_status NOT IN ('ACCEPTED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Invalid order status transition from % to % for order %.',
          OLD.order_status, NEW.order_status, OLD.order_number;
      END IF;

    WHEN 'ACCEPTED' THEN
      IF NEW.order_status NOT IN ('PREPARING', 'CANCELLED') THEN
        RAISE EXCEPTION 'Invalid order status transition from % to % for order %.',
          OLD.order_status, NEW.order_status, OLD.order_number;
      END IF;

    WHEN 'PREPARING' THEN
      IF NEW.order_status NOT IN ('READY', 'CANCELLED') THEN
        RAISE EXCEPTION 'Invalid order status transition from % to % for order %.',
          OLD.order_status, NEW.order_status, OLD.order_number;
      END IF;

    WHEN 'READY' THEN
      IF NEW.order_status NOT IN ('COMPLETED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Invalid order status transition from % to % for order %.',
          OLD.order_status, NEW.order_status, OLD.order_number;
      END IF;

    WHEN 'COMPLETED' THEN
      RAISE EXCEPTION 'Cannot modify completed order % (attempted transition from COMPLETED to %).',
        OLD.order_number, NEW.order_status;

    WHEN 'CANCELLED' THEN
      RAISE EXCEPTION 'Cannot modify cancelled order % (attempted transition from CANCELLED to %).',
        OLD.order_number, NEW.order_status;

    ELSE
      RAISE EXCEPTION 'Unknown current order status: %.', OLD.order_status;
  END CASE;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_order_state_machine ON public.orders;
CREATE TRIGGER trg_enforce_order_state_machine
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.fn_enforce_order_state_machine();


-- --------------------------------------------------------------------
-- 2. ADMIN OVERRIDE AUDIT LOG TABLE & TRIGGERS (APPEND-ONLY)
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  actor_role TEXT NOT NULL DEFAULT 'SYSTEM',
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable Row Level Security (Append-Only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only Admins and Super Admins can query audit logs
DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
CREATE POLICY "Admins read audit logs" ON public.audit_logs
  FOR SELECT
  USING (
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

-- Only authenticated staff or security-definer triggers can insert
DROP POLICY IF EXISTS "Staff insert audit logs" ON public.audit_logs;
CREATE POLICY "Staff insert audit logs" ON public.audit_logs
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN', 'KITCHEN')
  );

-- NO UPDATE POLICY (Strictly Append-Only)
-- NO DELETE POLICY (Strictly Append-Only)

-- Automatic Audit Trigger for Orders
CREATE OR REPLACE FUNCTION public.fn_audit_orders()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_id UUID;
  v_role TEXT;
  v_action TEXT;
BEGIN
  v_actor_id := auth.uid();
  v_role := COALESCE(public.current_user_role()::TEXT, 'SYSTEM');

  IF (TG_OP = 'UPDATE' AND OLD.order_status IS DISTINCT FROM NEW.order_status) THEN
    IF NEW.order_status = 'CANCELLED' THEN
      v_action := 'ORDER_CANCELLED';
    ELSIF v_role IN ('ADMIN', 'SUPER_ADMIN') THEN
      v_action := 'ADMIN_ORDER_STATUS_OVERRIDE';
    ELSE
      v_action := 'ORDER_STATUS_UPDATE';
    END IF;

    INSERT INTO public.audit_logs (
      actor_user_id,
      actor_role,
      action,
      entity_type,
      entity_id,
      old_value,
      new_value,
      metadata
    ) VALUES (
      v_actor_id,
      v_role,
      v_action,
      'orders',
      NEW.id::TEXT,
      jsonb_build_object('order_status', OLD.order_status, 'payment_status', OLD.payment_status),
      jsonb_build_object('order_status', NEW.order_status, 'payment_status', NEW.payment_status),
      jsonb_build_object('order_number', NEW.order_number, 'order_type', NEW.order_type)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_orders ON public.orders;
CREATE TRIGGER trg_audit_orders
AFTER UPDATE OF order_status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.fn_audit_orders();

-- Automatic Audit Trigger for Reservations
CREATE OR REPLACE FUNCTION public.fn_audit_reservations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_id UUID;
  v_role TEXT;
  v_action TEXT;
BEGIN
  v_actor_id := auth.uid();
  v_role := COALESCE(public.current_user_role()::TEXT, 'SYSTEM');

  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status = 'CANCELLED' THEN
      v_action := 'RESERVATION_CANCELLED';
    ELSIF v_role IN ('ADMIN', 'SUPER_ADMIN') THEN
      v_action := 'ADMIN_RESERVATION_OVERRIDE';
    ELSE
      v_action := 'RESERVATION_STATUS_UPDATE';
    END IF;

    INSERT INTO public.audit_logs (
      actor_user_id,
      actor_role,
      action,
      entity_type,
      entity_id,
      old_value,
      new_value,
      metadata
    ) VALUES (
      v_actor_id,
      v_role,
      v_action,
      'reservations',
      NEW.id::TEXT,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      jsonb_build_object('booking_reference', NEW.booking_reference, 'date', NEW.reservation_date, 'time', NEW.reservation_time)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_reservations ON public.reservations;
CREATE TRIGGER trg_audit_reservations
AFTER UPDATE OF status ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.fn_audit_reservations();


-- --------------------------------------------------------------------
-- 3. RESERVATION TABLE LEVEL VALIDATION & DEDUPLICATION
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fn_validate_reservation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now_ist TIMESTAMP;
  v_requested_slot TIMESTAMP;
BEGIN
  -- Normalize dual column aliases
  IF NEW.reservation_date IS NULL AND NEW.date IS NOT NULL THEN
    NEW.reservation_date := NEW.date;
  ELSIF NEW.date IS NULL AND NEW.reservation_date IS NOT NULL THEN
    NEW.date := NEW.reservation_date;
  END IF;

  IF NEW.reservation_time IS NULL AND NEW.time_slot IS NOT NULL THEN
    NEW.reservation_time := NEW.time_slot;
  ELSIF NEW.time_slot IS NULL AND NEW.reservation_time IS NOT NULL THEN
    NEW.time_slot := NEW.reservation_time;
  END IF;

  IF NEW.seating_section IS NULL AND NEW.section IS NOT NULL THEN
    NEW.seating_section := NEW.section;
  ELSIF NEW.section IS NULL AND NEW.seating_section IS NOT NULL THEN
    NEW.section := NEW.seating_section;
  END IF;

  -- Validate past date only on INSERT or when date/time is modified
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (OLD.reservation_date IS DISTINCT FROM NEW.reservation_date OR OLD.reservation_time IS DISTINCT FROM NEW.reservation_time)) THEN
    IF NEW.reservation_date < CURRENT_DATE THEN
      RAISE EXCEPTION 'Reservation date cannot be in the past: %.', NEW.reservation_date;
    END IF;

    -- If booking for today, check time slot
    v_now_ist := (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata');
    IF NEW.reservation_date = (v_now_ist::DATE) THEN
      BEGIN
        v_requested_slot := (NEW.reservation_date::TEXT || ' ' || NEW.reservation_time || ':00')::TIMESTAMP;
        IF v_requested_slot < v_now_ist THEN
          RAISE EXCEPTION 'Reservation time slot % on % has already passed.', NEW.reservation_time, NEW.reservation_date;
        END IF;
      EXCEPTION
        WHEN datetime_field_overflow THEN
          NULL;
      END;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_reservation ON public.reservations;
CREATE TRIGGER trg_validate_reservation
BEFORE INSERT OR UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.fn_validate_reservation();

-- Unique partial index to prevent same guest from having multiple active bookings for same slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_guest_reservation
ON public.reservations (LOWER(guest_email), reservation_date, reservation_time)
WHERE status IN ('CONFIRMED', 'SEATED', 'PENDING');


-- --------------------------------------------------------------------
-- 4. CONCURRENCY-SAFE RESERVATION CREATION RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_verified_reservation(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_customer_id UUID;
  v_party_size INT;
  v_date DATE;
  v_time_slot TEXT;
  v_section seating_section;
  v_guest_name TEXT;
  v_guest_email TEXT;
  v_guest_phone TEXT;
  v_special_requests TEXT;
  
  v_current_booked_seats INT := 0;
  v_max_capacity INT := 30;
  v_booking_ref TEXT;
  v_res_id UUID;
  v_now_ist TIMESTAMP;
  v_requested_slot TIMESTAMP;
BEGIN
  v_party_size := (p_payload->>'party_size')::INT;
  v_date := (p_payload->>'reservation_date')::DATE;
  v_time_slot := TRIM(p_payload->>'reservation_time');
  v_section := (p_payload->>'seating_section')::seating_section;
  v_guest_name := TRIM(p_payload->>'guest_name');
  v_guest_email := LOWER(TRIM(p_payload->>'guest_email'));
  v_guest_phone := TRIM(p_payload->>'guest_phone');
  v_special_requests := p_payload->>'special_requests';

  IF v_party_size <= 0 OR v_party_size > 14 THEN
    RAISE EXCEPTION 'Party size must be between 1 and 14 guests.';
  END IF;

  IF v_date IS NULL OR v_time_slot IS NULL OR v_time_slot = '' THEN
    RAISE EXCEPTION 'Reservation date and time slot are required.';
  END IF;

  -- 1. Date & Time Validation (Past Date Rejection)
  IF v_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Reservation date cannot be in the past: %.', v_date;
  END IF;

  v_now_ist := (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata');
  IF v_date = (v_now_ist::DATE) THEN
    BEGIN
      v_requested_slot := (v_date::TEXT || ' ' || v_time_slot || ':00')::TIMESTAMP;
      IF v_requested_slot < v_now_ist THEN
        RAISE EXCEPTION 'Reservation time slot % on % has already passed.', v_time_slot, v_date;
      END IF;
    EXCEPTION
      WHEN datetime_field_overflow THEN
        RAISE EXCEPTION 'Invalid time slot format: %.', v_time_slot;
    END;
  END IF;

  -- 2. Duplicate Check: Same guest email cannot have active booking for the same slot
  IF EXISTS (
    SELECT 1 FROM public.reservations
    WHERE LOWER(guest_email) = v_guest_email
      AND (reservation_date = v_date OR date = v_date)
      AND (reservation_time = v_time_slot OR time_slot = v_time_slot)
      AND status IN ('CONFIRMED', 'SEATED', 'PENDING')
  ) THEN
    RAISE EXCEPTION 'A reservation for % on % at % already exists.', v_guest_email, v_date, v_time_slot;
  END IF;

  IF auth.uid() IS NOT NULL THEN
    v_customer_id := auth.uid();
  ELSE
    v_customer_id := NULL;
  END IF;

  -- 3. Concurrency Lock: Serialize capacity validation for this slot
  PERFORM pg_advisory_xact_lock(hashtext('reservation_slot_' || v_date::TEXT || '_' || v_time_slot || '_' || v_section::TEXT));

  -- Section Capacity Boundaries
  CASE v_section
    WHEN 'CHEFS_COUNTER' THEN v_max_capacity := 8;
    WHEN 'PRIVATE_VAULT' THEN v_max_capacity := 14;
    WHEN 'TERRACE' THEN v_max_capacity := 24;
    ELSE v_max_capacity := 60; -- MAIN_DINING
  END CASE;

  SELECT COALESCE(SUM(party_size), 0) INTO v_current_booked_seats
  FROM public.reservations
  WHERE (date = v_date OR reservation_date = v_date)
    AND (time_slot = v_time_slot OR reservation_time = v_time_slot)
    AND (section = v_section OR seating_section = v_section)
    AND status IN ('CONFIRMED', 'SEATED', 'PENDING');

  IF (v_current_booked_seats + v_party_size) > v_max_capacity THEN
    RAISE EXCEPTION 'Seating capacity exceeded for % at % on % (Available: % seats, Requested: %).',
      v_section, v_time_slot, v_date, GREATEST(0, v_max_capacity - v_current_booked_seats), v_party_size;
  END IF;

  -- 4. Generate Human-Readable Booking Reference
  v_booking_ref := 'LN-' || UPPER(SUBSTRING(replace(gen_random_uuid()::text, '-', '') FROM 1 FOR 6));

  INSERT INTO public.reservations (
    booking_reference,
    user_id,
    customer_id,
    guest_name,
    guest_email,
    guest_phone,
    party_size,
    date,
    reservation_date,
    time_slot,
    reservation_time,
    section,
    seating_section,
    special_requests,
    status
  ) VALUES (
    v_booking_ref,
    v_customer_id,
    v_customer_id,
    v_guest_name,
    v_guest_email,
    v_guest_phone,
    v_party_size,
    v_date,
    v_date,
    v_time_slot,
    v_time_slot,
    v_section,
    v_section,
    v_special_requests,
    'CONFIRMED'
  ) RETURNING id INTO v_res_id;

  RETURN jsonb_build_object(
    'id', v_res_id,
    'booking_reference', v_booking_ref,
    'status', 'CONFIRMED',
    'party_size', v_party_size,
    'reservation_date', v_date,
    'reservation_time', v_time_slot,
    'seating_section', v_section
  );
END;
$$;


-- --------------------------------------------------------------------
-- 5. UPDATE GET_GUEST_ORDER_BY_TOKEN TO INCLUDE TRACKING_TOKEN
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_guest_order_by_token(
  p_order_number TEXT,
  p_tracking_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
BEGIN
  IF p_order_number IS NULL OR p_tracking_token IS NULL OR LENGTH(p_tracking_token) < 16 THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE (order_number = p_order_number OR id::TEXT = p_order_number)
    AND tracking_token = p_tracking_token;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', oi.id,
      'dish_name', oi.dish_name_snapshot,
      'unit_price', oi.unit_price_snapshot,
      'quantity', oi.quantity,
      'selected_modifiers', oi.selected_modifiers,
      'line_total', oi.line_total
    )
  ), '[]'::jsonb) INTO v_items
  FROM public.order_items oi
  WHERE oi.order_id = v_order.id;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'tracking_token', v_order.tracking_token,
    'order_type', v_order.order_type,
    'table_number', v_order.table_number,
    'order_status', v_order.order_status,
    'payment_status', v_order.payment_status,
    'subtotal', v_order.subtotal,
    'tax_amount', v_order.tax_amount,
    'delivery_fee', v_order.delivery_fee,
    'tip_amount', v_order.tip_amount,
    'total_amount', v_order.total_amount,
    'created_at', v_order.created_at,
    'items', v_items
  );
END;
$$;
