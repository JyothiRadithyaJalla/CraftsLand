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
