-- ====================================================================
-- L'ÉTOILE NOIR — SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN', 'KITCHEN', 'SUPER_ADMIN');
CREATE TYPE order_type AS ENUM ('DINE_IN', 'PICKUP', 'DELIVERY');
CREATE TYPE order_status AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('UNPAID', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE seating_section AS ENUM ('MAIN_DINING', 'CHEFS_COUNTER', 'TERRACE', 'PRIVATE_VAULT');
CREATE TYPE reservation_status AS ENUM ('CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED');

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. DISHES TABLE
CREATE TABLE IF NOT EXISTS public.dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  media_url TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  calories INT CHECK (calories >= 0),
  dietary_tags TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}',
  wine_pairing TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DISH MODIFIERS TABLE
CREATE TABLE IF NOT EXISTS public.dish_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  options JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_type order_type NOT NULL DEFAULT 'DINE_IN',
  table_number TEXT,
  delivery_address TEXT,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
  order_status order_status NOT NULL DEFAULT 'PENDING',
  payment_status payment_status NOT NULL DEFAULT 'UNPAID',
  payment_reference TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES public.dishes(id) ON DELETE SET NULL,
  dish_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  selected_modifiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  item_subtotal NUMERIC(10, 2) NOT NULL CHECK (item_subtotal >= 0)
);

-- 8. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  party_size INT NOT NULL CHECK (party_size > 0),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  seating_section seating_section NOT NULL DEFAULT 'MAIN_DINING',
  special_requests TEXT,
  status reservation_status NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES public.dishes(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC(5, 2) NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
  active_from TIMESTAMPTZ NOT NULL,
  active_to TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 11. RESTAURANT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_dishes_category ON public.dishes(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Public READ for Categories & Dishes
CREATE POLICY "Public Categories Select" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Dishes Select" ON public.dishes FOR SELECT USING (true);
CREATE POLICY "Public Modifiers Select" ON public.dish_modifiers FOR SELECT USING (true);
CREATE POLICY "Public Settings Select" ON public.restaurant_settings FOR SELECT USING (true);

-- Admin CRUD Policies
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
);

CREATE POLICY "Admin All Dishes" ON public.dishes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
);

-- Orders RLS: Customer views own, Kitchen/Admin view all
CREATE POLICY "Orders Select Policy" ON public.orders FOR SELECT USING (
  customer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'KITCHEN', 'SUPER_ADMIN'))
);

CREATE POLICY "Orders Insert Policy" ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders Status Update Policy" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'KITCHEN', 'SUPER_ADMIN'))
);
