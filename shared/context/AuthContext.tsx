import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { UserProfile, UserRole, RegisterPayload, LoginPayload, AuthResult } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authoritatively load the verified user profile from the database
  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const profile = await AuthService.getCurrentProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error('Failed to load authenticated profile:', err);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial profile check
    refreshProfile();

    // 2. Realtime listener for Supabase Auth state changes (token refresh, login, logout, expiry)
    const { unsubscribe } = AuthService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          await refreshProfile();
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [refreshProfile]);

  const login = async (payload: LoginPayload): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await AuthService.signIn(payload);
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await AuthService.signUp(payload);
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    return await AuthService.resetPassword(email);
  };

  // Authoritative role comes directly from the database profile.
  // If unauthenticated, default to 'CUSTOMER'.
  const role: UserRole = user?.role || 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

