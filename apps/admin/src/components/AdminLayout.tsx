import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, FolderTree, Calendar,
  Users, Star, Tag, Ticket, Image as ImageIcon, BarChart3, Settings,
  LogOut, Menu as MenuIcon, X, Shield, Clock, Bell, ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [clock, setClock] = useState<string>(() => new Date().toLocaleTimeString());

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
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F1EA] flex flex-col md:flex-row">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0B0C10]/80 backdrop-blur-md z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#12141C] border-r border-[#D4AF37]/20 z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold font-serif text-lg">
              É
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-gold-gradient leading-none">
                L'Étoile Noir
              </h2>
              <span className="text-[10px] text-gray-400 font-mono">Executive Admin</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1 cursor-pointer"
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0B0C10] font-bold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B0C10]' : 'text-[#D4AF37]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Profile & Logout */}
        <div className="p-4 border-t border-[#D4AF37]/20 space-y-3 bg-[#0B0C10]/60">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold border border-[#D4AF37]/40">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate flex-1">
              <p className="font-bold text-[#F4F1EA] truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-[#D4AF37] font-mono">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-950/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 bg-[#0B0C10]/95 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 sm:px-6 py-3.5 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-300 hover:text-white p-1 cursor-pointer"
            >
              <MenuIcon className="w-6 h-6 text-[#D4AF37]" />
            </button>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {clock}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1 rounded-full text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono font-bold">Admin Portal Online</span>
            </div>
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
            </button>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
