import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile, UserRole } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  switchRoleForDev: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    AuthService.getCurrentProfile().then((profile) => {
      setUser(profile);
      setIsLoading(false);
    });
  }, []);

  const switchRoleForDev = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const role: UserRole = user?.role || 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        switchRoleForDev,
        logout,
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
