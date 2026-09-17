import React from 'react';
import { MessageCircle } from 'lucide-react';
import { RESTAURANT_BRAND } from '@shared/config/constants';

export const WhatsAppButton: React.FC = () => {
  const message = encodeURIComponent(
    `Hello Concierge at ${RESTAURANT_BRAND.name}, I would like to inquire about table reservations and private vault dining experiences.`
  );
  const whatsappUrl = `https://wa.me/${RESTAURANT_BRAND.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Concierge on WhatsApp"
      className="fixed bottom-20 right-6 z-40 px-4 py-3 rounded-full bg-[#15803D] border border-[#166534] text-white shadow-[0_8px_25px_rgba(21,128,61,0.30)] hover:bg-[#166534] hover:scale-105 transition-all duration-300 flex items-center gap-2.5 cursor-pointer group"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
      </span>
      <MessageCircle className="w-4 h-4 text-white" />
      <span className="text-xs font-sans font-bold tracking-wide text-white">
        Concierge Desk
      </span>
    </a>
  );
};
