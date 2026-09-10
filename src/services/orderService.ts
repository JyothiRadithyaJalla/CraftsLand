import type { Order, OrderStatus, CreateOrderPayload } from '../types/order';
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

    return data.map((o) => this.mapSupabaseOrder(o));
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    if (env.isDevelopment) {
      const order = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
      return order || null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .single();

    if (error || !data) return null;

    return this.mapSupabaseOrder(data);
  }

  static async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const orderNumber = `#LNO-${Math.floor(1000 + Math.random() * 9000)}`;

    if (env.isDevelopment) {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customerId: payload.customerId,
        orderType: payload.orderType,
        tableNumber: payload.tableNumber,
        deliveryAddress: payload.deliveryAddress,
        subtotal: payload.subtotal,
        taxAmount: payload.taxAmount,
        deliveryFee: payload.deliveryFee,
        discountAmount: payload.discountAmount,
        tipAmount: payload.tipAmount,
        totalAmount: payload.totalAmount,
        orderStatus: 'PENDING',
        paymentStatus: 'PAID',
        paymentReference: payload.paymentReference || `mock_ref_${Date.now()}`,
        specialInstructions: payload.specialInstructions,
        items: payload.items.map((item, idx) => ({
          id: `oi-${Date.now()}-${idx}`,
          orderId: `ord-${Date.now()}`,
          dishId: item.dishId,
          dishName: item.dishName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          selectedModifiers: item.selectedModifiers,
          itemSubtotal: item.itemSubtotal,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MOCK_ORDERS.unshift(newOrder);
      return newOrder;
    }

    // Supabase Production Persistence
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: payload.customerId || null,
        order_type: payload.orderType,
        table_number: payload.tableNumber || null,
        delivery_address: payload.deliveryAddress || null,
        subtotal: payload.subtotal,
        tax_amount: payload.taxAmount,
        delivery_fee: payload.deliveryFee,
        discount_amount: payload.discountAmount,
        total_amount: payload.totalAmount,
        order_status: 'PENDING',
        payment_status: 'PAID',
        payment_reference: payload.paymentReference || null,
        special_instructions: payload.specialInstructions || null,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error(orderError?.message || 'Failed to create order in database.');
    }

    const orderItemsToInsert = payload.items.map((item) => ({
      order_id: orderData.id,
      dish_id: item.dishId,
      dish_name: item.dishName,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      selected_modifiers: item.selectedModifiers,
      item_subtotal: item.itemSubtotal,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
    }

    const createdOrder = await this.getOrderById(orderData.id);
    if (!createdOrder) throw new Error('Order created but failed to retrieve.');
    return createdOrder;
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

  static async cancelOrder(orderId: string): Promise<boolean> {
    return this.updateOrderStatus(orderId, 'CANCELLED');
  }

  static subscribeToOrderUpdates(
    orderId: string,
    onUpdate: (order: Order) => void
  ): () => void {
    if (env.isDevelopment) {
      const statusSequence: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
      let step = 0;

      const intervalId = setInterval(() => {
        const order = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!order) return;

        const currentIndex = statusSequence.indexOf(order.orderStatus);
        if (currentIndex < statusSequence.length - 1 && currentIndex !== -1) {
          step = currentIndex + 1;
        } else if (currentIndex === -1) {
          step = Math.min(step + 1, statusSequence.length - 1);
        } else {
          clearInterval(intervalId);
          return;
        }

        order.orderStatus = statusSequence[step];
        order.updatedAt = new Date().toISOString();
        onUpdate({ ...order });
      }, 8000); // Progress every 8s in mock dev mode

      return () => clearInterval(intervalId);
    }

    // Production Realtime via Supabase
    const channel = supabase
      .channel(`order-updates-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        async () => {
          const updated = await this.getOrderById(orderId);
          if (updated) onUpdate(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  private static mapSupabaseOrder(o: any): Order {
    return {
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
      tipAmount: 0.00,
      totalAmount: Number(o.total_amount),
      orderStatus: o.order_status,
      paymentStatus: o.payment_status,
      paymentReference: o.payment_reference,
      specialInstructions: o.special_instructions,
      items: (o.order_items || []).map((item: any) => ({
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
    };
  }
}
