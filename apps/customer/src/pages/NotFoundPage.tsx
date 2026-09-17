import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <MetaTags title="404 — Page Not Found | Craftsland" />
      <div className="w-16 h-16 rounded-full bg-[#F1F7F2] border border-[#15803D]/25 flex items-center justify-center mb-6 text-[#15803D]">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl font-bold tracking-tight text-[#111A15] mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-[#5C6E63] max-w-md mb-8 text-sm leading-relaxed font-sans">
        The culinary destination or page you are attempting to visit does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs tracking-wider uppercase shadow-sm transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
