import React from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <MetaTags title="Concierge & Location | Craftsland" />
      <div className="text-center space-y-2">
        <h1 className="font-serif text-4xl font-bold text-[#111A15]">Concierge & Sanctuary Location</h1>
        <p className="text-[#5C6E63] text-sm">Reach our hospitality team or plan your arrival.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white p-8 rounded-3xl space-y-4 text-xs text-[#5C6E63] border border-[#E2E8E0] shadow-sm">
          <div className="flex items-center gap-3"><MapPin className="text-[#15803D] w-4 h-4 flex-shrink-0" /> <span className="text-[#111A15] font-medium">{RESTAURANT_BRAND.address}</span></div>
          <div className="flex items-center gap-3"><Phone className="text-[#15803D] w-4 h-4 flex-shrink-0" /> <span className="text-[#111A15] font-medium">{RESTAURANT_BRAND.phone}</span></div>
          <div className="flex items-center gap-3"><Mail className="text-[#15803D] w-4 h-4 flex-shrink-0" /> <span className="text-[#111A15] font-medium">{RESTAURANT_BRAND.email}</span></div>
          <div className="flex items-center gap-3"><Clock className="text-[#15803D] w-4 h-4 flex-shrink-0" /> <span className="text-[#111A15] font-medium">{RESTAURANT_BRAND.operatingHours}</span></div>
        </div>
        <div className="bg-[#F1F7F2] p-8 rounded-3xl flex items-center justify-center text-center text-xs text-[#5C6E63] border border-[#E2E8E0] shadow-xs min-h-[160px] font-medium">
          Interactive Sanctuary Map View Placeholder
        </div>
      </div>
    </div>
  );
};
