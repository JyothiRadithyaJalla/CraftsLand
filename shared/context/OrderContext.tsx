import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { Order, OrderStatus, CreateOrderPayload } from '../types/order';
import type { PaymentGateway } from '../types/payment';
import { OrderService } from '../services/orderService';
import { MockPaymentProvider } from '../services/payment/MockPaymentProvider';
import { RazorpayPaymentProvider } from '../services/payment/RazorpayPaymentProvider';
import { supabase } from '../services/supabaseClient';
import { env } from '../config/env';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;
  isPlacingOrder: boolean;
  isPaymentConfigured: boolean;
  realtimeStatus: 'Connected' | 'Connecting' | 'Disconnected';
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
  placeOrder: (payload: CreateOrderPayload) => Promise<Order>;
  payPendingOrder: (order: Order) => Promise<Order>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  subscribeToOrder: (orderId: string, callback: (order: Order) => void, trackingToken?: string) => () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [realtimeStatus, setRealtimeStatus] = useState<'Connected' | 'Connecting' | 'Disconnected'>('Connecting');

  const isPaymentConfigured = useMemo(() => {
    if (env.isRazorpayConfigured) return true;
    // Mock is ONLY allowed in local development
    return env.isDevelopment && !env.isProduction;
  }, []);

  const paymentGateway = useMemo<PaymentGateway>(() => {
    if (env.isRazorpayConfigured) {
      return new RazorpayPaymentProvider();
    }
    if (env.isProduction || env.appEnv === 'production') {
      throw new Error('[Security Exception] Online payment gateway is not configured for production.');
    }
    return new MockPaymentProvider();
  }, []);

  const refreshOrders = async () => {
    const list = await OrderService.getOrders();
    setOrders(list);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshOrders();

    if (env.supabaseUrl.includes('.supabase.co')) {
      const channel = supabase
        .channel('public:orders-global')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
          },
          async () => {
            await refreshOrders();
          }
        )
        .on(
          'broadcast',
          { event: 'status_changed' },
          async () => {
            await refreshOrders();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setRealtimeStatus('Connected');
            refreshOrders();
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setRealtimeStatus('Disconnected');
          } else {
            setRealtimeStatus('Connecting');
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setRealtimeStatus('Connected');
    }
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    // Optimistic local update for zero UI lag
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );

    const success = await OrderService.updateOrderStatus(orderId, status);
    if (success) {
      await refreshOrders();
    } else {
      // Revert if database write failed
      await refreshOrders();
    }
    return success;
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    return await OrderService.getOrderById(orderId);
  };

  // Process payment for an existing unpaid order (for retrying abandoned or failed payments)
  const payPendingOrder = async (order: Order): Promise<Order> => {
    setIsPlacingOrder(true);
    try {
      if (order.paymentStatus === 'PAID') {
        return order;
      }

      const effectiveTrackingToken = order.trackingToken || (typeof window !== 'undefined' ? (
        localStorage.getItem(`craftsland_tracking_${order.id}`) ||
        localStorage.getItem(`craftsland_tracking_${order.orderNumber}`)
      ) : undefined) || undefined;

      if (paymentGateway instanceof RazorpayPaymentProvider) {
        const initResult = await paymentGateway.initializePayment({
          orderId: order.id,
          orderNumber: order.orderNumber,
          trackingToken: effectiveTrackingToken,
          amount: order.totalAmount,
          currency: 'INR',
          customerName: order.guestName,
          customerEmail: order.guestEmail,
          customerPhone: order.guestPhone,
        });

        const verifyPromise = new Promise<{ razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }>((resolve, reject) => {
          (paymentGateway as RazorpayPaymentProvider).openCheckoutModal({
            keyId: initResult.keyId || env.razorpayKeyId,
            razorpayOrderId: initResult.razorpayOrderId,
            amountPaise: Math.round(order.totalAmount * 100),
            currency: 'INR',
            customerName: order.guestName,
            customerEmail: order.guestEmail,
            customerPhone: order.guestPhone,
            orderNumber: order.orderNumber,
            onSuccess: (resp) => resolve(resp),
            onDismiss: () => reject(new Error('Payment window closed before completion. Your ticket is preserved and can be paid anytime.')),
            onError: (err) => reject(new Error(err?.description || 'Payment was declined by payment gateway.')),
          }).catch(reject);
        });

        const razorpayResp = await verifyPromise;

        const verification = await paymentGateway.verifyPayment({
          orderId: order.id,
          razorpayOrderId: razorpayResp.razorpay_order_id,
          razorpayPaymentId: razorpayResp.razorpay_payment_id,
          razorpaySignature: razorpayResp.razorpay_signature,
          trackingToken: effectiveTrackingToken,
        });

        if (!verification.success) {
          throw new Error(verification.errorMessage || 'Cryptographic payment verification failed.');
        }

        await refreshOrders();
        const updatedOrder = await OrderService.getOrderById(order.id, effectiveTrackingToken);
        return updatedOrder || { ...order, trackingToken: effectiveTrackingToken, paymentStatus: 'PAID', paymentReference: razorpayResp.razorpay_payment_id };
      }

      // Mock Gateway flow (local development only)
      if (env.isProduction || env.appEnv === 'production') {
        throw new Error('[Security Exception] Mock payment execution is prohibited in production.');
      }

      const initResult = await paymentGateway.initializePayment({
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'INR',
        customerName: order.guestName,
        customerEmail: order.guestEmail,
      });

      const verification = await paymentGateway.verifyPayment(
        initResult.paymentIntentId,
        `mock_pay_${Date.now()}`
      );

      if (!verification.success) {
        throw new Error(verification.errorMessage || 'Mock payment authorization failed.');
      }

      await refreshOrders();
      return { ...order, paymentStatus: 'PAID', paymentReference: verification.paymentReference };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const placeOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    setIsPlacingOrder(true);
    try {
      // 1. Create Server-Verified Order in Database (created as UNPAID & PENDING)
      const createdOrder = await OrderService.createOrder({
        ...payload,
      });

      // 2. Execute Payment Settlement
      return await payPendingOrder(createdOrder);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subscribeToOrder = (orderId: string, callback: (order: Order) => void, trackingToken?: string): () => void => {
    return OrderService.subscribeToOrderUpdates(orderId, (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
      callback(updatedOrder);
    }, trackingToken);
  };

  const activeOrder = orders.find((o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED') || orders[0] || null;

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        isLoading,
        isPlacingOrder,
        isPaymentConfigured,
        realtimeStatus,
        updateOrderStatus,
        refreshOrders,
        placeOrder,
        payPendingOrder,
        getOrderById,
        subscribeToOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

