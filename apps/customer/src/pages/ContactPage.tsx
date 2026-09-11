import React from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <MetaTags title="Concierge & Location | Craftsland" />
      <div className="text-center space-y-2">
        <h1 className="font-serif text-4xl font-bold text-red-gradient">Concierge & Sanctuary Location</h1>
        <p className="text-gray-500 text-sm">Reach our hospitality team or plan your arrival.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl space-y-4 text-xs text-gray-700 border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center gap-3"><MapPin className="text-[#B11226]" /> {RESTAURANT_BRAND.address}</div>
          <div className="flex items-center gap-3"><Phone className="text-[#B11226]" /> {RESTAURANT_BRAND.phone}</div>
          <div className="flex items-center gap-3"><Mail className="text-[#B11226]" /> {RESTAURANT_BRAND.email}</div>
          <div className="flex items-center gap-3"><Clock className="text-[#B11226]" /> {RESTAURANT_BRAND.operatingHours}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl flex items-center justify-center text-center text-xs text-gray-400 border border-[#E5E5E5] shadow-sm">
          Interactive Sanctuary Map View Placeholder
        </div>
      </div>
    </div>
  );
};
