import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { Utensils, Calendar, Heart, Leaf, ChefHat } from 'lucide-react';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { ImageLightbox } from '@shared/components/ImageLightbox';

export const AboutPage: React.FC = () => {
  const [activeImage, setActiveImage] = useState<{ url: string; title: string; category?: string } | null>(null);

  return (
    <div className="space-y-24 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <MetaTags
        title="Our Story & Culinary Passion | Craftsland"
        description="Learn how Craftsland delivers Good Food Brighter Moods through exceptional craft, farm-fresh ingredients, and warm hospitality."
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-sans text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
          Heritage & Mission
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-gold-gradient">
          Crafted with Passion. Served with Purpose.
        </h1>
        <p className="text-gray-300 text-base font-light leading-relaxed font-sans">
          {RESTAURANT_BRAND.storySubheading}
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 glass-panel p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/20">
          <h2 className="font-serif text-3xl font-bold text-[#F4F1EA]">The Craftsland Philosophy</h2>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            We founded Craftsland on a simple realization: extraordinary food transforms moods. Whether it's the warm comfort of handmade pasta ribbons or the smoky aroma of flame-seared herbs, food has the power to spark joy and connection.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed font-sans">
            Our culinary artisans partner with organic regenerative farms, small-batch dairies, and regional growers. By honoring seasonal produce and slow cooking traditions, we craft meals that nourish both body and spirit.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-[#D4AF37]">
            <div className="flex items-center gap-2"><Leaf className="w-4 h-4 text-emerald-400" /> Farm Sourced</div>
            <div className="flex items-center gap-2"><ChefHat className="w-4 h-4 text-[#D4AF37]" /> Master Artisans</div>
            <div className="flex items-center gap-2"><Utensils className="w-4 h-4 text-amber-300" /> Scratch Kitchen</div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" /> Warm Hospitality</div>
          </div>
        </div>

        <div
          data-cursor="image"
          onClick={() => setActiveImage({
            url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1400&auto=format&fit=crop',
            title: 'Craftsland Scratch Culinary Kitchen Creation',
            category: 'Kitchen Heritage'
          })}
          className="group relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 shadow-2xl cursor-pointer transition-all duration-500"
        >
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"
            alt="Craftsland Culinary Creation"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-xs font-serif font-bold text-[#D4AF37]">Click to Expand View</span>
          </div>
        </div>
      </div>

      {/* Executive Chef & Culinary Team */}
      <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-[#D4AF37]/20 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        <div
          data-cursor="image"
          onClick={() => setActiveImage({
            url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop',
            title: 'Executive Culinary Director Master Artisan Mateo Rossi',
            category: 'Culinary Master'
          })}
          className="group relative aspect-square rounded-2xl overflow-hidden border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 shadow-xl cursor-pointer transition-all duration-500"
        >
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop"
            alt="Craftsland Executive Culinary Director"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-xs font-serif font-bold text-[#D4AF37]">Portrait Preview</span>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <span className="font-sans text-xs font-bold text-[#D4AF37] tracking-[0.25em] uppercase block">
            Executive Culinary Director
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#F4F1EA]">Master Artisan Mateo Rossi</h2>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            With decades of experience spanning Michelin-starred kitchens in Milan and rustic stone-oven bakeries in the Mediterranean, Chef Rossi brings an obsessive devotion to flavor harmony and authentic cooking technique.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <Utensils className="w-4 h-4" /> Explore the Menu
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

      {/* Shared Lightbox */}
      <ImageLightbox
        isOpen={!!activeImage}
        imageUrl={activeImage?.url || null}
        title={activeImage?.title}
        category={activeImage?.category}
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
};
