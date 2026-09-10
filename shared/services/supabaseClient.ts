import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Public browser client (Only anon key, never service-role key)
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
