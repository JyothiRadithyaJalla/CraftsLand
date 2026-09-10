import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Order, OrderStatus } from '../types/order';
import { OrderService } from '../services/orderService';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const activeOrder = orders[0] || null;

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        isLoading,
        updateOrderStatus,
        refreshOrders,
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
