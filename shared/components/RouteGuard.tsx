import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth';
import { LoadingSpinner } from './LoadingSpinner';
import { UnauthorizedPage } from './UnauthorizedPage';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  loginPath?: string;
  appName?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
  loginPath = '/login',
  appName,
}) => {
  const { role, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Verifying Credentials..." />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!isAuthenticated) {
      return <Navigate to={loginPath} state={{ from: location }} replace />;
    }
    if (!allowedRoles.includes(role)) {
      if (appName) {
        return <UnauthorizedPage appName={appName} requiredRole={allowedRoles.join(' or ')} />;
      }
      return <Navigate to={loginPath} replace />;
    }
  }

  return <>{children}</>;
};
