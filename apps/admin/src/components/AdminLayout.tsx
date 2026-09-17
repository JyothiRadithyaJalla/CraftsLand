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
    <div className="min-h-screen bg-[#F4F4F1] text-[#0F172A] flex flex-col md:flex-row">
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
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0F172A] border-r border-[#1E293B] text-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1E293B] border border-slate-700 text-white flex items-center justify-center font-bold font-serif text-lg shadow-sm">
              C
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-white leading-none">
                Craftsland
              </h2>
              <span className="text-[10px] text-slate-400 font-sans font-semibold tracking-wider uppercase">Executive Admin</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
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
                    : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminActiveNav"
                    className="absolute inset-0 bg-[#1E293B] rounded-xl border-l-4 border-slate-300 shadow-xs z-0"
                    transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="relative z-10 w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Profile & Logout */}
        <div className="p-4 border-t border-[#1E293B] space-y-3 bg-[#0A0F1D]/60">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#1E293B] text-slate-300 flex items-center justify-center font-bold border border-slate-700">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate flex-1">
              <p className="font-bold text-white truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-mono">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl border border-[#1E293B] text-slate-400 hover:text-white hover:bg-rose-950/30 hover:border-rose-900/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#D8D8D2] px-4 sm:px-6 py-3.5 z-30 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-700 hover:text-[#0F172A] p-1 cursor-pointer transition-colors"
            >
              <MenuIcon className="w-6 h-6 text-[#0F172A]" />
            </button>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0F172A]" /> {clock}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-mono font-bold">Admin Portal Online</span>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-full bg-[#F4F4F1] border border-[#D8D8D2] text-slate-600 hover:text-[#0F172A] hover:border-[#0F172A] relative cursor-pointer transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
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
