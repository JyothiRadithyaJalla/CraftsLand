import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <MetaTags title="404 — Page Not Found | Craftsland" />
      <div className="w-16 h-16 rounded-full bg-[#B84A32]/10 border border-[#B84A32]/25 flex items-center justify-center mb-6 text-[#B84A32]">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl font-bold tracking-wide text-[#F5EFE5] mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-[#B8AEA1] max-w-md mb-8 text-sm leading-relaxed font-sans">
        The culinary destination or page you are attempting to visit does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B84A32] to-[#8B3525] hover:from-[#C85A3A] hover:to-[#B84A32] text-[#F5EFE5] font-semibold text-xs tracking-widest uppercase shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
      </Link>
    </div>
  );
};
