// Supabase Edge Function: razorpay-webhook
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { computeHmacSha256, constantTimeCompare } from "../_shared/razorpayClient.ts";

declare const Deno: any;

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Webhook secrets not configured on server." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. MUST verify signature using RAW request body
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const eventId = req.headers.get("x-razorpay-event-id");

    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing x-razorpay-signature header." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const expectedSignature = await computeHmacSha256(rawBody, webhookSecret);
    const isSignatureValid = constantTimeCompare(expectedSignature, signature);

    if (!isSignatureValid) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const event = JSON.parse(rawBody);

    // 2. Process Events
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    if (!paymentEntity) {
      // Ignore irrelevant non-payment webhook events safely
      return new Response(JSON.stringify({ status: "acknowledged_no_action" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;
    const amountInInr = Number(paymentEntity.amount) / 100;
    const currency = paymentEntity.currency || "INR";

    // Locate linked Craftsland order
    let craftslandOrderId = paymentEntity.notes?.craftsland_order_id;

    if (!craftslandOrderId && razorpayOrderId) {
      const { data: paymentRow } = await supabaseAdmin
        .from("payments")
        .select("order_id")
        .eq("provider_order_id", razorpayOrderId)
        .maybeSingle();

      if (paymentRow) {
        craftslandOrderId = paymentRow.order_id;
      }
    }

    if (!craftslandOrderId) {
      return new Response(JSON.stringify({ status: "order_not_found_in_database" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // A. Handle Payment Capture / Success
    // Atomic execution: settlement and webhook idempotency recording happen in the same DB transaction.
    // If settlement fails, the event is NOT marked processed, ensuring Razorpay retries succeed.
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const { data: settleResult, error: settleError } = await supabaseAdmin.rpc("settle_order_payment", {
        p_order_id: craftslandOrderId,
        p_razorpay_order_id: razorpayOrderId,
        p_razorpay_payment_id: razorpayPaymentId,
        p_amount: amountInInr,
        p_currency: currency,
        p_event_id: eventId || null,
        p_event_type: eventType,
        p_resource_id: razorpayPaymentId,
      });

      if (settleError) {
        return new Response(
          JSON.stringify({ error: settleError.message || "Failed to commit settlement via webhook." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      if (settleResult?.idempotent) {
        return new Response(JSON.stringify({ status: "idempotent_duplicate_ignored" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ status: "settled_successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // B. Handle Payment Failure
    if (eventType === "payment.failed") {
      if (eventId) {
        const { data: existingEvent } = await supabaseAdmin
          .from("processed_webhook_events")
          .select("event_id")
          .eq("event_id", eventId)
          .maybeSingle();

        if (existingEvent) {
          return new Response(JSON.stringify({ status: "idempotent_duplicate_ignored" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // CRITICAL: Inspect current status. A stale FAILED event must NEVER revert a PAID order!
      const { data: currentOrder } = await supabaseAdmin
        .from("orders")
        .select("payment_status")
        .eq("id", craftslandOrderId)
        .maybeSingle();

      if (currentOrder && currentOrder.payment_status === "PAID") {
        return new Response(JSON.stringify({ status: "stale_failed_event_ignored" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Record failure on the specific payment attempt
      if (razorpayOrderId) {
        await supabaseAdmin
          .from("payments")
          .update({
            status: "FAILED",
            error_message: paymentEntity.error_description || "Payment failed at gateway.",
            updated_at: new Date().toISOString(),
          })
          .eq("provider_order_id", razorpayOrderId)
          .neq("status", "PAID");
      }

      if (eventId) {
        await supabaseAdmin
          .from("processed_webhook_events")
          .insert({
            event_id: eventId,
            event_type: eventType,
            resource_id: paymentEntity.id || eventId,
          });
      }

      return new Response(JSON.stringify({ status: "failure_recorded" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: "event_acknowledged" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Webhook processing error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
