import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Calendar, User, Menu as MenuIcon, X, Shield, ChefHat } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { RESTAURANT_BRAND } from '../config/constants';
import type { UserRole } from '../types/auth';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { role, switchRoleForDev } = useAuth();

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Private Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  const devRoles: UserRole[] = ['CUSTOMER', 'ADMIN', 'KITCHEN', 'SUPER_ADMIN'];

  const isHome = location.pathname === '/';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-[#0B0C10]/90 backdrop-blur-xl border-b border-[#D4AF37]/15 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-2xl font-bold tracking-wider text-gold-gradient uppercase group-hover:opacity-90 transition-opacity">
              {RESTAURANT_BRAND.name}
            </span>
            <span className="font-display text-[9px] tracking-[0.25em] text-gray-400 uppercase -mt-1">
              Haute Cuisine
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest transition-colors font-medium relative ${
                    isActive ? 'text-[#D4AF37]' : 'text-[#F4F1EA]/70 hover:text-[#D4AF37]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Dev Switcher */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Dev Mode Role Switcher */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/20 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-gray-400 font-mono text-[10px] uppercase">Dev Role:</span>
              <select
                value={role}
                onChange={(e) => switchRoleForDev(e.target.value as UserRole)}
                className="bg-transparent text-[#D4AF37] font-semibold focus:outline-none cursor-pointer"
              >
                {devRoles.map((r) => (
                  <option key={r} value={r} className="bg-[#12141C] text-[#F4F1EA]">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Portals Links */}
            {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-medium hover:bg-[#D4AF37]/20 transition-all"
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}

            {(role === 'KITCHEN' || role === 'ADMIN' || role === 'SUPER_ADMIN') && (
              <Link
                to="/kitchen"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8C7853]/20 text-[#F4F1EA] border border-[#8C7853]/40 text-xs font-medium hover:bg-[#8C7853]/30 transition-all"
              >
                <ChefHat className="w-3.5 h-3.5 text-[#D4AF37]" /> KDS
              </Link>
            )}

            <Link
              to="/reservation"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs tracking-wider uppercase font-semibold hover:bg-[#D4AF37] hover:text-[#0B0C10] transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" /> Reserve
            </Link>

            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-[#F4F1EA] hover:text-[#D4AF37] transition-colors cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold text-[10px] flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <Link
              to="/account"
              className="p-2 rounded-full text-[#F4F1EA] hover:text-[#D4AF37] transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            <button onClick={onOpenCart} className="relative p-2 text-[#F4F1EA] cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold text-[10px] flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F4F1EA] hover:text-[#D4AF37] focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-[#D4AF37]/20 px-6 pt-4 pb-6 space-y-3 mt-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-widest text-[#F4F1EA]/80 hover:text-[#D4AF37] py-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <Link
              to="/reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold uppercase tracking-wider text-xs"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
