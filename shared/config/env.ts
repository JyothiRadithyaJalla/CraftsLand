// Strict Environment Configuration Validator

export interface AppEnv {
  appEnv: 'development' | 'production';
  supabaseUrl: string;
  supabaseAnonKey: string;
  mediaBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export const env: AppEnv = {
  appEnv: (import.meta.env.VITE_APP_ENV as 'development' | 'production') || 'development',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
  mediaBaseUrl: import.meta.env.VITE_MEDIA_BASE_URL || '',
  isDevelopment: (import.meta.env.VITE_APP_ENV || 'development') === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};
