import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';
import { RESTAURANT_BRAND } from '../../config/constants';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <MetaTags title="Concierge & Location | L'Étoile Noir" />
      <div className="text-center space-y-2">
        <h1 className="font-serif text-4xl font-bold text-gold-gradient">Concierge & Sanctuary Location</h1>
        <p className="text-gray-400 text-sm">Reach our hospitality team or plan your arrival.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="glass-panel p-6 rounded-2xl space-y-4 text-xs text-gray-300">
          <div className="flex items-center gap-3"><MapPin className="text-[#D4AF37]" /> {RESTAURANT_BRAND.address}</div>
          <div className="flex items-center gap-3"><Phone className="text-[#D4AF37]" /> {RESTAURANT_BRAND.phone}</div>
          <div className="flex items-center gap-3"><Mail className="text-[#D4AF37]" /> {RESTAURANT_BRAND.email}</div>
          <div className="flex items-center gap-3"><Clock className="text-[#D4AF37]" /> {RESTAURANT_BRAND.operatingHours}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center justify-center text-center text-xs text-gray-400">
          Interactive Sanctuary Map View Placeholder
        </div>
      </div>
    </div>
  );
};
