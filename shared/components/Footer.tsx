import React from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANT_BRAND } from '../config/constants';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171310] border-t border-[#3A3027] text-[#F5EFE5] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Philosophy */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-wider text-[#F5EFE5] uppercase">
              {RESTAURANT_BRAND.name}
            </h3>
            <p className="text-[#B8AEA1] text-xs leading-relaxed font-sans">
              An extraordinary culinary sanctuary fusing culinary precision, curated artisan ingredients, and immersive sensory dining.
            </p>
            <p className="text-[#B84A32] font-serif text-xs font-semibold italic">
              "Good Food Brighter Moods"
            </p>
          </div>

          {/* Quick Experience Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#B84A32] uppercase font-bold">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs text-[#B8AEA1] font-sans">
              <li><Link to="/menu" className="hover:text-[#B84A32] transition-colors">Artisan Menu</Link></li>
              <li><Link to="/menu" className="hover:text-[#B84A32] transition-colors">Chef's Tasting Journey</Link></li>
              <li><Link to="/reservation" className="hover:text-[#B84A32] transition-colors">Table Reservations</Link></li>
              <li><Link to="/events" className="hover:text-[#B84A32] transition-colors">Private Dining & Events</Link></li>
              <li><Link to="/gallery" className="hover:text-[#B84A32] transition-colors">Ambiance Gallery</Link></li>
            </ul>
          </div>

          {/* Location & Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#B84A32] uppercase font-bold">
              Contact & Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8AEA1] font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B84A32] shrink-0 mt-0.5" />
                <span>{RESTAURANT_BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B84A32] shrink-0" />
                <span>{RESTAURANT_BRAND.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B84A32] shrink-0" />
                <span>{RESTAURANT_BRAND.email}</span>
              </li>
            </ul>
          </div>

          {/* Hours & Protocol */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#B84A32] uppercase font-bold">
              Hours & Protocol
            </h4>
            <div className="space-y-2 text-xs text-[#B8AEA1] font-sans">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#B84A32] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#F5EFE5] font-semibold">Service Hours</p>
                  <p>{RESTAURANT_BRAND.operatingHours}</p>
                </div>
              </div>
              <p className="text-[11px] pt-2 text-[#B8AEA1] border-t border-[#3A3027]">
                Dress Code: Smart Casual / Elegant. Valet parking available.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-[#3A3027] flex flex-col sm:flex-row items-center justify-between text-xs text-[#B8AEA1]">
          <p>© {new Date().getFullYear()} {RESTAURANT_BRAND.name}. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-[#B84A32]">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-[#B84A32]">Terms of Dining</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
