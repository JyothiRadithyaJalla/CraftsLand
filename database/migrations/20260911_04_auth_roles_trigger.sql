-- ====================================================================
-- CRAFTSLAND MIGRATION 04 — AUTH TRIGGER & ROLE SECURITY HARDENING
-- ====================================================================

-- 1. SECURE AUTOMATIC PROFILE CREATION TRIGGER
-- Fires immediately upon user registration in auth.users.
-- Ensures that EVERY newly registered user is forced to CUSTOMER role.
-- Any client-supplied role parameter or metadata claiming ADMIN/KITCHEN is strictly ignored.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_full_name TEXT;
  v_phone TEXT;
BEGIN
  -- Extract permitted metadata provided during signup
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Distinguished Guest');
  v_phone := NEW.raw_user_meta_data->>'phone';

  -- Always force role to CUSTOMER for self-registered users
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_phone,
    'CUSTOMER',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name);

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. PREVENT ROLE ESCALATION TRIGGER
-- Database-level check ensuring that a non-admin user can NEVER alter their role column.
-- Even if an UPDATE statement modifies the row, role change is rejected unless performed by staff or service_role.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Only existing ADMIN or SUPER_ADMIN users may change roles
    IF public.current_user_role() NOT IN ('ADMIN', 'SUPER_ADMIN') AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Role alterations require Administrative privileges.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- 3. HARDENED PROFILES RLS POLICIES
-- Explicitly prevents customers from modifying role through the WITH CHECK clause.
DROP POLICY IF EXISTS "Profiles read own or staff" ON public.profiles;
CREATE POLICY "Profiles read own or staff" ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR
    public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

DROP POLICY IF EXISTS "Profiles update own" ON public.profiles;
CREATE POLICY "Profiles update own" ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

DROP POLICY IF EXISTS "Staff profiles manage" ON public.profiles;
CREATE POLICY "Staff profiles manage" ON public.profiles FOR ALL
  USING (public.current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));
