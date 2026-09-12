// Supabase Edge Function: verify-razorpay-payment
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { computeHmacSha256, constantTimeCompare } from "../_shared/razorpayClient.ts";

declare const Deno: any;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!razorpayKeySecret || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Gateway verification secrets not configured on server." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
    const orderToken = req.headers.get("x-order-token") || body.trackingToken;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return new Response(
        JSON.stringify({ error: "Missing required payment verification parameters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Authorize access to this order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, total_amount, payment_status, customer_id, user_id, tracking_token")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    let isAuthorized = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const jwt = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);
      if (user && (user.id === order.customer_id || user.id === order.user_id)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized && orderToken && orderToken === order.tracking_token) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized access to order." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Cryptographic HMAC-SHA256 Signature Verification
    const payloadToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = await computeHmacSha256(payloadToSign, razorpayKeySecret);

    const isSignatureValid = constantTimeCompare(expectedSignature, razorpaySignature);

    if (!isSignatureValid) {
      // SECURITY RULE: An invalid signature must NOT mark legitimate payment records as FAILED.
      // Simply reject with 400 Bad Request to protect against tampering attacks.
      return new Response(
        JSON.stringify({ error: "Invalid payment verification signature." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Atomic Database Settlement via Stored Procedure
    const { data: settleResult, error: settleError } = await supabaseAdmin.rpc("settle_order_payment", {
      p_order_id: order.id,
      p_razorpay_order_id: razorpayOrderId,
      p_razorpay_payment_id: razorpayPaymentId,
      p_amount: Number(order.total_amount),
      p_currency: "INR",
    });

    if (settleError) {
      return new Response(
        JSON.stringify({ error: settleError.message || "Failed to commit order payment settlement." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        paymentReference: razorpayPaymentId,
        idempotent: settleResult?.idempotent ?? false,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error during payment verification." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
