import type { Order, OrderStatus } from '../types/order';
import { env } from '../config/env';
import { supabase } from './supabaseClient';
import { MOCK_ORDERS } from './mockData';

export class OrderService {
  static async getOrders(): Promise<Order[]> {
    if (env.isDevelopment) {
      return MOCK_ORDERS;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerId: o.customer_id,
      orderType: o.order_type,
      tableNumber: o.table_number,
      deliveryAddress: o.delivery_address,
      subtotal: Number(o.subtotal),
      taxAmount: Number(o.tax_amount),
      deliveryFee: Number(o.delivery_fee),
      discountAmount: Number(o.discount_amount),
      totalAmount: Number(o.total_amount),
      orderStatus: o.order_status,
      paymentStatus: o.payment_status,
      paymentReference: o.payment_reference,
      specialInstructions: o.special_instructions,
      items: (o.order_items || []).map((item: {
        id: string;
        order_id: string;
        dish_id: string;
        dish_name: string;
        unit_price: number;
        quantity: number;
        selected_modifiers: Array<{ modifierTitle: string; optionName: string; price: number }>;
        item_subtotal: number;
      }) => ({
        id: item.id,
        orderId: item.order_id,
        dishId: item.dish_id,
        dishName: item.dish_name,
        unitPrice: Number(item.unit_price),
        quantity: item.quantity,
        selectedModifiers: item.selected_modifiers || [],
        itemSubtotal: Number(item.item_subtotal),
      })),
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    if (env.isDevelopment) {
      const order = MOCK_ORDERS.find((o) => o.id === orderId);
      if (order) {
        order.orderStatus = status;
        order.updatedAt = new Date().toISOString();
      }
      return true;
    }

    const { error } = await supabase
      .from('orders')
      .update({ order_status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return !error;
  }
}
