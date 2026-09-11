import React from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <MetaTags title="Concierge & Location | Craftsland" />
      <div className="text-center space-y-2">
        <h1 className="font-serif text-4xl font-bold text-[#F5EFE5]">Concierge & Sanctuary Location</h1>
        <p className="text-[#B8AEA1] text-sm">Reach our hospitality team or plan your arrival.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-[#211B16] p-6 rounded-2xl space-y-4 text-xs text-[#B8AEA1] border border-[#3A3027] shadow-xl">
          <div className="flex items-center gap-3"><MapPin className="text-[#B84A32] w-4 h-4 flex-shrink-0" /> <span className="text-[#F5EFE5]">{RESTAURANT_BRAND.address}</span></div>
          <div className="flex items-center gap-3"><Phone className="text-[#B84A32] w-4 h-4 flex-shrink-0" /> <span className="text-[#F5EFE5]">{RESTAURANT_BRAND.phone}</span></div>
          <div className="flex items-center gap-3"><Mail className="text-[#B84A32] w-4 h-4 flex-shrink-0" /> <span className="text-[#F5EFE5]">{RESTAURANT_BRAND.email}</span></div>
          <div className="flex items-center gap-3"><Clock className="text-[#B84A32] w-4 h-4 flex-shrink-0" /> <span className="text-[#F5EFE5]">{RESTAURANT_BRAND.operatingHours}</span></div>
        </div>
        <div className="bg-[#211B16] p-6 rounded-2xl flex items-center justify-center text-center text-xs text-[#B8AEA1]/60 border border-[#3A3027] shadow-xl min-h-[160px]">
          Interactive Sanctuary Map View Placeholder
        </div>
      </div>
    </div>
  );
};
