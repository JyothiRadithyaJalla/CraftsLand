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
  maxWidth?: string;
  hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'customer',
  className = '',
  maxWidth = 'max-w-2xl',
  hideHeader = false,
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
      card: 'bg-white border border-[#DDD9CB] text-[#182019]',
      header: 'border-b border-[#DDD9CB]',
      title: 'text-[#182019]',
      close: 'text-[#626F64] hover:text-[#31543A] hover:bg-[#FAF8F3]',
    },
    admin: {
      card: 'bg-white border border-[#DDD9CB] text-[#182019]',
      header: 'border-b border-[#DDD9CB]',
      title: 'text-[#182019]',
      close: 'text-[#626F64] hover:text-[#31543A] hover:bg-[#FAF8F3]',
    },
    kitchen: {
      card: 'bg-white border-2 border-[#DDD9CB] text-[#182019]',
      header: 'border-b border-[#DDD9CB]',
      title: 'text-[#31543A]',
      close: 'text-[#626F64] hover:text-[#31543A] hover:bg-[#FAF8F3]',
    },
    dark: {
      card: 'bg-[#182019] border border-[#31543A]/40 text-[#F7F4EC]',
      header: 'border-b border-[#31543A]/30',
      title: 'text-[#F7F4EC]',
      close: 'text-[#E8E5D8] hover:text-[#C97852] hover:bg-white/10',
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
            className={`relative ${currentStyle.card} rounded-3xl w-full ${maxWidth} max-h-[90vh] ${hideHeader ? 'overflow-hidden p-0 h-[90vh] lg:h-[82vh] max-h-[820px] flex flex-col' : 'overflow-y-auto p-6 sm:p-8'} shadow-2xl z-10 ${className}`}
          >
            {!hideHeader && (
              <div className={`flex items-center justify-between ${currentStyle.header} pb-4 mb-4`}>
                <h3 className={`font-serif text-xl font-bold ${currentStyle.title}`}>{title || 'AURA'}</h3>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${currentStyle.close}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className={hideHeader ? 'h-full flex-1 flex flex-col overflow-hidden min-h-0' : ''}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
