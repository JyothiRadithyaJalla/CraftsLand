import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Leaf, ChefHat, Sparkles, Flame, Utensils } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { useMenu } from '@shared/hooks/useMenu';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import { CinematicHero } from '../components/CinematicHero';
import { ComingSoonMarquee } from '../components/ComingSoonMarquee';
import type { Dish } from '@shared/types/menu';

export const HomePage: React.FC = () => {
  const { dishes } = useMenu();
  const [selectedQuickViewDish, setSelectedQuickViewDish] = useState<Dish | null>(null);

  // Featured signature dishes
  const featuredDishes = dishes.filter((d) => d.featured).slice(0, 6);

  // Four Experience Highlights
  const pillars = [
    {
      title: 'Fresh Ingredients',
      desc: 'Locally sourced, globally inspired.',
      icon: Leaf,
    },
    {
      title: 'Expert Chefs',
      desc: 'Crafted by passionate chefs.',
      icon: ChefHat,
    },
    {
      title: 'Premium Ambience',
      desc: 'Designed for unforgettable moments.',
      icon: Sparkles,
    },
    {
      title: 'Made With Care',
      desc: 'Because every detail matters.',
      icon: Heart,
    },
  ];

  // Real mood discovery mapped directly to authenticated database attributes
  const moods = [
    {
      title: "Chef's Curations",
      desc: 'Master craft dishes chosen by our culinary team',
      href: '/menu?tag=CHEFS_CHOICE',
      icon: ChefHat,
      count: dishes.filter((d) => d.dietaryTags.includes('CHEFS_CHOICE')).length,
    },
    {
      title: 'Signature Icons',
      desc: 'Our most celebrated creations plated to perfection',
      href: '/menu?tag=SIGNATURE',
      icon: Sparkles,
      count: dishes.filter((d) => d.dietaryTags.includes('SIGNATURE')).length,
    },
    {
      title: 'Botanical & Fresh',
      desc: 'Plant-forward garden botanicals and light greens',
      href: '/menu?tag=VEGAN',
      icon: Leaf,
      count: dishes.filter((d) => d.dietaryTags.includes('VEGAN') || d.dietaryTags.includes('VEGETARIAN')).length,
    },
    {
      title: 'Bold & Fiery',
      desc: 'Artisanal spices with wood-fired heat',
      href: '/menu?tag=SPICY',
      icon: Flame,
      count: dishes.filter((d) => d.dietaryTags.includes('SPICY')).length,
    },
    {
      title: 'Hearty Mains',
      desc: 'Slow-simmered gravies and flame-seared mains',
      href: '/menu/mains',
      icon: Utensils,
      count: dishes.filter((d) => d.categorySlug === 'mains').length,
    },
    {
      title: 'Something Sweet',
      desc: 'Artisanal confections and chilled indulgences',
      href: '/menu/desserts',
      icon: Heart,
      count: dishes.filter((d) => d.categorySlug === 'desserts').length,
    },
  ];

  return (
    <div className="space-y-0 pb-24 overflow-x-hidden">
      <MetaTags
        title="Aura — Good Food Brighter Moods"
        description="Experience a world of flavors crafted with passion and the freshest ingredients."
      />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC FULL-SCREEN VIDEO HERO */}
      {/* ========================================================================= */}
      <CinematicHero />

      {/* ========================================================================= */}
      {/* 2. THE FOUR PILLARS / EXPERIENCE SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDD9CB] hover:border-[#31543A]/50 hover:shadow-sm transition-all duration-300 space-y-4 text-center group shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#31543A]/10 border border-[#31543A]/20 text-[#31543A] flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#182019] group-hover:text-[#31543A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#626F64] text-xs leading-relaxed font-sans">
                  "{item.desc}"
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT ARE YOU IN THE MOOD FOR? (REAL DATABASE DISCOVERY) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="font-sans text-xs font-bold text-[#31543A] tracking-[0.25em] uppercase block">
            Sensory Exploration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#182019]">
            What Are You in the Mood For?
          </h2>
          <p className="text-[#626F64] text-xs sm:text-sm font-light leading-relaxed">
            Navigate our seasonal menu through taste profiles, culinary heat, and botanical inspirations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {moods.map((mood) => {
            const MoodIcon = mood.icon;
            return (
              <Link
                key={mood.title}
                to={mood.href}
                className="group relative bg-white p-5 rounded-2xl border border-[#DDD9CB] hover:border-[#31543A] transition-all duration-300 flex flex-col items-center text-center space-y-3 shadow-xs hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] group-hover:bg-[#31543A] text-[#31543A] group-hover:text-white flex items-center justify-center transition-colors">
                  <MoodIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#182019] group-hover:text-[#31543A] transition-colors leading-tight">
                    {mood.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#626F64] mt-1 block">
                    {mood.count} {mood.count === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SIGNATURE FEATURED DISHES (WITH VIDEO AUTOPLAY) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DDD9CB] pb-6">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-[#31543A] tracking-[0.25em] uppercase block">
              Curated Selections
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#182019]">
              Signature Harvest Dishes
            </h2>
            <p className="text-[#626F64] text-sm font-light max-w-xl">
              Watch each dish come alive with cinematic video previews and farm-fresh artistry.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#31543A] hover:text-[#26432E] uppercase tracking-widest group"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onQuickView={(d) => setSelectedQuickViewDish(d)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EDITORIAL PHILOSOPHY & GASTRONOMY STORYTELLING */}
      {/* ========================================================================= */}
      <section className="bg-[#0A1F12] text-[#F7F4EC] py-24 sm:py-32 relative overflow-hidden border-y border-[#183621]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,149,106,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-sans text-xs font-bold text-[#78956A] tracking-[0.3em] uppercase block">
                The Aura Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-white">
                {RESTAURANT_BRAND.storyHeading}
              </h2>
              <p className="text-[#DDD9CB] text-sm sm:text-base font-light leading-relaxed">
                {RESTAURANT_BRAND.storySubheading} At Aura, dining is approached as an unhurried sensory dialogue. From our morning forage of organic herbs to the smoldering oak logs that season our wood-fired hearths, every plate embodies our devotion to purity, vitality, and mood elevation.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#78956A] hover:bg-[#628054] text-[#002B08] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                >
                  <span>Our Culinary Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/reservation"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#F7F4EC] hover:text-[#78956A] uppercase tracking-widest transition-colors"
                >
                  <span>Reserve Table</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop"
                    alt="Wood-fired craft"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
                  <span className="font-serif text-2xl font-bold text-[#78956A] block">100%</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#DDD9CB]">Artisanal Hearth</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
                  <span className="font-serif text-2xl font-bold text-[#78956A] block">Daily</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#DDD9CB]">Fresh Harvest</span>
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
                    alt="Plated culinary excellence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMING SOON CONTINUOUS HORIZONTAL MARQUEE SHOWCASE (RIGHT -> LEFT) */}
      {/* ========================================================================= */}
      <ComingSoonMarquee
        dishes={dishes}
        onSelectDish={(d) => setSelectedQuickViewDish(d)}
      />

      {/* Quick View Modal */}
      <DishDetailModal
        dish={selectedQuickViewDish}
        isOpen={!!selectedQuickViewDish}
        onClose={() => setSelectedQuickViewDish(null)}
        onSelectDish={(d) => setSelectedQuickViewDish(d)}
      />
    </div>
  );
};
