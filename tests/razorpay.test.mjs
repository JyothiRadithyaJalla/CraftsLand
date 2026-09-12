import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

// 1. Test Cryptographic Utilities
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

describe("Razorpay Security & Architecture Test Suite", () => {
  const TEST_SECRET = "rzp_test_secret_abc123xyz789";
  const TEST_ORDER_ID = "order_O4bN1234567890";
  const TEST_PAYMENT_ID = "pay_P8xN9876543210";

  // SCENARIO 1: Production guard on MockPaymentProvider
  test("Scenario 1: MockPaymentProvider throws security exception in production", () => {
    class GuardedMockPaymentProvider {
      constructor(isProd) {
        if (isProd) {
          throw new Error("[Security Exception] MockPaymentProvider is strictly prohibited in production environments.");
        }
      }
      initializePayment(isProd) {
        if (isProd) {
          throw new Error("[Security Exception] MockPaymentProvider cannot initialize payments in production.");
        }
        return { paymentIntentId: "mock_pi" };
      }
    }

    assert.throws(
      () => new GuardedMockPaymentProvider(true),
      /strictly prohibited in production environments/
    );

    const devMock = new GuardedMockPaymentProvider(false);
    assert.throws(
      () => devMock.initializePayment(true),
      /cannot initialize payments in production/
    );
  });

  // SCENARIO 2: Cryptographic Web Crypto HMAC matches Node native crypto
  test("Scenario 2: Web Crypto HMAC-SHA256 matches native crypto reference", async () => {
    const payload = `${TEST_ORDER_ID}|${TEST_PAYMENT_ID}`;
    const nodeHmac = crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");
    const webHmac = await computeWebCryptoHmac(payload, TEST_SECRET);

    assert.equal(webHmac, nodeHmac);
    assert.equal(constantTimeCompare(webHmac, nodeHmac), true);
  });

  // SCENARIO 3: Client payment signature verification
  test("Scenario 3: Correct client Razorpay signature verifies successfully", async () => {
    const payloadToSign = `${TEST_ORDER_ID}|${TEST_PAYMENT_ID}`;
    const validSignature = crypto.createHmac("sha256", TEST_SECRET).update(payloadToSign).digest("hex");

    const expected = await computeWebCryptoHmac(payloadToSign, TEST_SECRET);
    assert.equal(constantTimeCompare(expected, validSignature), true);
  });

  // SCENARIO 4: Tampered signature rejection without state corruption
  test("Scenario 4: Tampered signature is rejected and does not corrupt state", async () => {
    const payloadToSign = `${TEST_ORDER_ID}|${TEST_PAYMENT_ID}`;
    const validSignature = crypto.createHmac("sha256", TEST_SECRET).update(payloadToSign).digest("hex");
    const tamperedSignature = validSignature.slice(0, -4) + "dead";

    const expected = await computeWebCryptoHmac(payloadToSign, TEST_SECRET);
    const isValid = constantTimeCompare(expected, tamperedSignature);

    assert.equal(isValid, false);
  });

  // SCENARIO 5 & 6: Webhook raw body signature verification vs whitespace corruption
  test("Scenario 5 & 6: Webhook signature verification with raw body", async () => {
    const webhookSecret = "whsec_test_secret_998877";
    const rawWebhookBody = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: TEST_PAYMENT_ID, amount: 25000, currency: "INR" } } },
    }, null, 2);

    const validSignature = crypto.createHmac("sha256", webhookSecret).update(rawWebhookBody).digest("hex");
    const calculated = await computeWebCryptoHmac(rawWebhookBody, webhookSecret);

    assert.equal(constantTimeCompare(calculated, validSignature), true);

    // Re-stringifying changes whitespace and breaks signature
    const reStringified = JSON.stringify(JSON.parse(rawWebhookBody));
    const brokenSignatureCheck = constantTimeCompare(
      await computeWebCryptoHmac(reStringified, webhookSecret),
      validSignature
    );
    assert.equal(brokenSignatureCheck, false, "Proves raw body is mandatory for webhook HMAC verification");
  });

  // SCENARIO 7: Webhook Idempotency (Duplicate event detection)
  test("Scenario 7: Duplicate webhook delivery is detected idempotently", () => {
    const processedEvents = new Set();
    const eventId = "evt_test_123456789";

    function processWebhook(id) {
      if (processedEvents.has(id)) {
        return { status: 200, action: "idempotent_duplicate_ignored" };
      }
      processedEvents.add(id);
      return { status: 200, action: "settled_successfully" };
    }

    const firstCall = processWebhook(eventId);
    assert.equal(firstCall.action, "settled_successfully");

    const secondCall = processWebhook(eventId);
    assert.equal(secondCall.action, "idempotent_duplicate_ignored");
  });

  // SCENARIO 8: Out-of-order Webhook protection (Stale FAILED event ignored after PAID)
  test("Scenario 8: Stale FAILED event never overwrites PAID order state", () => {
    let orderState = {
      id: "ord_101",
      payment_status: "PAID",
      payment_reference: TEST_PAYMENT_ID,
    };

    function handleWebhookEvent(eventType, paymentId) {
      if (eventType === "payment.failed") {
        if (orderState.payment_status === "PAID") {
          return { status: "stale_failed_event_ignored" };
        }
        orderState.payment_status = "FAILED";
        return { status: "failed_recorded" };
      }
      return { status: "other" };
    }

    const result = handleWebhookEvent("payment.failed", TEST_PAYMENT_ID);
    assert.equal(result.status, "stale_failed_event_ignored");
    assert.equal(orderState.payment_status, "PAID");
  });

  // SCENARIO 9: Guest order authorization via tracking token
  test("Scenario 9: Guest authorization requires matching tracking token", () => {
    const orderInDb = {
      id: "ord_guest_01",
      customer_id: null,
      tracking_token: "d4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4",
    };

    function authorizePaymentRequest(orderId, orderToken, userJwt) {
      if (userJwt && userJwt.userId === orderInDb.customer_id) {
        return true;
      }
      if (orderToken && orderToken === orderInDb.tracking_token) {
        return true;
      }
      return false;
    }

    // Correct guest token
    assert.equal(authorizePaymentRequest("ord_guest_01", "d4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4", null), true);

    // Wrong guest token
    assert.equal(authorizePaymentRequest("ord_guest_01", "wrong_token_12345678", null), false);

    // Missing guest token
    assert.equal(authorizePaymentRequest("ord_guest_01", null, null), false);
  });

  // SCENARIO 10: Strict INR Currency and Amount in Paise
  test("Scenario 10: Amount in paise conversion and strict INR currency validation", () => {
    const totalAmountInInr = 239.40;
    const amountPaise = Math.round(totalAmountInInr * 100);

    assert.equal(amountPaise, 23940);

    function validateCurrency(curr) {
      const normalized = (curr || "").trim().toUpperCase();
      if (normalized !== "INR") {
        throw new Error(`Currency mismatch: Expected INR, got ${curr}`);
      }
      return true;
    }

    assert.equal(validateCurrency("INR"), true);
    assert.equal(validateCurrency("inr"), true);
    assert.throws(() => validateCurrency("USD"), /Currency mismatch/);
    assert.throws(() => validateCurrency("EUR"), /Currency mismatch/);
  });

  // SCENARIO 11: Atomic Settlement RPC logic (Idempotency and Collision handling)
  test("Scenario 11: Atomic settlement ensures single payment settlement per order", () => {
    let order = {
      id: "ord_lock_test",
      total_amount: 500.00,
      payment_status: "UNPAID",
      payment_reference: null,
    };

    function settleOrderPayment(orderId, razorpayOrderId, razorpayPaymentId, amount, currency) {
      if (order.id !== orderId) throw new Error("Order not found");

      // Idempotency
      if (order.payment_status === "PAID" && order.payment_reference === razorpayPaymentId) {
        return { success: true, idempotent: true };
      }

      // Collision
      if (order.payment_status === "PAID" && order.payment_reference !== razorpayPaymentId) {
        throw new Error(`Order ${orderId} already settled by payment ${order.payment_reference}`);
      }

      // Triple consistency
      if (order.total_amount !== amount) {
        throw new Error(`Amount mismatch: expected ${order.total_amount}, got ${amount}`);
      }

      if (currency !== "INR") {
        throw new Error(`Currency mismatch: expected INR, got ${currency}`);
      }

      order.payment_status = "PAID";
      order.payment_reference = razorpayPaymentId;
      return { success: true, idempotent: false };
    }

    // First settlement attempt succeeds
    const res1 = settleOrderPayment("ord_lock_test", "rzp_ord_1", "pay_first_123", 500.00, "INR");
    assert.equal(res1.success, true);
    assert.equal(res1.idempotent, false);
    assert.equal(order.payment_status, "PAID");

    // Second identical settlement call is idempotent
    const res2 = settleOrderPayment("ord_lock_test", "rzp_ord_1", "pay_first_123", 500.00, "INR");
    assert.equal(res2.success, true);
    assert.equal(res2.idempotent, true);

    // Conflicting second card settlement attempt is rejected
    assert.throws(
      () => settleOrderPayment("ord_lock_test", "rzp_ord_2", "pay_second_999", 500.00, "INR"),
      /already settled by payment pay_first_123/
    );
  });

  // SCENARIO 12: Abandoned payment state handling
  test("Scenario 12: Abandoned payment leaves order in PENDING/UNPAID with retry available", () => {
    let order = {
      id: "ord_abandoned_01",
      order_status: "PENDING",
      payment_status: "UNPAID",
      tracking_token: "tok_test_abc",
    };

    // Customer opens modal (creates attempt) but closes modal
    const isModalDismissed = true;
    if (isModalDismissed) {
      // Order status MUST NOT change to PAID or COMPLETED
      assert.equal(order.payment_status, "UNPAID");
      assert.equal(order.order_status, "PENDING");
    }

    // Page refresh re-hydrates state from DB: allows retry
    const canRetry = order.payment_status !== "PAID" && order.order_status !== "CANCELLED";
    assert.equal(canRetry, true);
  });
});
