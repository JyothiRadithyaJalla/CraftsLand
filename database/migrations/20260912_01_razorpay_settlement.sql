-- ====================================================================
-- CRAFTSLAND MIGRATION 05 — RAZORPAY ATOMIC SETTLEMENT & IDEMPOTENCY
-- ====================================================================

-- 1. WEBHOOK IDEMPOTENCY TABLE
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on processed_webhook_events
ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff processed_webhook_events read" ON public.processed_webhook_events;
CREATE POLICY "Staff processed_webhook_events read" ON public.processed_webhook_events FOR SELECT
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- 2. HARDEN PAYMENTS TABLE CONSTRAINTS & CURRENCY
ALTER TABLE public.payments ALTER COLUMN currency SET DEFAULT 'INR';

-- Ensure unique provider payment ID (prevents re-use of payment ID across different records)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_provider_payment_id 
  ON public.payments (provider_payment_id) 
  WHERE provider_payment_id IS NOT NULL;

-- Ensure AT MOST ONE payment attempt per order can achieve 'PAID' status
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_paid_order 
  ON public.payments (order_id) 
  WHERE (status = 'PAID');

-- 3. ATOMIC SETTLEMENT STORED PROCEDURE
-- Called by verify-razorpay-payment Edge Function and razorpay-webhook
-- Performs exclusive row-level locking, idempotency check, triple consistency verification,
-- and atomic state transition.
CREATE OR REPLACE FUNCTION public.settle_order_payment(
  p_order_id UUID,
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_amount NUMERIC,
  p_currency TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_payment RECORD;
  v_norm_currency TEXT;
BEGIN
  v_norm_currency := UPPER(TRIM(p_currency));

  -- 1. Acquire exclusive lock on the order row
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % does not exist.', p_order_id;
  END IF;

  -- 2. Idempotent early return if already paid with the exact same Razorpay payment reference
  IF v_order.payment_status = 'PAID' AND v_order.payment_reference = p_razorpay_payment_id THEN
    RETURN jsonb_build_object(
      'success', true,
      'order_id', p_order_id,
      'status', 'PAID',
      'idempotent', true,
      'message', 'Payment already settled with this transaction ID.'
    );
  END IF;

  -- 3. Collision guard: if already settled by a DIFFERENT payment, reject to avoid double settlement
  IF v_order.payment_status = 'PAID' AND v_order.payment_reference IS DISTINCT FROM p_razorpay_payment_id THEN
    RAISE EXCEPTION 'Order % is already settled under payment reference %.', p_order_id, v_order.payment_reference;
  END IF;

  -- 4. Authoritative consistency validation
  IF v_order.total_amount <> p_amount THEN
    RAISE EXCEPTION 'Settlement amount mismatch: Order expects %, payment received %.', v_order.total_amount, p_amount;
  END IF;

  IF v_norm_currency <> 'INR' THEN
    RAISE EXCEPTION 'Settlement currency mismatch: Expected INR, received %.', v_norm_currency;
  END IF;

  -- 5. Lock and update or insert the payment attempt row
  SELECT * INTO v_payment
  FROM public.payments
  WHERE provider_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF FOUND THEN
    UPDATE public.payments SET
      status = 'PAID',
      provider_payment_id = p_razorpay_payment_id,
      amount = p_amount,
      currency = 'INR',
      updated_at = NOW()
    WHERE id = v_payment.id;
  ELSE
    INSERT INTO public.payments (
      order_id,
      provider,
      provider_order_id,
      provider_payment_id,
      amount,
      currency,
      status
    ) VALUES (
      p_order_id,
      'RAZORPAY',
      p_razorpay_order_id,
      p_razorpay_payment_id,
      p_amount,
      'INR',
      'PAID'
    );
  END IF;

  -- 6. Transition order to PAID and auto-accept if in PENDING
  UPDATE public.orders SET
    payment_status = 'PAID',
    payment_reference = p_razorpay_payment_id,
    order_status = CASE 
      WHEN order_status = 'PENDING' THEN 'ACCEPTED'::order_status 
      ELSE order_status 
    END,
    updated_at = NOW()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'order_number', v_order.order_number,
    'status', 'PAID',
    'payment_reference', p_razorpay_payment_id,
    'idempotent', false
  );
END;
$$;
