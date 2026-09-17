-- ====================================================================
-- CRAFTSLAND MIGRATION 03 — ROW LEVEL SECURITY (RLS) HARDENING
-- ====================================================================

-- 1. ENSURE RLS IS ENABLED ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Helper function to check staff status safely without recursion
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles read own or staff" ON public.profiles;
CREATE POLICY "Profiles read own or staff" ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

DROP POLICY IF EXISTS "Profiles update own" ON public.profiles;
CREATE POLICY "Profiles update own" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. MENU TABLES POLICIES (Categories, Dishes, Dish Modifiers)
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff categories write" ON public.categories;
CREATE POLICY "Staff categories write" ON public.categories FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "Public dishes read" ON public.dishes;
CREATE POLICY "Public dishes read" ON public.dishes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff dishes write" ON public.dishes;
CREATE POLICY "Staff dishes write" ON public.dishes FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "Public dish_modifiers read" ON public.dish_modifiers;
CREATE POLICY "Public dish_modifiers read" ON public.dish_modifiers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff dish_modifiers write" ON public.dish_modifiers;
CREATE POLICY "Staff dish_modifiers write" ON public.dish_modifiers FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- 4. ORDERS POLICIES
-- Customer only accesses their own orders; Staff gets full view; Kitchen gets active kitchen views.
-- ANONYMOUS USERS CANNOT DIRECTLY SELECT FROM ORDERS (Guest lookup is exclusively via get_guest_order_by_token)
DROP POLICY IF EXISTS "Orders read access" ON public.orders;
CREATE POLICY "Orders read access" ON public.orders FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND (auth.uid() = customer_id OR auth.uid() = user_id)) OR
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN') OR
    (public.current_user_role() = 'KITCHEN' AND order_status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY'))
  );

DROP POLICY IF EXISTS "Orders update access" ON public.orders;
CREATE POLICY "Orders update access" ON public.orders FOR UPDATE
  USING (
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN', 'KITCHEN')
  );

-- 5. ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Order items read access" ON public.order_items;
CREATE POLICY "Order items read access" ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (
          (auth.uid() IS NOT NULL AND (auth.uid() = o.customer_id OR auth.uid() = o.user_id)) OR
          public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN', 'KITCHEN')
        )
    )
  );

-- 6. PAYMENTS POLICIES
-- Highly sensitive: Only Admins or the customer owning the order can inspect their payment records
DROP POLICY IF EXISTS "Payments read access" ON public.payments;
CREATE POLICY "Payments read access" ON public.payments FOR SELECT
  USING (
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN') OR
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payments.order_id
        AND auth.uid() IS NOT NULL
        AND (auth.uid() = o.customer_id OR auth.uid() = o.user_id)
    )
  );

-- 7. RESERVATIONS POLICIES
DROP POLICY IF EXISTS "Reservations select access" ON public.reservations;
CREATE POLICY "Reservations select access" ON public.reservations FOR SELECT
  USING (
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN') OR
    (auth.uid() IS NOT NULL AND (auth.uid() = user_id OR auth.uid() = customer_id))
  );

DROP POLICY IF EXISTS "Reservations update access" ON public.reservations;
CREATE POLICY "Reservations update access" ON public.reservations FOR UPDATE
  USING (
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN') OR
    (auth.uid() IS NOT NULL AND (auth.uid() = user_id OR auth.uid() = customer_id) AND status = 'CONFIRMED')
  );

-- 8. RESTAURANT SETTINGS POLICIES
DROP POLICY IF EXISTS "Public settings read" ON public.restaurant_settings;
CREATE POLICY "Public settings read" ON public.restaurant_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff settings write" ON public.restaurant_settings;
CREATE POLICY "Staff settings write" ON public.restaurant_settings FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- 9. REVIEWS, OFFERS, EVENTS, GALLERY POLICIES
DROP POLICY IF EXISTS "Public reviews read" ON public.reviews;
CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (status = 'APPROVED');
DROP POLICY IF EXISTS "Staff reviews manage" ON public.reviews;
CREATE POLICY "Staff reviews manage" ON public.reviews FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "Public offers read" ON public.offers;
CREATE POLICY "Public offers read" ON public.offers FOR SELECT USING (is_active = true AND valid_until >= CURRENT_DATE);
DROP POLICY IF EXISTS "Staff offers manage" ON public.offers;
CREATE POLICY "Staff offers manage" ON public.offers FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "Staff events manage" ON public.events;
CREATE POLICY "Staff events manage" ON public.events FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "Public gallery read" ON public.gallery;
CREATE POLICY "Public gallery read" ON public.gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS "Staff gallery manage" ON public.gallery;
CREATE POLICY "Staff gallery manage" ON public.gallery FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));
