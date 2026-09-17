import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Star, Heart, Leaf, ChefHat, ChevronRight, Sparkles } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { useMenu } from '@shared/hooks/useMenu';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import { CinematicHero } from '../components/CinematicHero';
import type { Dish } from '@shared/types/menu';

export const HomePage: React.FC = () => {
  const { dishes, categories } = useMenu();
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

  const testimonials = [
    {
      name: 'Julian Montgomery',
      role: 'Gastronomy Critic',
      rating: 5,
      review: "Craftsland is a revelation. The Truffle Mushroom Risotto and Wood-fired Margherita strike the ideal balance of culinary perfection and comforting joy.",
    },
    {
      name: 'Seraphina Lin',
      role: 'Lifestyle Connoisseur',
      rating: 5,
      review: "The warm gold ambiance, friendly staff, and the decadent Chocolate Lava Cake make this my absolute favorite dinner destination in the city.",
    },
    {
      name: 'Arthur Sterling',
      role: 'Private Patron',
      rating: 5,
      review: "Good Food Brighter Moods is not just a tagline here—it is an authentic promise felt in every bite and every interaction.",
    },
  ];

  return (
    <div className="space-y-0 pb-24 overflow-x-hidden">
      <MetaTags
        title="Craftsland — Good Food Brighter Moods"
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
      {/* 3. SIGNATURE FEATURED DISHES (WITH VIDEO AUTOPLAY) */}
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
      {/* 4. FOOD CATEGORIES SHOWCASE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-24">
        <div className="text-center space-y-3">
          <span className="font-sans text-xs font-bold text-[#31543A] tracking-[0.25em] uppercase block">
            Seasonal Menus
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#182019]">
            Fresh Categories
          </h2>
          <p className="text-[#626F64] text-sm max-w-lg mx-auto font-light">
            Every course is thoughtfully composed with artisanal flair, wholesome greens, and vibrant seasonings.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu/${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF8F3] border border-[#DDD9CB] hover:border-[#31543A]/60 hover:shadow-md transition-all duration-500 flex flex-col justify-end p-4 text-center shadow-xs"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop'}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-base font-bold text-white group-hover:text-[#78956A] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-white/80 uppercase tracking-wider block font-sans">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR STORY SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-[#FAF8F3] p-8 sm:p-16 rounded-3xl border border-[#DDD9CB] shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-sans text-xs font-bold text-[#31543A] tracking-[0.3em] uppercase block">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#182019] leading-tight">
              {RESTAURANT_BRAND.storyHeading}
            </h2>
            <p className="text-[#3A453C] text-sm leading-relaxed font-sans">
              At Craftsland, food transforms everyday moments into pure joy. We celebrate farm-to-table freshness, wholesome recipes, and the uplifting feeling of savoring clean, thoughtfully crafted meals.
            </p>
            <p className="text-[#3A453C] text-sm leading-relaxed font-sans">
              From our vibrant grain bowls and wild mushroom risottos to hand-crafted artisanal sourdough, every bite honors nourishment, vibrant flavor, and mindful culinary craftsmanship.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#31543A] hover:text-[#26432E] uppercase tracking-widest group"
              >
                <span>Discover Our Heritage</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#DDD9CB] shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"
              alt="Craftsland culinary team"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-serif text-sm font-bold text-[#F7F4EC] italic">
                "We don't simply cook food; we craft happiness and brighter moods."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. RESERVATION CTA */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl mx-3 sm:mx-8 overflow-hidden border border-[#31543A] shadow-md py-20 px-6 sm:px-12 text-center bg-[#26432E]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop"
            alt="Craftsland dining table"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#182019]/90 via-[#26432E]/85 to-[#182019]/90" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-[#78956A] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Your Table Awaits
          </h2>
          <p className="text-[#E8E5D8] text-sm font-light leading-relaxed font-sans">
            Whether an intimate dinner for two, a healthy celebration with close friends, or a grand family reunion, reserve your sanctuary at Craftsland today.
          </p>
          <div className="pt-4">
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-[#F7F4EC] hover:bg-white text-[#26432E] font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-md hover:shadow-lg cursor-pointer border border-[#F7F4EC] min-h-[48px]"
            >
              <span>Reserve Your Table</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PATRON REVIEWS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-24">
        <div className="text-center space-y-3">
          <span className="font-sans text-xs font-bold text-[#31543A] tracking-[0.25em] uppercase block">
            Accolades & Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#182019]">
            What Our Patrons Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white p-8 rounded-2xl border border-[#DDD9CB] space-y-4 flex flex-col justify-between shadow-xs hover:border-[#31543A]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex text-[#C97852] gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C97852] text-[#C97852]" />
                  ))}
                </div>
                <p className="text-[#3A453C] text-xs leading-relaxed italic font-serif">
                  "{t.review}"
                </p>
              </div>
              <div className="pt-4 border-t border-[#DDD9CB]">
                <h4 className="font-serif font-bold text-sm text-[#182019]">{t.name}</h4>
                <p className="text-[11px] text-[#31543A] font-sans font-semibold">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <DishDetailModal
        dish={selectedQuickViewDish}
        isOpen={!!selectedQuickViewDish}
        onClose={() => setSelectedQuickViewDish(null)}
      />
    </div>
  );
};
