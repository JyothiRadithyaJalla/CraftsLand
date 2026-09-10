-- ====================================================================
-- CRAFTSLAND — SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
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
  image_url TEXT,
  description TEXT,
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
  video_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
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
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_type order_type NOT NULL DEFAULT 'DINE_IN',
  table_number TEXT,
  status order_status NOT NULL DEFAULT 'PENDING',
  payment_status payment_status NOT NULL DEFAULT 'UNPAID',
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tip NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  guest_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  delivery_address JSONB,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estimated_ready_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  party_size INT NOT NULL CHECK (party_size > 0),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  section seating_section NOT NULL DEFAULT 'MAIN_DINING',
  status reservation_status NOT NULL DEFAULT 'CONFIRMED',
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. RESTAURANT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public dishes read" ON public.dishes;
CREATE POLICY "Public dishes read" ON public.dishes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public modifiers read" ON public.dish_modifiers;
CREATE POLICY "Public modifiers read" ON public.dish_modifiers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public settings read" ON public.restaurant_settings;
CREATE POLICY "Public settings read" ON public.restaurant_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Orders read permission" ON public.orders;
CREATE POLICY "Orders read permission" ON public.orders FOR SELECT
  USING (
    auth.role() = 'authenticated' OR 
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN', 'KITCHEN')
    )
  );

DROP POLICY IF EXISTS "Orders insert permission" ON public.orders;
CREATE POLICY "Orders insert permission" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Orders staff update" ON public.orders;
CREATE POLICY "Orders staff update" ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN', 'KITCHEN')
    )
  );
