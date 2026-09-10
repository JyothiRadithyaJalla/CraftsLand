import React from 'react';
import { X } from 'lucide-react';

interface LightboxModalProps {
  imageUrl: string | null;
  caption?: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, caption, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0C10]/90 backdrop-blur-xl animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-3">
        <img
          src={imageUrl}
          alt={caption || 'Gallery Media'}
          className="max-h-[75vh] w-auto object-contain rounded-xl border border-[#D4AF37]/30 shadow-2xl"
        />
        {caption && (
          <p className="font-serif text-sm text-[#D4AF37] text-center tracking-wider">{caption}</p>
        )}
      </div>
    </div>
  );
};
