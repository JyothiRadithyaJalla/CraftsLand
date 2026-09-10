import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, Utensils, Star, ShieldCheck, Wine } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { useMenu } from '@shared/hooks/useMenu';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import type { Dish } from '@shared/types/menu';

export const HomePage: React.FC = () => {
  const { dishes } = useMenu();
  const [selectedQuickViewDish, setSelectedQuickViewDish] = useState<Dish | null>(null);

  const featuredDishes = dishes.slice(0, 6);

  const experiences = [
    {
      title: 'Haute Dining Room',
      desc: 'An opulent main hall illuminated by bespoke hand-blown crystal chandeliers and intimate leather booth seating.',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: "Chef's Counter",
      desc: 'An intimate 8-seat interactive front-row experience directly overlooking Executive Chef Jean-Luc Laurent.',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Private Vault',
      desc: 'A secluded VIP subterranean dining suite equipped with private sommelier service for up to 12 guests.',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Seasonal Tasting Journey',
      desc: 'A 9-course sensory progression paired with rare grand cru vintages from our temperature-controlled reserve cellar.',
      img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const testimonials = [
    {
      name: 'Lord Sterling Vance',
      role: 'Michelin Guide Patron',
      rating: 5,
      review: "The Imperial Beluga Caviar Tartlet and A5 Wagyu at L'Étoile Noir are unrivaled anywhere in Europe. Absolute culinary perfection.",
    },
    {
      name: 'Elena Rostova',
      role: 'Vogue Gastronomy Editor',
      rating: 5,
      review: "An extraordinary sensory symphony. The ambiance, sommelier pairings, and smoked chocolate dessert make this a pinnacle dining sanctuary.",
    },
    {
      name: 'Marcus Thorne',
      role: 'Private Vault Connoisseur',
      rating: 5,
      review: "Hosting our private anniversary in the Vault was flawless. Service was discreet, elegant, and deeply memorable.",
    },
  ];

  return (
    <div className="space-y-28 pb-20 overflow-x-hidden">
      <MetaTags title="L'Étoile Noir — Haute Cuisine & Sensory Dining" />

      {/* A. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden rounded-3xl mx-4 sm:mx-8 my-4 border border-[#D4AF37]/25 shadow-[0_0_50px_rgba(11,12,16,0.9)]">
        {/* Background Poster Image with Video Architecture Fallback */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920&auto=format&fit=crop"
            alt="L'Étoile Noir Sanctuary"
            className="w-full h-full object-cover scale-105 animate-pulse duration-10000 opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/65 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0B0C10]/50 to-[#0B0C10]" />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Three Michelin Star Distinction
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gold-gradient leading-[1.05]">
            {RESTAURANT_BRAND.name}
          </h1>

          <p className="font-sans text-base sm:text-xl text-[#F4F1EA]/85 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Where haute gastronomy, rare caviar reserves, and French culinary artistry converge into an unforgettable sensory sanctuary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
            >
              <Utensils className="w-4 h-4" /> Explore Haute Menu
            </Link>
            <Link
              to="/reservation"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#D4AF37]/50 text-[#F4F1EA] hover:bg-[#D4AF37]/10 font-semibold text-xs tracking-[0.2em] uppercase transition-all cursor-pointer backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" /> Reserve a Table
            </Link>
          </div>
        </motion.div>
      </section>

      {/* B. BRAND INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
              The Sanctuary
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F4F1EA] leading-tight">
              An Architectural & Culinary Renaissance
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              Founded in Paris and rebuilt into an international icon, L'Étoile Noir celebrates the harmony between purist ingredients and revolutionary techniques.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              From our wild-harvested Perigord black truffles to our line-caught Chilean sea bass, every creation honors the heritage of fine dining while pushing sensory boundaries.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#D4AF37]">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 100% Sustainable Sourcing</span>
              <span className="flex items-center gap-1.5"><Wine className="w-4 h-4" /> 1,200+ Reserve Cellar Vintages</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl glass-card">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"
                alt="Plating Artistry"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* C. FEATURED DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
            Culinary Highlights
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gold-gradient">
            Signature Reserve Creations
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            A curated glimpse into our current seasonal menu and chef's reserve selections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onQuickView={(d) => setSelectedQuickViewDish(d)}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#0B0C10] transition-all cursor-pointer"
          >
            View Complete Haute Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* D. CULINARY STORY */}
      <section className="glass-panel py-16 px-6 sm:px-12 mx-4 sm:mx-8 rounded-3xl border border-[#D4AF37]/20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
              The Master Craftsman
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4F1EA]">
              Chef Jean-Luc Laurent
            </h2>
            <blockquote className="font-serif text-base italic text-[#D4AF37] border-l-2 border-[#D4AF37] pl-4 py-1">
              "Cooking is not merely nourishment; it is an ephemeral theatre performance designed to evoke memory, emotion, and wonder."
            </blockquote>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Trained in Paris and Tokyo, Chef Jean-LucLaurent brings over 25 years of gastronomy excellence, shaping each menu item around seasonal peak perfection.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#D4AF37]/30">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop"
              alt="Executive Chef"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* E. EXPERIENCE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
            Bespoke Hospitality
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4F1EA]">
            Distinct Dining Spheres
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/40 transition-all"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={exp.img} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-[#12141C]/40 to-transparent" />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#F4F1EA] group-hover:text-[#D4AF37] transition-colors">{exp.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* F. RESERVATION CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-[#D4AF37]/30 space-y-6 relative overflow-hidden">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gold-gradient">
            Secure Your Table
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Due to our intimate seating configuration, advance bookings are strongly recommended. Join us for an extraordinary evening.
          </p>
          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all cursor-pointer"
          >
            Reserve Your Table <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* G. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
            Patron Reflections
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#F4F1EA]">
            Acclaim & Critical Praise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-[#D4AF37]">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-xs italic leading-relaxed">"{test.review}"</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="font-serif font-bold text-sm text-[#F4F1EA]">{test.name}</p>
                <p className="text-[10px] text-[#D4AF37] uppercase font-mono">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dish Quick Details Modal */}
      <DishDetailModal
        dish={selectedQuickViewDish}
        isOpen={!!selectedQuickViewDish}
        onClose={() => setSelectedQuickViewDish(null)}
      />
    </div>
  );
};
