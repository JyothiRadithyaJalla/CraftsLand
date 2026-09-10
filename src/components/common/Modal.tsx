import React, { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#0B0C10]/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative glass-card-gold rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-[#F4F1EA] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4 mb-4">
          <h3 className="font-serif text-xl font-bold text-gold-gradient">{title || "L'Étoile Noir"}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
