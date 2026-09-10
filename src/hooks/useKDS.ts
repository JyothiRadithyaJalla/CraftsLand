import { useOrderContext } from '../context/OrderContext';
import type { Order } from '../types/order';

export const useKDS = () => {
  const { orders, updateOrderStatus, isLoading, refreshOrders } = useOrderContext();

  const newOrders: Order[] = orders.filter((o) => o.orderStatus === 'PENDING');
  const acceptedOrders: Order[] = orders.filter((o) => o.orderStatus === 'ACCEPTED');
  const preparingOrders: Order[] = orders.filter((o) => o.orderStatus === 'PREPARING');
  const readyOrders: Order[] = orders.filter((o) => o.orderStatus === 'READY');
  const completedOrders: Order[] = orders.filter((o) => o.orderStatus === 'COMPLETED');

  return {
    orders,
    newOrders,
    acceptedOrders,
    preparingOrders,
    readyOrders,
    completedOrders,
    updateOrderStatus,
    isLoading,
    refreshOrders,
  };
};
