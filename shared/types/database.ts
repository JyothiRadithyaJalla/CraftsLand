// Supabase Database Row Definitions

export interface DatabaseProfileRow {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'KITCHEN' | 'SUPER_ADMIN';
  created_at: string;
}

export interface DatabaseCategoryRow {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  image_url?: string;
  description?: string;
  is_active: boolean;
}

export interface DatabaseDishRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  media_url: string;
  poster_url: string;
  video_url?: string;
  featured?: boolean;
  calories?: number;
  dietary_tags: string[];
  allergens: string[];
  wine_pairing?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrderRow {
  id: string;
  order_number: string;
  customer_id?: string;
  user_id?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  tracking_token: string;
  order_type: 'DINE_IN' | 'PICKUP' | 'DELIVERY';
  table_number?: string;
  delivery_address?: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  tip_amount: number;
  total_amount: number;
  order_status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  payment_status: 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
  payment_reference?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrderItemRow {
  id: string;
  order_id: string;
  dish_id: string;
  dish_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  selected_modifiers: Array<{ name: string; optionName: string; price: number }>;
  line_total: number;
  created_at: string;
}

export interface DatabasePaymentRow {
  id: string;
  order_id: string;
  provider: 'MOCK' | 'RAZORPAY';
  provider_order_id?: string;
  provider_payment_id?: string;
  amount: number;
  currency: string;
  status: 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseReservationRow {
  id: string;
  booking_reference: string;
  customer_id?: string;
  user_id?: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  seating_section: 'MAIN_DINING' | 'CHEFS_COUNTER' | 'TERRACE' | 'PRIVATE_VAULT';
  special_requests?: string;
  status: 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}
