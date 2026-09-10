import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';

// Common Components
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RouteGuard } from './components/common/RouteGuard';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { MenuPage } from './pages/customer/MenuPage';
import { DishDetailPage } from './pages/customer/DishDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderStatusPage } from './pages/customer/OrderStatusPage';
import { ReservationPage } from './pages/customer/ReservationPage';
import { AboutPage } from './pages/customer/AboutPage';
import { GalleryPage } from './pages/customer/GalleryPage';
import { EventsPage } from './pages/customer/EventsPage';
import { ContactPage } from './pages/customer/ContactPage';
import { AccountPage } from './pages/customer/AccountPage';
import { FavoritesPage } from './pages/customer/FavoritesPage';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { ForgotPasswordPage } from './pages/customer/ForgotPasswordPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Kitchen Page
import { KDSPage } from './pages/kitchen/KDSPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <MenuProvider>
            <OrderProvider>
              <ThemeProvider>
                <Router>
                  <div className="flex flex-col min-h-screen bg-[#0B0C10] text-[#F4F1EA]">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        {/* Customer Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/menu" element={<MenuPage />} />
                        <Route path="/menu/:category" element={<MenuPage />} />
                        <Route path="/menu/item/:id" element={<DishDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order/:id" element={<OrderStatusPage />} />
                        <Route path="/reservation" element={<ReservationPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route
                          path="/admin"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminDashboardPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/orders"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminOrdersPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/menu"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminMenuPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/categories"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminCategoriesPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/reservations"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminReservationsPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/customers"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminCustomersPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/reviews"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminReviewsPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/offers"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminOffersPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/events"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminEventsPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/gallery"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminGalleryPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/analytics"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminAnalyticsPage />
                            </RouteGuard>
                          }
                        />
                        <Route
                          path="/admin/settings"
                          element={
                            <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                              <AdminSettingsPage />
                            </RouteGuard>
                          }
                        />

                        {/* Kitchen Display System Route */}
                        <Route
                          path="/kitchen"
                          element={
                            <RouteGuard allowedRoles={['KITCHEN', 'ADMIN', 'SUPER_ADMIN']}>
                              <KDSPage />
                            </RouteGuard>
                          }
                        />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </ThemeProvider>
            </OrderProvider>
          </MenuProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
