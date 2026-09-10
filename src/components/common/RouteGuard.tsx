import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth';
import { LoadingSpinner } from './LoadingSpinner';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { role, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Verifying Credentials..." />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
