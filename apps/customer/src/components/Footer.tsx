import React from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { CraftslandLogo } from '@shared/components/CraftslandLogo';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#182019] border-t border-[#2A352C] text-[#F7F4EC] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Philosophy */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <CraftslandLogo variant="green-invert" size="md" />
            </Link>
            <p className="text-[#A6B5A8] text-xs leading-relaxed font-sans pt-2">
              A fresh culinary destination delivering vibrant flavors, farm-to-table ingredients, and warm hospitality designed to elevate your mood.
            </p>
            <p className="text-[#78956A] font-serif text-xs font-semibold italic">
              "{RESTAURANT_BRAND.tagline}"
            </p>
          </div>

          {/* Quick Experience Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#78956A] uppercase font-bold">
              Explore Craftsland
            </h4>
            <ul className="space-y-2 text-xs text-[#A6B5A8] font-sans">
              <li><Link to="/menu" className="hover:text-white transition-colors">Fresh Harvest Menu</Link></li>
              <li><Link to="/menu/mains" className="hover:text-white transition-colors">Signature Bowls & Mains</Link></li>
              <li><Link to="/reservation" className="hover:text-white transition-colors">Book a Table</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Private Gatherings & Catering</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Culinary Gallery</Link></li>
            </ul>
          </div>

          {/* Location & Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#78956A] uppercase font-bold">
              Visit & Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A6B5A8] font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#78956A] shrink-0 mt-0.5" />
                <span>{RESTAURANT_BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#78956A] shrink-0" />
                <a href={`tel:${RESTAURANT_BRAND.phone}`} className="hover:text-white transition-colors">
                  {RESTAURANT_BRAND.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#78956A] shrink-0" />
                <a href={`mailto:${RESTAURANT_BRAND.email}`} className="hover:text-white transition-colors">
                  {RESTAURANT_BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#78956A] shrink-0 mt-0.5" />
                <span>{RESTAURANT_BRAND.operatingHours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Club */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#78956A] uppercase font-bold">
              The Craftsland Circle
            </h4>
            <p className="text-xs text-[#A6B5A8] leading-relaxed font-sans">
              Join our community for seasonal harvest previews, healthy culinary recipes, and table privileges.
            </p>
            <div className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-[#242E25] border border-[#364438] rounded-xl text-xs text-[#F7F4EC] placeholder-[#A6B5A8]/50 focus:outline-none focus:border-[#78956A]"
              />
              <button
                type="button"
                className="w-full py-2.5 bg-[#31543A] hover:bg-[#26432E] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-[#26432E] shadow-xs"
              >
                Join Circle
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-14 pt-8 border-t border-[#2A352C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A6B5A8]">
          <p>© {new Date().getFullYear()} CRAFTSLAND Culinary & Healthy Gastronomy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-white transition-colors">Our Story</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
