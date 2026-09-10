import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <MetaTags title="404 — Page Not Found | L'Étoile Noir" />
      <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6 text-[#D4AF37]">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl font-bold tracking-wide text-gold-gradient mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-gray-400 max-w-md mb-8 text-sm leading-relaxed font-sans">
        The culinary destination or page you are attempting to visit does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-semibold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
      </Link>
    </div>
  );
};
