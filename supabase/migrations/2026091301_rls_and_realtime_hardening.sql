-- ====================================================================
-- CRAFTSLAND MIGRATION 07 — RLS AND REALTIME HARDENING
-- ====================================================================

-- 1. FIX RLS RECURSION IN current_user_role()
-- Marking as SECURITY DEFINER prevents infinite recursion when profiles table
-- RLS policy evaluates current_user_role().
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. UPDATE ORDERS READ ACCESS POLICY
-- Allow KITCHEN role to view COMPLETED orders so status transitions to COMPLETED
-- do not fail SELECT check constraints on update.
DROP POLICY IF EXISTS "Orders read access" ON public.orders;
CREATE POLICY "Orders read access" ON public.orders FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND (auth.uid() = customer_id OR auth.uid() = user_id)) OR
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN') OR
    (public.current_user_role() = 'KITCHEN' AND order_status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'))
  );

-- 3. ENABLE FULL REPLICA IDENTITY FOR REALTIME EVENT REPLICATION
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_items REPLICA IDENTITY FULL;

-- 4. ADD ORDERS AND ORDER_ITEMS TO SUPABASE REALTIME PUBLICATION
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
