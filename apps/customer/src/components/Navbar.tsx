import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-[#F7F4EC]/95 backdrop-blur-md border-b border-[#DDD9CB] py-3.5 shadow-xs'
          : 'bg-[#F7F4EC] py-4 border-b border-[#DDD9CB]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Craftsland Logo */}
          <Link to="/" className="group flex items-center transition-transform duration-300 hover:scale-[1.02]">
            <CraftslandLogo variant="green" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 relative py-1 ${
                    isActive
                      ? 'text-[#31543A] font-bold'
                      : 'text-[#3A453C] hover:text-[#182019]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="custActiveNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#31543A] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Table Reservation Button - Thick, Solid Botanical Green */}
            <Link
              to="/reservation"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#26432E] bg-[#31543A] hover:bg-[#26432E] text-white font-sans font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-xs active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Table</span>
            </Link>

            {/* Account Profile Icon */}
            <Link
              to="/account"
              className="p-2 rounded-xl text-[#182019] hover:text-[#31543A] hover:bg-[#FAF8F3] transition-colors"
              title="Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl text-[#182019] hover:text-[#31543A] hover:bg-[#FAF8F3] transition-colors cursor-pointer"
              title="View Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence mode="popLayout">
                {totalItemsCount > 0 && (
                  <motion.span
                    key={totalItemsCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#31543A] text-white font-bold text-[10px] flex items-center justify-center border-2 border-[#F7F4EC] shadow-xs"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#182019] hover:text-[#31543A] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-[#DDD9CB] bg-[#F7F4EC] px-6 py-8 space-y-5 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold tracking-widest uppercase transition-colors ${
                    location.pathname === link.path ? 'text-[#31543A] font-bold' : 'text-[#3A453C] hover:text-[#182019]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[#DDD9CB] flex flex-col gap-3">
              <Link
                to="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-xl bg-[#31543A] text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-[#26432E] active:scale-[0.98] transition-transform"
              >
                Reserve a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
