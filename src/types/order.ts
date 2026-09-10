export type OrderType = 'DINE_IN' | 'PICKUP' | 'DELIVERY';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface SelectedModifierOption {
  modifierTitle: string;
  optionName: string;
  price: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  dishName: string;
  unitPrice: number;
  quantity: number;
  selectedModifiers: SelectedModifierOption[];
  itemSubtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  tipAmount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  specialInstructions?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  dish: import('./menu').Dish;
  quantity: number;
  selectedModifiers: SelectedModifierOption[];
  itemSubtotal: number;
}

/** Payload for creating a new order from the checkout flow. */
export interface CreateOrderPayload {
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  items: CreateOrderItemPayload[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  tipAmount: number;
  totalAmount: number;
  paymentReference?: string;
}

/** Snapshot of a single item at the time of order creation. */
export interface CreateOrderItemPayload {
  dishId: string;
  dishName: string;
  unitPrice: number;
  quantity: number;
  selectedModifiers: SelectedModifierOption[];
  itemSubtotal: number;
}
