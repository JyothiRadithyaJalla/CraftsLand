import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Calendar, User, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '@shared/hooks/useCart';
import { CraftslandLogo } from '@shared/components/CraftslandLogo';

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
          ? 'bg-[#0D0B09]/95 backdrop-blur-xl border-b border-[#3A3027] py-3.5 shadow-lg'
          : 'bg-[#0D0B09]/80 backdrop-blur-md py-4 border-b border-[#3A3027]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Craftsland Logo */}
          <Link to="/" className="group flex items-center transition-transform duration-300 hover:scale-[1.02]">
            <CraftslandLogo variant="primary" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 relative py-1 ${
                    isActive
                      ? 'text-[#B84A32]'
                      : 'text-[#B8AEA1] hover:text-[#F5EFE5]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B84A32] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Table Reservation Button */}
            <Link
              to="/reservation"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B84A32] bg-[#B84A32] hover:bg-[#8B3525] text-white font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Table</span>
            </Link>

            {/* Account Profile Icon */}
            <Link
              to="/account"
              className="p-2 rounded-full text-[#F5EFE5] hover:text-[#B84A32] hover:bg-[#211B16] transition-colors"
              title="Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-[#F5EFE5] hover:text-[#B84A32] hover:bg-[#211B16] transition-colors cursor-pointer"
              title="View Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B84A32] text-white font-bold text-[10px] flex items-center justify-center border-2 border-[#0D0B09] animate-in zoom-in-50">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#F5EFE5] hover:text-[#B84A32] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#3A3027] bg-[#171310] px-6 py-8 space-y-5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold tracking-widest uppercase transition-colors ${
                  location.pathname === link.path ? 'text-[#B84A32]' : 'text-[#B8AEA1] hover:text-[#F5EFE5]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#3A3027] flex flex-col gap-3">
            <Link
              to="/reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full bg-[#B84A32] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#8B3525]"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
