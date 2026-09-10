import React from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANT_BRAND } from '../../config/constants';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0C10] border-t border-[#D4AF37]/20 text-[#F4F1EA] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Philosophy */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-wider text-gold-gradient uppercase">
              {RESTAURANT_BRAND.name}
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              An extraordinary culinary sanctuary fusing French culinary precision, rare caviar reserves, and immersive sensory dining.
            </p>
            <p className="text-[#D4AF37] font-serif text-xs italic">
              "Sensory Gastronomy at its Pinnacle."
            </p>
          </div>

          {/* Quick Experience Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#D4AF37] uppercase font-semibold">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-sans">
              <li><Link to="/menu" className="hover:text-[#D4AF37] transition-colors">Haute Menu</Link></li>
              <li><Link to="/menu/chefs-tasting" className="hover:text-[#D4AF37] transition-colors">Chef's Tasting Journey</Link></li>
              <li><Link to="/reservation" className="hover:text-[#D4AF37] transition-colors">Table Reservations</Link></li>
              <li><Link to="/events" className="hover:text-[#D4AF37] transition-colors">Private Vault Events</Link></li>
              <li><Link to="/gallery" className="hover:text-[#D4AF37] transition-colors">Ambiance Gallery</Link></li>
            </ul>
          </div>

          {/* Location & Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#D4AF37] uppercase font-semibold">
              Contact & Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{RESTAURANT_BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{RESTAURANT_BRAND.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{RESTAURANT_BRAND.email}</span>
              </li>
            </ul>
          </div>

          {/* Hours & Dress Code */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#D4AF37] uppercase font-semibold">
              Hours & Protocol
            </h4>
            <div className="space-y-2 text-xs text-gray-400 font-sans">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Service Hours</p>
                  <p>{RESTAURANT_BRAND.operatingHours}</p>
                </div>
              </div>
              <p className="text-[11px] pt-2 text-gray-500 border-t border-white/10">
                Dress Code: Smart Elegant. Valet parking available at sanctuary entrance.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {RESTAURANT_BRAND.name}. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-[#D4AF37]">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-[#D4AF37]">Terms of Dining</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
