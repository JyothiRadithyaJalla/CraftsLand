import React, { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: 'customer' | 'admin' | 'kitchen' | 'dark';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'customer',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const styleMap = {
    customer: {
      card: 'bg-white border border-[#E2E8E0] text-[#111A15]',
      header: 'border-b border-[#E2E8E0]',
      title: 'text-[#111A15]',
      close: 'text-[#5C6E63] hover:text-[#15803D] hover:bg-[#F1F7F2]',
    },
    admin: {
      card: 'bg-white border border-[#D8D8D2] text-[#0F172A]',
      header: 'border-b border-[#D8D8D2]',
      title: 'text-[#0F172A]',
      close: 'text-slate-500 hover:text-[#0F172A] hover:bg-[#F4F4F1]',
    },
    kitchen: {
      card: 'bg-white border-2 border-[#CBD8D8] text-[#0F2424]',
      header: 'border-b border-[#CBD8D8]',
      title: 'text-[#0D474A]',
      close: 'text-slate-500 hover:text-[#0D474A] hover:bg-[#EEF3F3]',
    },
    dark: {
      card: 'bg-[#211B16] border border-[#3A3027] text-[#F5EFE5]',
      header: 'border-b border-[#3A3027]',
      title: 'text-[#F5EFE5]',
      close: 'text-[#B8AEA1] hover:text-[#B84A32] hover:bg-white/5',
    },
  };

  const currentStyle = styleMap[variant] || styleMap.customer;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative ${currentStyle.card} rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 ${className}`}
          >
            <div className={`flex items-center justify-between ${currentStyle.header} pb-4 mb-4`}>
              <h3 className={`font-serif text-xl font-bold ${currentStyle.title}`}>{title || 'CRAFTSLAND'}</h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${currentStyle.close}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
