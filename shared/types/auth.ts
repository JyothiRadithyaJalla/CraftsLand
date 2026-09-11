export type UserRole = 'CUSTOMER' | 'ADMIN' | 'KITCHEN' | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  user: UserProfile | null;
  error?: string;
  requiresEmailVerification?: boolean;
}

