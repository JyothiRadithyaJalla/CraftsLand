-- ================================================================
-- MIGRATION: 2026091603_order_realtime_events.sql
-- Enables instantaneous Supabase Realtime delivery of kitchen order status
-- updates to customers (both authenticated and guest) with zero PII exposure.
-- ================================================================

-- 1. Create order_status_events table
CREATE TABLE IF NOT EXISTS public.order_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  order_status order_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for lightning-fast real-time filtering
CREATE INDEX IF NOT EXISTS idx_order_status_events_order_id ON public.order_status_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_events_order_num ON public.order_status_events(order_number);

-- 2. Trigger function to emit order status event whenever order_status changes
CREATE OR REPLACE FUNCTION public.fn_emit_order_status_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND OLD.order_status IS DISTINCT FROM NEW.order_status) THEN
    INSERT INTO public.order_status_events (order_id, order_number, order_status, created_at)
    VALUES (NEW.id, NEW.order_number, NEW.order_status, NOW());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_emit_order_status_event ON public.orders;
CREATE TRIGGER trg_emit_order_status_event
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.fn_emit_order_status_event();

-- 3. Enable RLS: Read-only access to order status events (Contains NO PII)
ALTER TABLE public.order_status_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public order status events read" ON public.order_status_events;
CREATE POLICY "Public order status events read" ON public.order_status_events
  FOR SELECT USING (true);

-- 4. Enable full replica identity and publish to Supabase Realtime
ALTER TABLE public.order_status_events REPLICA IDENTITY FULL;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_events;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
