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
  order_type: 'DINE_IN' | 'PICKUP' | 'DELIVERY';
  table_number?: string;
  delivery_address?: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  order_status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  payment_status: 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
  payment_reference?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}
