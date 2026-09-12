// Supabase Edge Function: create-razorpay-order
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { callRazorpayOrderApi } from "../_shared/razorpayClient.ts";

declare const Deno: any;

Deno.serve(async (req: Request) => {
  // 1. CORS Preflight
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

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!razorpayKeyId || !razorpayKeySecret || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Payment gateway credentials not configured on server." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { orderId } = body;
    const orderToken = req.headers.get("x-order-token") || body.trackingToken;

    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Fetch authoritative order record
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total_amount, payment_status, customer_id, user_id, tracking_token")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Authorization Verification
    const authHeader = req.headers.get("Authorization");
    let isAuthorized = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const jwt = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);
      if (user && (user.id === order.customer_id || user.id === order.user_id)) {
        isAuthorized = true;
      }
    }

    // Fallback to cryptographic tracking token for guest checkout
    if (!isAuthorized && orderToken && orderToken === order.tracking_token) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized access to order." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. State Check: Prevent paying an already settled order
    if (order.payment_status === "PAID") {
      return new Response(
        JSON.stringify({ error: "Order has already been settled and paid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Authoritative amount in paise (1 INR = 100 paise)
    const totalAmount = Number(order.total_amount);
    const amountPaise = Math.round(totalAmount * 100);

    if (amountPaise <= 0) {
      return new Response(JSON.stringify({ error: "Invalid order amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Invoke Razorpay API
    const rzpOrder = await callRazorpayOrderApi({
      keyId: razorpayKeyId,
      keySecret: razorpayKeySecret,
      amountPaise,
      currency: "INR",
      receipt: order.order_number,
      notes: {
        craftsland_order_id: order.id,
        craftsland_order_number: order.order_number,
      },
    });

    // 7. Log payment attempt in database (status: PROCESSING)
    await supabaseAdmin.from("payments").insert({
      order_id: order.id,
      provider: "RAZORPAY",
      provider_order_id: rzpOrder.id,
      amount: totalAmount,
      currency: "INR",
      status: "PROCESSING",
    });

    return new Response(
      JSON.stringify({
        razorpayOrderId: rzpOrder.id,
        amount: totalAmount,
        amountPaise,
        currency: "INR",
        keyId: razorpayKeyId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to initialize payment gateway." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
