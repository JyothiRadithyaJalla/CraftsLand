import React from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { CraftslandLogo } from '@shared/components/CraftslandLogo';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0C10] border-t border-[#D4AF37]/20 text-[#F4F1EA] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Philosophy */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <CraftslandLogo variant="primary" size="md" />
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed font-sans pt-2">
              A premium culinary destination delivering joyful flavors, fresh farm-to-table ingredients, and warm hospitality designed to elevate your mood.
            </p>
            <p className="text-[#D4AF37] font-serif text-xs italic">
              "{RESTAURANT_BRAND.tagline}"
            </p>
          </div>

          {/* Quick Experience Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#D4AF37] uppercase font-semibold">
              Explore Craftsland
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-sans">
              <li><Link to="/menu" className="hover:text-[#D4AF37] transition-colors">Artisanal Menu</Link></li>
              <li><Link to="/menu/mains" className="hover:text-[#D4AF37] transition-colors">Signature Mains</Link></li>
              <li><Link to="/reservation" className="hover:text-[#D4AF37] transition-colors">Book a Table</Link></li>
              <li><Link to="/events" className="hover:text-[#D4AF37] transition-colors">Private Events & Catering</Link></li>
              <li><Link to="/gallery" className="hover:text-[#D4AF37] transition-colors">Visual Gallery</Link></li>
            </ul>
          </div>

          {/* Location & Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#D4AF37] uppercase font-semibold">
              Visit & Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{RESTAURANT_BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${RESTAURANT_BRAND.phone}`} className="hover:text-[#D4AF37]">
                  {RESTAURANT_BRAND.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${RESTAURANT_BRAND.email}`} className="hover:text-[#D4AF37]">
                  {RESTAURANT_BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{RESTAURANT_BRAND.operatingHours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Club */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#D4AF37] uppercase font-semibold">
              The Craftsland Club
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Join our members for invitations to seasonal menu tastings, chef tables, and special gatherings.
            </p>
            <div className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-[#12141C] border border-[#D4AF37]/30 rounded-lg text-xs text-[#F4F1EA] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0C10] font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Join Privilege List
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CRAFTSLAND Gastronomy Group. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">Our Story</Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
