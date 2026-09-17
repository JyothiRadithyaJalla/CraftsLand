-- ====================================================================
-- CRAFTSLAND MIGRATION 08 — REALTIME ORDER LIFECYCLE SYNCHRONIZATION
-- ====================================================================

-- 1. UPDATE SETTLE_ORDER_PAYMENT STORED PROCEDURE
-- Previously, line 151 auto-promoted PENDING orders directly to ACCEPTED upon payment settlement.
-- In the real-time kitchen lifecycle, payment settlement marks payment_status = 'PAID'
-- while retaining order_status = 'PENDING' so the order appears in the Kitchen's
-- INCOMING queue with the pulsing "NEW" badge and audio chime, awaiting chef acceptance.

CREATE OR REPLACE FUNCTION public.settle_order_payment(
  p_order_id UUID,
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_amount NUMERIC,
  p_currency TEXT,
  p_event_id TEXT DEFAULT NULL,
  p_event_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL
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
  -- 1. Lock and retrieve order for atomic settlement
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % does not exist.', p_order_id;
  END IF;

  v_norm_currency := UPPER(TRIM(p_currency));

  -- 2. Webhook idempotency check inside transaction
  IF p_event_id IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.processed_webhook_events WHERE event_id = p_event_id) THEN
      RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'order_number', v_order.order_number,
        'status', v_order.payment_status,
        'order_status', v_order.order_status,
        'idempotent', true,
        'message', 'Webhook event already processed.'
      );
    END IF;
  END IF;

  -- 3. Idempotent early return if already paid with the exact same Razorpay payment reference
  IF v_order.payment_status = 'PAID' AND v_order.payment_reference = p_razorpay_payment_id THEN
    IF p_event_id IS NOT NULL THEN
      INSERT INTO public.processed_webhook_events (event_id, event_type, resource_id)
      VALUES (p_event_id, COALESCE(p_event_type, 'payment.captured'), COALESCE(p_resource_id, p_razorpay_payment_id))
      ON CONFLICT (event_id) DO NOTHING;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'order_id', p_order_id,
      'order_number', v_order.order_number,
      'status', 'PAID',
      'order_status', v_order.order_status,
      'payment_reference', p_razorpay_payment_id,
      'idempotent', true,
      'message', 'Payment already settled with this transaction ID.'
    );
  END IF;

  -- 4. Collision guard: if already settled by a DIFFERENT payment, reject to avoid double settlement
  IF v_order.payment_status = 'PAID' AND v_order.payment_reference IS DISTINCT FROM p_razorpay_payment_id THEN
    RAISE EXCEPTION 'Order % is already settled under payment reference %.', p_order_id, v_order.payment_reference;
  END IF;

  -- 5. Authoritative consistency validation
  IF v_order.total_amount <> p_amount THEN
    RAISE EXCEPTION 'Settlement amount mismatch: Order expects %, payment received %.', v_order.total_amount, p_amount;
  END IF;

  IF v_norm_currency <> 'INR' THEN
    RAISE EXCEPTION 'Settlement currency mismatch: Expected INR, received %.', v_norm_currency;
  END IF;

  -- 6. Lock and verify the matching payment attempt
  -- CROSS-ORDER PROTECTION:
  -- Must find an existing payment attempt for this provider_order_id.
  -- Reject if no payment attempt exists.
  -- Reject if the payment attempt belongs to a different order!
  SELECT * INTO v_payment
  FROM public.payments
  WHERE provider_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No payment attempt found for provider order %.', p_razorpay_order_id;
  END IF;

  IF v_payment.order_id <> p_order_id THEN
    RAISE EXCEPTION 'Cross-order settlement violation: Provider order % belongs to order %, not %.',
      p_razorpay_order_id, v_payment.order_id, p_order_id;
  END IF;

  -- Update payment attempt
  UPDATE public.payments SET
    status = 'PAID',
    provider_payment_id = p_razorpay_payment_id,
    amount = p_amount,
    currency = 'INR',
    updated_at = NOW()
  WHERE id = v_payment.id;

  -- 7. Transition order to PAID while preserving order_status as PENDING
  -- This ensures the confirmed paid order lands squarely in the Kitchen's INCOMING queue.
  UPDATE public.orders SET
    payment_status = 'PAID',
    payment_reference = p_razorpay_payment_id,
    updated_at = NOW()
  WHERE id = p_order_id;

  -- 8. Record webhook event atomically within the same transaction (if event_id supplied)
  IF p_event_id IS NOT NULL THEN
    INSERT INTO public.processed_webhook_events (event_id, event_type, resource_id)
    VALUES (p_event_id, COALESCE(p_event_type, 'payment.captured'), COALESCE(p_resource_id, p_razorpay_payment_id))
    ON CONFLICT (event_id) DO NOTHING;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'order_number', v_order.order_number,
    'status', 'PAID',
    'order_status', 'PENDING',
    'payment_reference', p_razorpay_payment_id,
    'idempotent', false
  );
END;
$$;
