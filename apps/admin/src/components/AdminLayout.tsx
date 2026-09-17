import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@shared/hooks/useAuth';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, FolderTree, Calendar,
  Users, Star, Tag, Ticket, Image as ImageIcon, BarChart3, Settings,
  LogOut, Menu as MenuIcon, X, Shield, Clock, Bell, ChevronRight
} from 'lucide-react';
import { AdminNotificationDrawer } from './AdminNotificationDrawer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [clock, setClock] = useState<string>(() => new Date().toLocaleTimeString());
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Orders Queue', path: '/orders', icon: ShoppingBag },
    { label: 'Menu Dishes', path: '/menu', icon: UtensilsCrossed },
    { label: 'Categories', path: '/categories', icon: FolderTree },
    { label: 'Reservations', path: '/reservations', icon: Calendar },
    { label: 'Customers (CRM)', path: '/customers', icon: Users },
    { label: 'Reviews', path: '/reviews', icon: Star },
    { label: 'Promo Offers', path: '/offers', icon: Tag },
    { label: 'Private Events', path: '/events', icon: Ticket },
    { label: 'Media Gallery', path: '/gallery', icon: ImageIcon },
    { label: 'Analytics Reports', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#182019] flex flex-col md:flex-row">
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#182019] border-r border-[#263228] text-[#DDD9CB] z-50 flex flex-col justify-between transition-transform duration-300 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#263228] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#263228] border border-[#3A453C] text-white flex items-center justify-center font-bold font-serif text-lg shadow-sm">
              C
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-white leading-none">
                Craftsland
              </h2>
              <span className="text-[10px] text-[#DDD9CB]/70 font-sans font-semibold tracking-wider uppercase">Executive Admin</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#DDD9CB]/70 hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors font-semibold ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-[#DDD9CB]/70 hover:text-white hover:bg-[#263228]/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminActiveNav"
                    className="absolute inset-0 bg-[#31543A] rounded-xl border-l-4 border-[#78956A] shadow-xs z-0"
                    transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#DDD9CB]/70'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="relative z-10 w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Profile & Logout */}
        <div className="p-4 border-t border-[#263228] space-y-3 bg-[#121813]/60">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#263228] text-[#DDD9CB] flex items-center justify-center font-bold border border-[#3A453C]">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate flex-1">
              <p className="font-bold text-white truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-[#DDD9CB]/70 font-mono">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl border border-[#263228] text-[#DDD9CB]/70 hover:text-white hover:bg-[#A8382B]/20 hover:border-[#A8382B]/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#DDD9CB] px-4 sm:px-6 py-3.5 z-30 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#3A453C] hover:text-[#182019] p-1 cursor-pointer transition-colors"
            >
              <MenuIcon className="w-6 h-6 text-[#182019]" />
            </button>
            <span className="text-xs text-[#626F64] font-mono hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#31543A]" /> {clock}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#31543A]/30 px-3 py-1 rounded-full text-[#31543A]">
              <span className="w-2 h-2 rounded-full bg-[#31543A] animate-pulse" />
              <span className="font-mono font-bold">Admin Portal Online</span>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-full bg-[#FAF8F3] border border-[#DDD9CB] text-[#626F64] hover:text-[#182019] hover:border-[#31543A] relative cursor-pointer transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#A8382B] text-white text-[9px] font-mono font-bold leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#31543A]" />
              )}
            </button>
          </div>
        </header>

        {/* Page Children Container */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* Realtime Admin Operations Notification Drawer */}
      <AdminNotificationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUnreadCountChange={setUnreadCount}
      />
    </div>
  );
};
