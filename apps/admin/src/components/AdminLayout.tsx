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
    <div className="min-h-screen bg-[#171310] text-[#F5EFE5] flex flex-col md:flex-row">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#211B16] border-r border-[#3A3027] z-50 flex flex-col justify-between transition-transform duration-300 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#3A3027] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C85A3A] to-[#8B3525] text-[#F5EFE5] flex items-center justify-center font-bold font-serif text-lg shadow-sm">
              C
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-[#F5EFE5] leading-none">
                Craftsland
              </h2>
              <span className="text-[10px] text-[#C85A3A] font-sans font-semibold tracking-wider uppercase">Executive Admin</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#B8AEA1] hover:text-[#F5EFE5] p-1 cursor-pointer transition-colors"
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
                    ? 'bg-[#B84A32] text-[#F5EFE5] font-bold shadow-md'
                    : 'text-[#B8AEA1] hover:text-[#F5EFE5] hover:bg-[#2A231C]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5EFE5]' : 'text-[#B8AEA1]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Profile & Logout */}
        <div className="p-4 border-t border-[#3A3027] space-y-3 bg-[#171310]/50">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#B84A32]/20 text-[#C85A3A] flex items-center justify-center font-bold border border-[#B84A32]/30">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate flex-1">
              <p className="font-bold text-[#F5EFE5] truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-[#B8AEA1] font-mono">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl border border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5] hover:bg-red-950/30 hover:border-red-500/30 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 bg-[#211B16]/95 backdrop-blur-md border-b border-[#3A3027] px-4 sm:px-6 py-3.5 z-30 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#B8AEA1] hover:text-[#F5EFE5] p-1 cursor-pointer transition-colors"
            >
              <MenuIcon className="w-6 h-6 text-[#B84A32]" />
            </button>
            <span className="text-xs text-[#B8AEA1] font-mono hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B84A32]" /> {clock}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-[#B84A32]/15 border border-[#B84A32]/30 px-3 py-1 rounded-full text-[#F5EFE5]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold">Admin Portal Online</span>
            </div>
            <button className="p-2 rounded-full bg-[#171310] border border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B84A32] relative cursor-pointer transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B84A32]" />
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
