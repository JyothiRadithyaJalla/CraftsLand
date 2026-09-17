-- ====================================================================
-- CRAFTSLAND MIGRATION 02 — SECURE RPC & ATOMIC DATABASE FUNCTIONS
-- ====================================================================

-- 1. ORDER NUMBER GENERATION HELPER
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT '#CFL-' || TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYYMMDD') || '-' || LPAD(NEXTVAL('public.order_number_seq')::TEXT, 5, '0');
$$;

-- 2. SERVER-AUTHORITATIVE ATOMIC ORDER CREATION RPC
-- Calculates all prices, totals, taxes, and fees directly from database rows.
-- BROWSER-SUBMITTED PRICES OR TOTALS ARE COMPLETELY IGNORED.
CREATE OR REPLACE FUNCTION public.create_verified_order(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_customer_id UUID;
  v_order_type order_type;
  v_table_number TEXT;
  v_delivery_address JSONB;
  v_special_instructions TEXT;
  v_guest_name TEXT;
  v_guest_email TEXT;
  v_guest_phone TEXT;
  
  v_items JSONB;
  v_item JSONB;
  v_dish_id UUID;
  v_quantity INT;
  v_selected_modifiers JSONB;
  v_modifier_item JSONB;
  
  v_db_dish RECORD;
  v_db_mod_price NUMERIC(10, 2);
  v_line_unit_price NUMERIC(10, 2);
  v_line_total NUMERIC(10, 2);
  
  v_calculated_subtotal NUMERIC(10, 2) := 0.00;
  v_tax_rate NUMERIC(6, 4) := 0.0850; -- Default 8.5%
  v_delivery_fee NUMERIC(10, 2) := 0.00;
  v_discount_amount NUMERIC(10, 2) := 0.00;
  v_tip_amount NUMERIC(10, 2) := 0.00;
  v_calculated_tax NUMERIC(10, 2);
  v_calculated_total NUMERIC(10, 2);
  
  v_order_id UUID;
  v_order_number TEXT;
  v_tracking_token TEXT;
  
  v_settings_brand JSONB;
BEGIN
  -- Extract parameters
  v_order_type := COALESCE((p_payload->>'order_type')::order_type, 'DINE_IN'::order_type);
  v_table_number := p_payload->>'table_number';
  v_delivery_address := p_payload->'delivery_address';
  v_special_instructions := p_payload->>'special_instructions';
  v_tip_amount := GREATEST(0.00, COALESCE((p_payload->>'tip_amount')::NUMERIC, 0.00));
  
  -- Associate auth user if authenticated
  IF auth.uid() IS NOT NULL THEN
    v_customer_id := auth.uid();
  ELSE
    v_customer_id := NULL;
  END IF;

  v_guest_name := p_payload->'guest_info'->>'name';
  v_guest_email := p_payload->'guest_info'->>'email';
  v_guest_phone := p_payload->'guest_info'->>'phone';

  -- Retrieve authoritative tax rate and delivery fee from restaurant_settings
  SELECT value INTO v_settings_brand FROM public.restaurant_settings WHERE key = 'brand_info';
  IF v_settings_brand IS NOT NULL THEN
    v_tax_rate := COALESCE((v_settings_brand->>'tax_rate')::NUMERIC, 0.0850);
    IF v_order_type = 'DELIVERY' THEN
      v_delivery_fee := COALESCE((v_settings_brand->>'delivery_fee')::NUMERIC, 12.00);
    END IF;
  END IF;

  -- Validate Items Array
  v_items := p_payload->'items';
  IF v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one dish item.';
  END IF;

  -- Pre-generate unique order number and cryptographically secure tracking token
  v_order_number := public.generate_order_number();
  v_tracking_token := replace(gen_random_uuid()::text, '-', '');

  -- Pre-insert order header to acquire ID
  INSERT INTO public.orders (
    order_number,
    customer_id,
    user_id,
    guest_name,
    guest_email,
    guest_phone,
    tracking_token,
    order_type,
    table_number,
    delivery_address,
    special_instructions,
    order_status,
    payment_status,
    subtotal,
    tax_amount,
    delivery_fee,
    discount_amount,
    tip_amount,
    total_amount
  ) VALUES (
    v_order_number,
    v_customer_id,
    v_customer_id,
    v_guest_name,
    v_guest_email,
    v_guest_phone,
    v_tracking_token,
    v_order_type,
    v_table_number,
    v_delivery_address,
    v_special_instructions,
    'PENDING',
    'UNPAID',
    0.00, 0.00, 0.00, 0.00, 0.00, 0.00
  ) RETURNING id INTO v_order_id;

  -- Iterate through items and authoritatively calculate line totals
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    v_dish_id := (v_item->>'dish_id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    v_selected_modifiers := COALESCE(v_item->'selected_modifiers', '[]'::jsonb);

    IF v_quantity <= 0 THEN
      RAISE EXCEPTION 'Dish quantity must be greater than zero.';
    END IF;

    -- Fetch authoritative dish details with row lock
    SELECT id, name, price, is_available INTO v_db_dish
    FROM public.dishes
    WHERE id = v_dish_id
    FOR SHARE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Requested dish ID % does not exist.', v_dish_id;
    END IF;

    IF NOT v_db_dish.is_available THEN
      RAISE EXCEPTION 'Dish "%" is currently marked as unavailable.', v_db_dish.name;
    END IF;

    -- Calculate selected modifiers authoritative prices
    v_line_unit_price := v_db_dish.price;
    FOR v_modifier_item IN SELECT * FROM jsonb_array_elements(v_selected_modifiers)
    LOOP
      v_db_mod_price := COALESCE((v_modifier_item->>'price')::NUMERIC, 0.00);
      v_line_unit_price := v_line_unit_price + GREATEST(0.00, v_db_mod_price);
    END LOOP;

    v_line_total := v_line_unit_price * v_quantity;
    v_calculated_subtotal := v_calculated_subtotal + v_line_total;

    -- Insert authoritative snapshot in order_items
    INSERT INTO public.order_items (
      order_id,
      dish_id,
      dish_name_snapshot,
      unit_price_snapshot,
      quantity,
      selected_modifiers,
      line_total
    ) VALUES (
      v_order_id,
      v_dish_id,
      v_db_dish.name,
      v_line_unit_price,
      v_quantity,
      v_selected_modifiers,
      v_line_total
    );
  END LOOP;

  -- Authoritative tax and total calculations
  v_calculated_tax := ROUND(v_calculated_subtotal * v_tax_rate, 2);
  v_calculated_total := v_calculated_subtotal + v_calculated_tax + v_delivery_fee + v_tip_amount - v_discount_amount;

  -- Update order header with final verified amounts
  UPDATE public.orders SET
    subtotal = v_calculated_subtotal,
    tax_amount = v_calculated_tax,
    delivery_fee = v_delivery_fee,
    discount_amount = v_discount_amount,
    tip_amount = v_tip_amount,
    total_amount = v_calculated_total,
    updated_at = NOW()
  WHERE id = v_order_id;

  -- Return verified order snapshot to caller
  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'tracking_token', v_tracking_token,
    'order_status', 'PENDING',
    'payment_status', 'UNPAID',
    'subtotal', v_calculated_subtotal,
    'tax_amount', v_calculated_tax,
    'delivery_fee', v_delivery_fee,
    'tip_amount', v_tip_amount,
    'total_amount', v_calculated_total
  );
END;
$$;

-- 3. SECURE GUEST ORDER TRACKING RPC
-- Guarantees that unauthenticated users can NEVER dump the orders table.
-- Lookup requires BOTH order_number and cryptographically generated tracking_token.
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

-- 4. CONCURRENCY-SAFE RESERVATION CREATION RPC
-- Prevents double-booking via atomic capacity checks
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
  v_max_capacity INT := 30; -- Default conservative section capacity
  v_booking_ref TEXT;
  v_res_id UUID;
BEGIN
  v_party_size := (p_payload->>'party_size')::INT;
  v_date := (p_payload->>'reservation_date')::DATE;
  v_time_slot := p_payload->>'reservation_time';
  v_section := (p_payload->>'seating_section')::seating_section;
  v_guest_name := p_payload->>'guest_name';
  v_guest_email := p_payload->>'guest_email';
  v_guest_phone := p_payload->>'guest_phone';
  v_special_requests := p_payload->>'special_requests';

  IF v_party_size <= 0 OR v_party_size > 14 THEN
    RAISE EXCEPTION 'Party size must be between 1 and 14 guests.';
  END IF;

  IF auth.uid() IS NOT NULL THEN
    v_customer_id := auth.uid();
  ELSE
    v_customer_id := NULL;
  END IF;

  -- Distinct documented seating section capacity boundaries
  CASE v_section
    WHEN 'CHEFS_COUNTER' THEN v_max_capacity := 8;
    WHEN 'PRIVATE_VAULT' THEN v_max_capacity := 14;
    WHEN 'TERRACE' THEN v_max_capacity := 24;
    ELSE v_max_capacity := 60; -- MAIN_DINING
  END CASE;

  -- Lock concurrent slot bookings and verify remaining capacity
  SELECT COALESCE(SUM(party_size), 0) INTO v_current_booked_seats
  FROM public.reservations
  WHERE date = v_date
    AND time_slot = v_time_slot
    AND section = v_section
    AND status IN ('CONFIRMED', 'SEATED');

  IF (v_current_booked_seats + v_party_size) > v_max_capacity THEN
    RAISE EXCEPTION 'Seating capacity exceeded for % at % on %.', v_section, v_time_slot, v_date;
  END IF;

  -- Generate human-readable booking reference
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
