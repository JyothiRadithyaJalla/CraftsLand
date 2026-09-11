import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Calendar, User, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { RESTAURANT_BRAND } from '../config/constants';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { items } = useCart();

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

  const isHome = location.pathname === '/';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#E5E5E5] shadow-xs py-4'
          : 'bg-white/80 backdrop-blur-md py-5 border-b border-[#E5E5E5]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-2xl font-bold tracking-wider text-[#171717] group-hover:text-[#B11226] uppercase transition-colors">
              {RESTAURANT_BRAND.name}
            </span>
            <span className="font-display text-[9px] tracking-[0.25em] text-[#B11226] font-semibold uppercase -mt-1">
              Good Food Brighter Moods
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
                    isActive ? 'text-[#B11226] font-bold' : 'text-[#171717]/80 hover:text-[#B11226]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B11226] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/reservation"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#B11226] text-[#B11226] text-xs tracking-wider uppercase font-semibold hover:bg-[#B11226] hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" /> Reserve
            </Link>

            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-[#171717] hover:text-[#B11226] transition-colors cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#B11226] text-white font-bold text-[10px] flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <Link
              to="/account"
              className="p-2 rounded-full text-[#171717] hover:text-[#B11226] transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            <button onClick={onOpenCart} className="relative p-2 text-[#171717] cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#B11226] text-white font-bold text-[10px] flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171717] hover:text-[#B11226] focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E5E5] px-6 pt-4 pb-6 space-y-3 mt-4 shadow-lg animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-widest text-[#171717]/80 hover:text-[#B11226] py-2 font-medium"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
            <Link
              to="/reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-full bg-[#B11226] text-white font-bold uppercase tracking-wider text-xs shadow-md hover:bg-[#7F0D1D]"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
