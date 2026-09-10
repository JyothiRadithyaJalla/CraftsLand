import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Order, OrderStatus, CreateOrderPayload } from '../types/order';
import { OrderService } from '../services/orderService';
import { MockPaymentProvider } from '../services/payment/MockPaymentProvider';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;
  isPlacingOrder: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
  placeOrder: (payload: CreateOrderPayload) => Promise<Order>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  subscribeToOrder: (orderId: string, callback: (order: Order) => void) => () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const paymentGateway = new MockPaymentProvider();

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const refreshOrders = async () => {
    const list = await OrderService.getOrders();
    setOrders(list);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    const success = await OrderService.updateOrderStatus(orderId, status);
    if (success) {
      await refreshOrders();
    }
    return success;
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    return await OrderService.getOrderById(orderId);
  };

  const placeOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    setIsPlacingOrder(true);
    try {
      // 1. Initialize Mock Payment
      const initResult = await paymentGateway.initializePayment({
        orderId: `temp_${Date.now()}`,
        amount: payload.totalAmount,
        currency: 'USD',
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
      });

      // 2. Verify Payment
      const verification = await paymentGateway.verifyPayment(
        initResult.paymentIntentId,
        `pay_ref_${Date.now()}`
      );

      if (!verification.success) {
        throw new Error(verification.errorMessage || 'Payment authorization failed.');
      }

      // 3. Create Order
      const newOrder = await OrderService.createOrder({
        ...payload,
        paymentReference: verification.paymentReference,
      });

      await refreshOrders();
      return newOrder;
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subscribeToOrder = (orderId: string, callback: (order: Order) => void): () => void => {
    return OrderService.subscribeToOrderUpdates(orderId, (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
      callback(updatedOrder);
    });
  };

  const activeOrder = orders.find((o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED') || orders[0] || null;

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        isLoading,
        isPlacingOrder,
        updateOrderStatus,
        refreshOrders,
        placeOrder,
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
