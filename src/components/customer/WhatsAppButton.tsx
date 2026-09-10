import React from 'react';
import { MessageCircle } from 'lucide-react';
import { RESTAURANT_BRAND } from '../../config/constants';

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
      className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all flex items-center justify-center cursor-pointer group"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
        Concierge Chat
      </span>
    </a>
  );
};
