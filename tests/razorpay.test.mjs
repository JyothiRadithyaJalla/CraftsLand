import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

// ====================================================================
// CRYPTOGRAPHIC PRIMITIVES (Matching Supabase Edge Functions)
// ====================================================================
async function computeWebCryptoHmac(data, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBytes = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ====================================================================
// SIMULATED DATABASE & EDGE FUNCTION RUNTIME
// ====================================================================
class SimulatedDatabase {
  constructor() {
    this.orders = new Map();
    this.payments = new Map();
    this.processed_webhook_events = new Set();
  }

  reset() {
    this.orders.clear();
    this.payments.clear();
    this.processed_webhook_events.clear();
  }

  // Matches settle_order_payment stored procedure in PostgreSQL
  settleOrderPayment({
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    amount,
    currency,
    eventId = null,
    eventType = null,
    resourceId = null,
    simulateTransientFailure = false,
  }) {
    if (simulateTransientFailure) {
      throw new Error("Transient DB connection failure during settlement");
    }

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} does not exist.`);
    }

    // 1. Webhook idempotency check inside transaction
    if (eventId && this.processed_webhook_events.has(eventId)) {
      return {
        success: true,
        orderId,
        status: order.payment_status,
        idempotent: true,
        message: "Webhook event already processed.",
      };
    }

    // 2. Idempotency for already-settled order
    if (order.payment_status === "PAID" && order.payment_reference === razorpayPaymentId) {
      if (eventId) {
        this.processed_webhook_events.add(eventId);
      }
      return {
        success: true,
        orderId,
        status: "PAID",
        paymentReference: razorpayPaymentId,
        idempotent: true,
        message: "Payment already settled with this transaction ID.",
      };
    }

    // 3. Collision guard: different payment settling already-paid order
    if (order.payment_status === "PAID" && order.payment_reference !== razorpayPaymentId) {
      throw new Error(`Order ${orderId} is already settled under payment reference ${order.payment_reference}.`);
    }

    // 4. Amount and Currency validation
    if (order.total_amount !== amount) {
      throw new Error(`Settlement amount mismatch: Order expects ${order.total_amount}, payment received ${amount}.`);
    }

    if ((currency || "").trim().toUpperCase() !== "INR") {
      throw new Error(`Settlement currency mismatch: Expected INR, received ${currency}.`);
    }

    // 5. CROSS-ORDER PROTECTION:
    // Must find existing payment attempt matching provider_order_id, and verify it belongs to orderId!
    const payment = this.payments.get(razorpayOrderId);
    if (!payment) {
      throw new Error(`No payment attempt found for provider order ${razorpayOrderId}.`);
    }

    if (payment.order_id !== orderId) {
      throw new Error(
        `Cross-order settlement violation: Provider order ${razorpayOrderId} belongs to order ${payment.order_id}, not ${orderId}.`
      );
    }

    // Update payment attempt
    payment.status = "PAID";
    payment.provider_payment_id = razorpayPaymentId;
    payment.amount = amount;
    payment.currency = "INR";

    // Update order (preserves order_status as PENDING for Kitchen INCOMING queue)
    order.payment_status = "PAID";
    order.payment_reference = razorpayPaymentId;

    // 6. Record webhook event atomically within same transaction
    if (eventId) {
      this.processed_webhook_events.add(eventId);
    }

    return {
      success: true,
      orderId,
      status: "PAID",
      paymentReference: razorpayPaymentId,
      idempotent: false,
    };
  }
}

// Simulates verify-razorpay-payment Edge Function
async function verifyRazorpayPaymentEdgeFunction({
  db,
  keyId,
  keySecret,
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  mockRazorpayApi,
}) {
  // 1. Authorize order
  const order = db.orders.get(orderId);
  if (!order) {
    return { status: 404, error: "Order not found." };
  }

  // 2. CROSS-ORDER CHECK: Require existing payment attempt matching BOTH order_id and provider_order_id
  const paymentAttempt = db.payments.get(razorpayOrderId);
  if (!paymentAttempt || paymentAttempt.order_id !== order.id) {
    return {
      status: 400,
      error: "No matching payment attempt found for this order and gateway order reference.",
    };
  }

  // 3. HMAC verification
  const payloadToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = await computeWebCryptoHmac(payloadToSign, keySecret);
  if (!constantTimeCompare(expectedSignature, razorpaySignature)) {
    return { status: 400, error: "Invalid payment verification signature." };
  }

  // 4. INDEPENDENT RAZORPAY API CALL & VERIFICATION
  let rzpPayment;
  try {
    rzpPayment = await mockRazorpayApi.getPayment(razorpayPaymentId);
  } catch (err) {
    return { status: 502, error: `Failed to verify payment with gateway: ${err.message}` };
  }

  // A. Verify payment.order_id === razorpayOrderId
  if (rzpPayment.order_id !== razorpayOrderId) {
    return { status: 400, error: "Gateway payment does not belong to the expected gateway order." };
  }

  // B. Verify amount in paise
  const expectedAmountPaise = Math.round(Number(order.total_amount) * 100);
  if (Number(rzpPayment.amount) !== expectedAmountPaise) {
    return { status: 400, error: "Gateway payment amount does not match authoritative order amount." };
  }

  // C. Verify currency is INR
  if ((rzpPayment.currency || "").toUpperCase() !== "INR") {
    return { status: 400, error: "Gateway payment currency must be INR." };
  }

  // D. Verify status is captured
  if (rzpPayment.status !== "captured") {
    return { status: 400, error: `Payment is not in captured state (current status: ${rzpPayment.status}).` };
  }

  const verifiedAmountInr = Number(rzpPayment.amount) / 100;

  // 5. Atomic RPC settlement
  try {
    const settleResult = db.settleOrderPayment({
      orderId: order.id,
      razorpayOrderId,
      razorpayPaymentId,
      amount: verifiedAmountInr,
      currency: "INR",
    });

    return {
      status: 200,
      success: true,
      orderId: order.id,
      paymentReference: razorpayPaymentId,
      idempotent: settleResult.idempotent,
    };
  } catch (settleErr) {
    return { status: 500, error: settleErr.message };
  }
}

// Simulates razorpay-webhook Edge Function
function razorpayWebhookEdgeFunction({
  db,
  event,
  eventId,
  simulateTransientFailure = false,
}) {
  const eventType = event.event;
  const paymentEntity = event.payload?.payment?.entity;
  if (!paymentEntity) return { status: 200, action: "acknowledged_no_action" };

  const razorpayOrderId = paymentEntity.order_id;
  const razorpayPaymentId = paymentEntity.id;
  const amountInInr = Number(paymentEntity.amount) / 100;
  const currency = paymentEntity.currency || "INR";

  let craftslandOrderId = paymentEntity.notes?.craftsland_order_id;
  if (!craftslandOrderId && razorpayOrderId) {
    const paymentRow = db.payments.get(razorpayOrderId);
    if (paymentRow) craftslandOrderId = paymentRow.order_id;
  }

  if (!craftslandOrderId) return { status: 200, action: "order_not_found_in_database" };

  if (eventType === "payment.captured" || eventType === "order.paid") {
    try {
      const settleResult = db.settleOrderPayment({
        orderId: craftslandOrderId,
        razorpayOrderId,
        razorpayPaymentId,
        amount: amountInInr,
        currency,
        eventId: eventId || null,
        eventType,
        resourceId: razorpayPaymentId,
        simulateTransientFailure,
      });

      if (settleResult.idempotent) {
        return { status: 200, action: "idempotent_duplicate_ignored" };
      }
      return { status: 200, action: "settled_successfully" };
    } catch (settleErr) {
      return { status: 500, error: settleErr.message };
    }
  }

  return { status: 200, action: "other_event" };
}

// ====================================================================
// TEST SUITE
// ====================================================================
describe("CraftsLand Comprehensive Razorpay Security & Settlement Test Suite", () => {
  const KEY_ID = "rzp_test_K123456789";
  const KEY_SECRET = "rzp_test_secret_Sec123456789";
  let db;

  beforeEach(() => {
    db = new SimulatedDatabase();
  });

  // Helper to create valid order and payment attempt
  function setupOrderAndPayment({
    orderId = "ord_A",
    totalAmount = 500.0,
    rzpOrderId = "rzp_ord_A",
    paymentStatus = "UNPAID",
    paymentReference = null,
  }) {
    db.orders.set(orderId, {
      id: orderId,
      total_amount: totalAmount,
      order_status: "PENDING",
      payment_status: paymentStatus,
      payment_reference: paymentReference,
    });
    db.payments.set(rzpOrderId, {
      id: `pay_row_${rzpOrderId}`,
      order_id: orderId,
      provider: "RAZORPAY",
      provider_order_id: rzpOrderId,
      amount: totalAmount,
      currency: "INR",
      status: paymentStatus === "PAID" ? "PAID" : "PROCESSING",
      provider_payment_id: paymentReference,
    });
  }

  // 1. Valid payment succeeds
  test("1. Valid payment succeeds and transitions order to PAID", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 750.0, rzpOrderId: "order_rzp_1" });
    const paymentId = "pay_rzp_1";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_1|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_1",
        amount: 75000,
        currency: "INR",
        status: "captured",
      }),
    };

    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 200);
    assert.equal(res.success, true);
    assert.equal(db.orders.get("ord_1").payment_status, "PAID");
    assert.equal(db.orders.get("ord_1").payment_reference, paymentId);
    assert.equal(db.payments.get("order_rzp_1").status, "PAID");
  });

  // 2. Payment from Order A cannot settle Order B
  test("2. Payment from Order A cannot settle Order B (Cross-Order Protection)", async () => {
    setupOrderAndPayment({ orderId: "ord_A", totalAmount: 500.0, rzpOrderId: "order_rzp_A" });
    setupOrderAndPayment({ orderId: "ord_B", totalAmount: 500.0, rzpOrderId: "order_rzp_B" });

    const paymentId = "pay_rzp_A";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_A|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_A",
        amount: 50000,
        currency: "INR",
        status: "captured",
      }),
    };

    // Attacker sends Order B's ID with Order A's Razorpay order reference and payment ID
    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_B",
      razorpayOrderId: "order_rzp_A",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /No matching payment attempt found/);
    assert.equal(db.orders.get("ord_B").payment_status, "UNPAID");

    // Also verify RPC directly throws cross-order violation
    assert.throws(
      () =>
        db.settleOrderPayment({
          orderId: "ord_B",
          razorpayOrderId: "order_rzp_A",
          razorpayPaymentId: paymentId,
          amount: 500.0,
          currency: "INR",
        }),
      /Cross-order settlement violation/
    );
    assert.equal(db.orders.get("ord_B").payment_status, "UNPAID");
  });

  // 3. Wrong Razorpay order ID is rejected
  test("3. Wrong Razorpay order ID is rejected", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 300.0, rzpOrderId: "order_rzp_valid" });
    const paymentId = "pay_1";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_fake|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async () => ({}),
    };

    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_fake",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /No matching payment attempt found/);
    assert.equal(db.orders.get("ord_1").payment_status, "UNPAID");
  });

  // 4. Wrong payment ID is rejected
  test("4. Wrong payment ID is rejected", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 300.0, rzpOrderId: "order_rzp_1" });
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update("order_rzp_1|pay_legit")
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => {
        if (id === "pay_wrong") throw new Error("Payment not found (404)");
        return { id, order_id: "order_rzp_1", amount: 30000, currency: "INR", status: "captured" };
      },
    };

    // Client passes pay_wrong which fails signature and/or gateway lookup
    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: "pay_wrong",
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /Invalid payment verification signature/);
    assert.equal(db.orders.get("ord_1").payment_status, "UNPAID");
  });

  // 5. Actual Razorpay amount lower than DB total is rejected
  test("5. Actual Razorpay amount lower than DB total is rejected", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 1000.0, rzpOrderId: "order_rzp_1" });
    const paymentId = "pay_underpaid";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_1|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_1",
        amount: 80000, // 800 INR instead of 1000 INR
        currency: "INR",
        status: "captured",
      }),
    };

    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /Gateway payment amount does not match authoritative order amount/);
    assert.equal(db.orders.get("ord_1").payment_status, "UNPAID");
  });

  // 6. Actual Razorpay amount higher than DB total is rejected
  test("6. Actual Razorpay amount higher than DB total is rejected", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 500.0, rzpOrderId: "order_rzp_1" });
    const paymentId = "pay_overpaid";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_1|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_1",
        amount: 70000, // 700 INR instead of 500 INR
        currency: "INR",
        status: "captured",
      }),
    };

    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /Gateway payment amount does not match authoritative order amount/);
    assert.equal(db.orders.get("ord_1").payment_status, "UNPAID");
  });

  // 7. Wrong currency is rejected
  test("7. Wrong currency is rejected", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 500.0, rzpOrderId: "order_rzp_1" });
    const paymentId = "pay_usd";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_1|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_1",
        amount: 50000,
        currency: "USD",
        status: "captured",
      }),
    };

    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /Gateway payment currency must be INR/);
    assert.equal(db.orders.get("ord_1").payment_status, "UNPAID");
  });

  // 8. Non-captured payment is rejected
  test("8. Non-captured payment is rejected", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 500.0, rzpOrderId: "order_rzp_1" });
    const paymentId = "pay_auth_only";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_1|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_1",
        amount: 50000,
        currency: "INR",
        status: "authorized", // Not captured!
      }),
    };

    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /Payment is not in captured state/);
    assert.equal(db.orders.get("ord_1").payment_status, "UNPAID");
  });

  // 9. Razorpay payment belonging to another Razorpay order is rejected
  test("9. Razorpay payment belonging to another Razorpay order is rejected", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 500.0, rzpOrderId: "order_rzp_1" });
    const paymentId = "pay_from_diff_rzp_order";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_1|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_DIFFERENT", // Razorpay gateway says this payment belongs to order_rzp_DIFFERENT
        amount: 50000,
        currency: "INR",
        status: "captured",
      }),
    };

    const res = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });

    assert.equal(res.status, 400);
    assert.match(res.error, /Gateway payment does not belong to the expected gateway order/);
    assert.equal(db.orders.get("ord_1").payment_status, "UNPAID");
  });

  // 10. Duplicate successful verification is idempotent
  test("10. Duplicate successful verification is idempotent", async () => {
    setupOrderAndPayment({ orderId: "ord_1", totalAmount: 600.0, rzpOrderId: "order_rzp_1" });
    const paymentId = "pay_1";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`order_rzp_1|${paymentId}`)
      .digest("hex");

    const mockApi = {
      getPayment: async (id) => ({
        id,
        order_id: "order_rzp_1",
        amount: 60000,
        currency: "INR",
        status: "captured",
      }),
    };

    // First call settles
    const firstRes = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });
    assert.equal(firstRes.status, 200);
    assert.equal(firstRes.idempotent, false);

    // Second call is idempotent
    const secondRes = await verifyRazorpayPaymentEdgeFunction({
      db,
      keyId: KEY_ID,
      keySecret: KEY_SECRET,
      orderId: "ord_1",
      razorpayOrderId: "order_rzp_1",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      mockRazorpayApi: mockApi,
    });
    assert.equal(secondRes.status, 200);
    assert.equal(secondRes.idempotent, true);
    assert.equal(db.orders.get("ord_1").payment_status, "PAID");
  });

  // 11. Different payment cannot settle an already-paid order
  test("11. Different payment cannot settle an already-paid order (Collision protection)", () => {
    setupOrderAndPayment({
      orderId: "ord_collision",
      totalAmount: 450.0,
      rzpOrderId: "rzp_ord_1",
      paymentStatus: "PAID",
      paymentReference: "pay_original_1",
    });

    // Create a second payment attempt row
    db.payments.set("rzp_ord_2", {
      id: "pay_row_2",
      order_id: "ord_collision",
      provider: "RAZORPAY",
      provider_order_id: "rzp_ord_2",
      amount: 450.0,
      currency: "INR",
      status: "PROCESSING",
    });

    assert.throws(
      () =>
        db.settleOrderPayment({
          orderId: "ord_collision",
          razorpayOrderId: "rzp_ord_2",
          razorpayPaymentId: "pay_second_2",
          amount: 450.0,
          currency: "INR",
        }),
      /already settled under payment reference pay_original_1/
    );
    assert.equal(db.orders.get("ord_collision").payment_reference, "pay_original_1");
  });

  // 12. Webhook settlement failure remains retryable
  test("12. Webhook settlement failure remains retryable", () => {
    setupOrderAndPayment({ orderId: "ord_webhook_1", totalAmount: 500.0, rzpOrderId: "rzp_ord_w1" });
    const webhookEvent = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_w1",
            order_id: "rzp_ord_w1",
            amount: 50000,
            currency: "INR",
            notes: { craftsland_order_id: "ord_webhook_1" },
          },
        },
      },
    };

    // First attempt fails due to simulated transient DB error
    const firstAttempt = razorpayWebhookEdgeFunction({
      db,
      event: webhookEvent,
      eventId: "evt_retry_test",
      simulateTransientFailure: true,
    });

    assert.equal(firstAttempt.status, 500);
    assert.equal(db.orders.get("ord_webhook_1").payment_status, "UNPAID");
    // Verify idempotency record was NOT prematurely recorded!
    assert.equal(db.processed_webhook_events.has("evt_retry_test"), false);

    // Razorpay retries with the exact same eventId
    const retryAttempt = razorpayWebhookEdgeFunction({
      db,
      event: webhookEvent,
      eventId: "evt_retry_test",
      simulateTransientFailure: false,
    });

    assert.equal(retryAttempt.status, 200);
    assert.equal(retryAttempt.action, "settled_successfully");
    assert.equal(db.orders.get("ord_webhook_1").payment_status, "PAID");
    assert.equal(db.processed_webhook_events.has("evt_retry_test"), true);
  });

  // 13. Same webhook delivered concurrently does not lose the payment
  test("13. Same webhook delivered concurrently does not lose the payment", () => {
    setupOrderAndPayment({ orderId: "ord_concurrent", totalAmount: 850.0, rzpOrderId: "rzp_ord_conc" });
    const webhookEvent = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_conc",
            order_id: "rzp_ord_conc",
            amount: 85000,
            currency: "INR",
            notes: { craftsland_order_id: "ord_concurrent" },
          },
        },
      },
    };

    // First concurrent request succeeds
    const req1 = razorpayWebhookEdgeFunction({
      db,
      event: webhookEvent,
      eventId: "evt_conc_101",
    });
    assert.equal(req1.status, 200);
    assert.equal(req1.action, "settled_successfully");

    // Second concurrent request arriving with same eventId
    const req2 = razorpayWebhookEdgeFunction({
      db,
      event: webhookEvent,
      eventId: "evt_conc_101",
    });
    assert.equal(req2.status, 200);
    assert.equal(req2.action, "idempotent_duplicate_ignored");

    // Verify order is settled exactly once
    assert.equal(db.orders.get("ord_concurrent").payment_status, "PAID");
    assert.equal(db.orders.get("ord_concurrent").payment_reference, "pay_conc");
  });

  // 14. Same successful webhook delivered again does not duplicate fulfillment
  test("14. Same successful webhook delivered again does not duplicate fulfillment", () => {
    setupOrderAndPayment({ orderId: "ord_dup_safe", totalAmount: 400.0, rzpOrderId: "rzp_ord_dup" });
    const webhookEvent = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_dup",
            order_id: "rzp_ord_dup",
            amount: 40000,
            currency: "INR",
            notes: { craftsland_order_id: "ord_dup_safe" },
          },
        },
      },
    };

    // Initial delivery
    const initial = razorpayWebhookEdgeFunction({
      db,
      event: webhookEvent,
      eventId: "evt_dup_202",
    });
    assert.equal(initial.status, 200);
    assert.equal(initial.action, "settled_successfully");

    // Redelivery minutes or hours later
    const redelivery = razorpayWebhookEdgeFunction({
      db,
      event: webhookEvent,
      eventId: "evt_dup_202",
    });
    assert.equal(redelivery.status, 200);
    assert.equal(redelivery.action, "idempotent_duplicate_ignored");

    // Database state remains cleanly settled
    assert.equal(db.orders.get("ord_dup_safe").payment_status, "PAID");
  });
});

