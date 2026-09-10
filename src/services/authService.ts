import type { UserProfile, UserRole } from '../types/auth';
import { env } from '../config/env';
import { supabase } from './supabaseClient';

export class AuthService {
  static async getCurrentProfile(): Promise<UserProfile | null> {
    if (env.isDevelopment) {
      // Development mock active user
      return {
        id: 'dev-user-01',
        email: 'guest@letoilenoir.com',
        fullName: 'Alexander De Witt',
        phone: '+1 555-987-6543',
        role: 'CUSTOMER' as UserRole,
        createdAt: new Date().toISOString(),
      };
    }

    // Production Supabase Auth query
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      phone: profile.phone,
      role: profile.role as UserRole,
      createdAt: profile.created_at,
    };
  }
}
