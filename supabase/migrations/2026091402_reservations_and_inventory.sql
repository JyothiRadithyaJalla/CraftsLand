-- ====================================================================
-- CRAFTSLAND MIGRATION 09 — RESERVATION LIFECYCLE & INVENTORY REALTIME
-- ====================================================================

-- 1. ADD 'PENDING' AND 'NO_SHOW' TO RESERVATION_STATUS ENUM
DO $$
BEGIN
  ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'PENDING' BEFORE 'CONFIRMED';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'NO_SHOW';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. ENABLE FULL REPLICA IDENTITY FOR REALTIME DISHES & RESERVATIONS
ALTER TABLE public.dishes REPLICA IDENTITY FULL;
ALTER TABLE public.reservations REPLICA IDENTITY FULL;

-- 3. PUBLISH DISHES & RESERVATIONS IN SUPABASE REALTIME
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.dishes;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 4. UPDATE RESERVATIONS UPDATE POLICY FOR ADMIN/STAFF
DROP POLICY IF EXISTS "Staff reservations update" ON public.reservations;
CREATE POLICY "Staff reservations update" ON public.reservations FOR UPDATE
  USING (
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );
