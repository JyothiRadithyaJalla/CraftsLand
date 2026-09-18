import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { getRestaurantLiveStatus } from '@shared/utils/operatingHours';
import { MapPin, Phone, Mail, Clock, Compass, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const liveStatus = getRestaurantLiveStatus();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESTAURANT_BRAND.address)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-[#182019]">
      <MetaTags
        title="Concierge & Sanctuary Location | Aura"
        description="Connect with the Aura hospitality team. Sanctuary address, operating hours, direct phone, and table reservation assistance."
      />

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="font-sans text-xs font-bold text-[#31543A] tracking-[0.25em] uppercase block">
          Hospitality & Reservations Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#182019]">
          Contact Our Sanctuary
        </h1>
        <p className="text-[#626F64] text-sm sm:text-base font-light leading-relaxed">
          Whether planning an intimate evening, arranging a private culinary celebration, or seeking dietary guidance, our hospitality staff awaits your word.
        </p>

        {/* Live Operating Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#DDD9CB] shadow-xs text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${liveStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className={`font-bold ${liveStatus.isOpen ? 'text-[#31543A]' : 'text-amber-800'}`}>
            {liveStatus.statusLabel}
          </span>
          <span className="text-[#DDD9CB]">•</span>
          <span className="text-[#626F64]">{liveStatus.detailText}</span>
        </div>
      </div>

      {/* ── 4 Direct Concierge Touchpoints ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Telephone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-white p-6 rounded-2xl border border-[#DDD9CB] hover:border-[#31543A]/40 transition-all shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#31543A]/10 text-[#31543A] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#182019]">Concierge Line</h3>
            <p className="text-[#626F64] text-xs font-sans">Immediate booking inquiries & guest reception.</p>
            <p className="font-mono text-sm font-bold text-[#31543A]">{RESTAURANT_BRAND.phone}</p>
          </div>
          <a
            href={`tel:${RESTAURANT_BRAND.phone}`}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F3] hover:bg-[#31543A] text-[#31543A] hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center border border-[#DDD9CB] block cursor-pointer"
          >
            Call Directly
          </a>
        </motion.div>

        {/* Ask AURA AI Concierge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-[#DDD9CB] hover:border-[#31543A]/40 transition-all shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#002B08] text-[#C97852] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#182019]">Ask AURA</h3>
            <p className="text-[#626F64] text-xs font-sans">Instant recommendations grounded in our actual menu.</p>
            <p className="font-mono text-sm font-bold text-[#31543A]">AI Concierge Desk</p>
          </div>
          <Link
            to="/menu"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F3] hover:bg-[#31543A] text-[#31543A] hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center border border-[#DDD9CB] block cursor-pointer"
          >
            Explore & Ask
          </Link>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white p-6 rounded-2xl border border-[#DDD9CB] hover:border-[#31543A]/40 transition-all shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#31543A]/10 text-[#31543A] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#182019]">Private Inquiries</h3>
            <p className="text-[#626F64] text-xs font-sans">Private dining, press, and brand collaborations.</p>
            <p className="font-mono text-xs font-semibold text-[#31543A] truncate">{RESTAURANT_BRAND.email}</p>
          </div>
          <a
            href={`mailto:${RESTAURANT_BRAND.email}`}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F3] hover:bg-[#31543A] text-[#31543A] hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center border border-[#DDD9CB] block cursor-pointer"
          >
            Send Inquiry
          </a>
        </motion.div>

        {/* Directions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-[#DDD9CB] hover:border-[#31543A]/40 transition-all shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#31543A]/10 text-[#31543A] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#182019]">Location & Portico</h3>
            <p className="text-[#626F64] text-xs font-sans">Culinary Quarter sanctuary with valet arrival.</p>
            <p className="text-xs font-medium text-[#182019] line-clamp-2">{RESTAURANT_BRAND.address}</p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F3] hover:bg-[#31543A] text-[#31543A] hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center border border-[#DDD9CB] block cursor-pointer"
          >
            Open in Maps
          </a>
        </motion.div>
      </div>

      {/* ── Editorial Sanctuary Experience Details ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#DDD9CB] p-8 sm:p-10 space-y-8 shadow-xs">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-[#31543A] tracking-[0.2em] uppercase block">
              Sanctuary Etiquette & Arrival
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#182019]">
              Planning Your Visit
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[#626F64] leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#182019] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#31543A]" /> Operating Hours
              </h4>
              <p className="font-medium text-[#182019]">{RESTAURANT_BRAND.operatingHours}</p>
              <p>Monday: Reserved for private culinary preparation and harvest sourcing.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#182019] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#31543A]" /> Valet & Parking
              </h4>
              <p>Complimentary dedicated valet service is provided at the main porte-cochère on Artisan Boulevard.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#182019] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#31543A]" /> Dress Code & Ambience
              </h4>
              <p>Smart Casual to Evening Elegance. We cultivate a cinematic, ambient atmosphere under warm low-light chandeliers.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#182019] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#31543A]" /> Private Salon Dining
              </h4>
              <p>The Founder's Private Vault accommodates bespoke culinary gatherings for up to 14 guests with tailored sommelier pairings.</p>
            </div>
          </div>
        </div>

        {/* Direct Reservation CTA card */}
        <div className="bg-[#002B08] text-[#F7F4EC] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-sm border border-[#003B0D]">
          <div className="space-y-4">
            <span className="font-sans text-xs font-bold text-[#78956A] tracking-[0.25em] uppercase block">
              Table Bookings
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
              Experience Our Seasonal Table
            </h3>
            <p className="text-xs text-[#A6B5A8] leading-relaxed font-sans">
              Advance reservations are warmly encouraged to guarantee seating in your preferred dining sanctuary.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/reservation"
              className="w-full py-4 px-6 rounded-xl bg-[#78956A] hover:bg-[#628054] active:scale-[0.98] text-[#002B08] font-bold text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-[#A6B5A8] text-center">
              Instant confirmation • No booking fee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

