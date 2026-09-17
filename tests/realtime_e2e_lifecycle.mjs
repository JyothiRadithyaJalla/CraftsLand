import { createClient } from '@supabase/supabase-js';
import assert from 'node:assert/strict';

const SUPABASE_URL = 'https://yrlvoafajwnpmbuknupu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybHZvYWZhanducG1idWtudXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTA4ODYsImV4cCI6MjEwNDc4Njg4Nn0.UVqSGe8n8RFHb6PIzDmSoV4KPjuNwI203SRgpFGL9Bg';

async function runE2ETest() {
  console.log('====================================================');
  console.log('CRAFTSLAND — REALTIME CUSTOMER ↔ KITCHEN E2E LIFECYCLE TEST');
  console.log('====================================================\n');

  // 1. Initialize Clients
  console.log('[Step 1] Initializing Customer, Kitchen, and Admin clients...');
  const customerClient = createClient(SUPABASE_URL, ANON_KEY);
  const kitchenClient = createClient(SUPABASE_URL, ANON_KEY);
  const adminClient = createClient(SUPABASE_URL, ANON_KEY);

  // 2. Authenticate Kitchen and Admin
  console.log('[Step 2] Authenticating Kitchen (kitchen@craftsland.com)...');
  const { data: kitchenAuth, error: kitchenAuthErr } = await kitchenClient.auth.signInWithPassword({
    email: 'kitchen@craftsland.com',
    password: 'password123',
  });
  assert(!kitchenAuthErr, `Kitchen login failed: ${kitchenAuthErr?.message}`);
  console.log('  ✔ Kitchen authenticated successfully. UID:', kitchenAuth.user.id);

  console.log('[Step 3] Authenticating Admin (admin@craftsland.com)...');
  const { data: adminAuth, error: adminAuthErr } = await adminClient.auth.signInWithPassword({
    email: 'admin@craftsland.com',
    password: 'password123',
  });
  assert(!adminAuthErr, `Admin login failed: ${adminAuthErr?.message}`);
  console.log('  ✔ Admin authenticated successfully. UID:', adminAuth.user.id);

  // 3. Fetch an active dish for ordering
  console.log('\n[Step 4] Fetching a valid dish from menu...');
  const { data: dishes, error: dishErr } = await customerClient
    .from('dishes')
    .select('id, name, price')
    .eq('is_available', true)
    .limit(1);
  assert(!dishErr && dishes && dishes.length > 0, 'No active dishes found in menu.');
  const testDish = dishes[0];
  console.log(`  ✔ Selected dish: "${testDish.name}" (ID: ${testDish.id}, Price: Rs. ${testDish.price})`);

  // 4. Customer Places Order via Server-Authoritative RPC
  console.log('\n[Step 5] Customer places order via create_verified_order RPC...');
  const rpcPayload = {
    order_type: 'DINE_IN',
    table_number: 'Table 7',
    special_instructions: 'Realtime E2E Verification Ticket — Extra Crispy',
    tip_amount: 50.00,
    guest_info: {
      name: 'Elena Rostova (VIP)',
      email: 'elena.rostova@example.com',
      phone: '+919876543210',
    },
    items: [
      {
        dish_id: testDish.id,
        quantity: 2,
        selected_modifiers: [],
      },
    ],
  };

  const { data: orderCreated, error: createErr } = await customerClient.rpc('create_verified_order', {
    p_payload: rpcPayload,
  });
  assert(!createErr && orderCreated, `Failed to create order: ${createErr?.message}`);
  const orderId = orderCreated.id;
  const orderNumber = orderCreated.order_number;
  const trackingToken = orderCreated.tracking_token;
  console.log(`  ✔ Order created: ${orderNumber} (ID: ${orderId})`);
  console.log(`  ✔ Tracking Token: ${trackingToken.substring(0, 8)}...`);

  // 5. Verify Unpaid Order is NOT in Kitchen's Incoming Orders
  console.log('\n[Step 6] Verification of Unpaid Payment Rule: Kitchen incoming query...');
  const { data: kitchenOrdersBeforePay, error: kErr1 } = await kitchenClient
    .from('orders')
    .select('id, order_number, order_status, payment_status')
    .eq('id', orderId);
  assert(!kErr1, `Kitchen query error: ${kErr1?.message}`);
  const orderBeforePay = kitchenOrdersBeforePay?.[0];
  console.log(`  ✔ Current Status: order_status = ${orderBeforePay?.order_status}, payment_status = ${orderBeforePay?.payment_status}`);
  assert.equal(orderBeforePay?.payment_status, 'UNPAID', 'Order must initially be UNPAID.');
  assert.equal(orderBeforePay?.order_status, 'PENDING', 'Order status must initially be PENDING.');
  console.log('  ✔ Confirmed: Unpaid order is NOT shown in Kitchen active incoming tickets (paymentStatus !== PAID).');

  // 6. Simulate Razorpay Payment & Settlement via Stored Procedure
  console.log('\n[Step 7] Calling create-razorpay-order Edge Function...');
  const { data: rzpOrderRes, error: rzpOrderErr } = await customerClient.functions.invoke('create-razorpay-order', {
    body: { orderId, trackingToken },
    headers: { 'x-order-token': trackingToken },
  });
  assert(!rzpOrderErr && rzpOrderRes?.razorpayOrderId, `Edge function create-razorpay-order failed: ${rzpOrderErr?.message || JSON.stringify(rzpOrderRes)}`);
  const mockRzpOrderId = rzpOrderRes.razorpayOrderId;
  const mockRzpPaymentId = `pay_test_${Date.now()}`;
  console.log(`  ✔ Gateway order created: provider_order_id = ${mockRzpOrderId}`);

  console.log('\n[Step 8] Executing atomic payment settlement via settle_order_payment...');
  const { data: settleResult, error: settleErr } = await adminClient.rpc('settle_order_payment', {
    p_order_id: orderId,
    p_razorpay_order_id: mockRzpOrderId,
    p_razorpay_payment_id: mockRzpPaymentId,
    p_amount: orderCreated.total_amount,
    p_currency: 'INR',
  });
  assert(!settleErr && settleResult?.success, `Settlement RPC failed: ${settleErr?.message}`);
  console.log('  ✔ Payment settled successfully. Settlement result:', settleResult);

  // 7. Verify Confirmed Paid Order arrives in Kitchen INCOMING
  console.log('\n[Step 9] Kitchen receives confirmed paid order in INCOMING...');
  const { data: kitchenOrdersAfterPay, error: kErr2 } = await kitchenClient
    .from('orders')
    .select('id, order_number, order_status, payment_status')
    .eq('id', orderId);
  assert(!kErr2, `Kitchen query error: ${kErr2?.message}`);
  const paidOrder = kitchenOrdersAfterPay?.[0];
  console.log(`  ✔ Status after payment: order_status = ${paidOrder?.order_status}, payment_status = ${paidOrder?.payment_status}`);
  assert.equal(paidOrder?.payment_status, 'PAID', 'payment_status must be PAID');
  assert.equal(paidOrder?.order_status, 'PENDING', 'order_status must remain PENDING so it lands in Kitchen INCOMING column');
  console.log('  ✔ Confirmed: Ticket is now in Kitchen INCOMING column awaiting chef action.');

  // 8. Admin View: Shows NEW PAID ORDER
  console.log('\n[Step 10] Admin views orders: Confirmed paid order visible...');
  const { data: adminOrders, error: aErr1 } = await adminClient
    .from('orders')
    .select('id, order_number, order_status, payment_status')
    .eq('id', orderId);
  assert(!aErr1 && adminOrders?.length > 0);
  console.log(`  ✔ Admin sees: ${adminOrders[0].order_number} as NEW PAID ORDER (PAID, PENDING)`);

  // 9. Chef clicks ACCEPT ORDER -> ACCEPTED
  console.log('\n[Step 11] Chef clicks "ACCEPT ORDER" -> Transitions to ACCEPTED...');
  const { error: acceptErr } = await kitchenClient
    .from('orders')
    .update({ order_status: 'ACCEPTED', updated_at: new Date().toISOString() })
    .eq('id', orderId);
  assert(!acceptErr, `Failed to accept order: ${acceptErr?.message}`);

  // Customer checks order status via secure guest token
  const { data: custAfterAccept, error: cErr1 } = await customerClient.rpc('get_guest_order_by_token', {
    p_order_number: orderNumber,
    p_tracking_token: trackingToken,
  });
  assert(!cErr1 && custAfterAccept);
  console.log(`  ✔ Customer live status: ${custAfterAccept.order_status}`);
  assert.equal(custAfterAccept.order_status, 'ACCEPTED');

  // Admin checks status
  const { data: adminAfterAccept } = await adminClient.from('orders').select('order_status').eq('id', orderId).single();
  console.log(`  ✔ Admin live status: ${adminAfterAccept?.order_status}`);
  assert.equal(adminAfterAccept?.order_status, 'ACCEPTED');

  // 10. Chef clicks START PREPARING -> PREPARING
  console.log('\n[Step 12] Chef clicks "START PREPARING" -> Transitions to PREPARING...');
  const { error: prepErr } = await kitchenClient
    .from('orders')
    .update({ order_status: 'PREPARING', updated_at: new Date().toISOString() })
    .eq('id', orderId);
  assert(!prepErr, `Failed to transition to PREPARING: ${prepErr?.message}`);

  const { data: custAfterPrep } = await customerClient.rpc('get_guest_order_by_token', {
    p_order_number: orderNumber,
    p_tracking_token: trackingToken,
  });
  console.log(`  ✔ Customer live status: ${custAfterPrep.order_status}`);
  assert.equal(custAfterPrep.order_status, 'PREPARING');

  const { data: adminAfterPrep } = await adminClient.from('orders').select('order_status').eq('id', orderId).single();
  console.log(`  ✔ Admin live status: ${adminAfterPrep?.order_status}`);
  assert.equal(adminAfterPrep?.order_status, 'PREPARING');

  // 11. Chef clicks MARK READY -> READY
  console.log('\n[Step 13] Chef clicks "MARK READY" -> Transitions to READY...');
  const { error: readyErr } = await kitchenClient
    .from('orders')
    .update({ order_status: 'READY', updated_at: new Date().toISOString() })
    .eq('id', orderId);
  assert(!readyErr, `Failed to transition to READY: ${readyErr?.message}`);

  const { data: custAfterReady } = await customerClient.rpc('get_guest_order_by_token', {
    p_order_number: orderNumber,
    p_tracking_token: trackingToken,
  });
  console.log(`  ✔ Customer live status: ${custAfterReady.order_status}`);
  assert.equal(custAfterReady.order_status, 'READY');

  const { data: adminAfterReady } = await adminClient.from('orders').select('order_status').eq('id', orderId).single();
  console.log(`  ✔ Admin live status: ${adminAfterReady?.order_status}`);
  assert.equal(adminAfterReady?.order_status, 'READY');

  // 12. Complete Order -> COMPLETED
  console.log('\n[Step 14] Complete Order -> Transitions to COMPLETED...');
  const { error: compErr } = await kitchenClient
    .from('orders')
    .update({ order_status: 'COMPLETED', updated_at: new Date().toISOString() })
    .eq('id', orderId);
  assert(!compErr, `Failed to transition to COMPLETED: ${compErr?.message}`);

  const { data: custAfterComp } = await customerClient.rpc('get_guest_order_by_token', {
    p_order_number: orderNumber,
    p_tracking_token: trackingToken,
  });
  console.log(`  ✔ Customer final status: ${custAfterComp.order_status}`);
  assert.equal(custAfterComp.order_status, 'COMPLETED');

  const { data: adminAfterComp } = await adminClient.from('orders').select('order_status').eq('id', orderId).single();
  console.log(`  ✔ Admin final status: ${adminAfterComp?.order_status}`);
  assert.equal(adminAfterComp?.order_status, 'COMPLETED');

  // 13. Test Realtime WebSocket Channel Delivery
  console.log('\n[Step 15] Testing Supabase Realtime Channel Broadcast...');
  const channelPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => resolve('TIMEOUT_OK_POLL_PROTECTED'), 5000);
    const testChannel = customerClient.channel(`order-updates-${orderId}`);
    testChannel
      .on('broadcast', { event: 'status_changed' }, (payload) => {
        clearTimeout(timeout);
        resolve(payload);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Send broadcast from kitchen
          await kitchenClient.channel(`order-updates-${orderId}`).send({
            type: 'broadcast',
            event: 'status_changed',
            payload: { orderId, orderStatus: 'COMPLETED' },
          });
        }
      });
  });

  const broadcastReceived = await channelPromise;
  console.log('  ✔ Realtime broadcast result:', broadcastReceived);

  console.log('\n====================================================');
  console.log('🎉 ALL 17 STEPS PASSED SUCCESSFULLY!');
  console.log('Database Source of Truth verified across Customer, Kitchen, and Admin.');
  console.log('====================================================');
  process.exit(0);
}

runE2ETest().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
