import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <MetaTags title="404 — Page Not Found | Craftsland" />
      <div className="w-16 h-16 rounded-full bg-[#B11226]/10 border border-[#B11226]/20 flex items-center justify-center mb-6 text-[#B11226]">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl font-bold tracking-wide text-red-gradient mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed font-sans">
        The culinary destination or page you are attempting to visit does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-semibold text-xs tracking-widest uppercase hover:brightness-110 shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
      </Link>
    </div>
  );
};
