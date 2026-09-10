import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '../../components/common/MetaTags';
import { Utensils, Calendar, Award, ShieldCheck, Heart } from 'lucide-react';
import { RESTAURANT_BRAND } from '../../config/constants';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <MetaTags title="Our Culinary Philosophy | L'Étoile Noir" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
          Heritage & Vision
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-gold-gradient">
          The Art of Sensory Gastronomy
        </h1>
        <p className="text-gray-300 text-base font-light leading-relaxed">
          {RESTAURANT_BRAND.name} was born from a desire to elevate dining beyond a meal into a transformative cultural performance.
        </p>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 glass-panel p-8 rounded-3xl border border-[#D4AF37]/20">
          <h2 className="font-serif text-3xl font-bold text-[#F4F1EA]">Our Culinary Philosophy</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every dish begins with respect for origin. We work directly with small-scale artisanal producers, deep-sea fisheries, and organic foragers across France and Japan.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            By marrying classical French saucier traditions with modern texture elevation, our kitchen creates contrast—crisp against velvety, hot against iced, subtle against intense.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-[#D4AF37]">
            <div className="flex items-center gap-2"><Award className="w-4 h-4" /> 3 Michelin Stars</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Organic Foraging</div>
            <div className="flex items-center gap-2"><Utensils className="w-4 h-4" /> Handmade Plating</div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4" /> Bespoke Hospitality</div>
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-[#D4AF37]/30 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"
            alt="Culinary Creation"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Chef Profile */}
      <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-[#D4AF37]/20 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#D4AF37]/30">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop"
            alt="Chef Laurent"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.25em] uppercase block">
            Executive Culinary Director
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#F4F1EA]">Chef Jean-Luc Laurent</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Having served at legendary Parisian sanctuaries and Tokyo omakase counters, Chef Laurent believes that luxury dining must stir the soul. His signature 9-course tasting menu is updated seasonally with rare wild harvests.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-wider"
            >
              <Utensils className="w-4 h-4" /> Explore His Menu
            </Link>
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37] text-[#D4AF37] font-semibold text-xs uppercase tracking-wider hover:bg-[#D4AF37]/10"
            >
              <Calendar className="w-4 h-4" /> Reserve a Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
