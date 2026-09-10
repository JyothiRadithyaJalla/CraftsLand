import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers from shared
import { AuthProvider } from '@shared/context/AuthContext';
import { OrderProvider } from '@shared/context/OrderContext';
import { ThemeProvider } from '@shared/context/ThemeContext';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { RouteGuard } from '@shared/components/RouteGuard';

// Kitchen Pages
import { KDSPage } from './pages/KDSPage';
import { KitchenLoginPage } from './pages/KitchenLoginPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OrderProvider>
          <ThemeProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<KitchenLoginPage />} />
                <Route
                  path="/"
                  element={
                    <RouteGuard
                      allowedRoles={['KITCHEN', 'ADMIN', 'SUPER_ADMIN']}
                      appName="Kitchen Display System"
                      loginPath="/login"
                    >
                      <KDSPage />
                    </RouteGuard>
                  }
                />
                <Route
                  path="*"
                  element={
                    <RouteGuard
                      allowedRoles={['KITCHEN', 'ADMIN', 'SUPER_ADMIN']}
                      appName="Kitchen Display System"
                      loginPath="/login"
                    >
                      <KDSPage />
                    </RouteGuard>
                  }
                />
              </Routes>
            </Router>
          </ThemeProvider>
        </OrderProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
