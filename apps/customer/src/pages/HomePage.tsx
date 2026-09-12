import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, Star, Heart, Leaf, ChefHat, ChevronRight } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { useMenu } from '@shared/hooks/useMenu';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import type { Dish } from '@shared/types/menu';

export const HomePage: React.FC = () => {
  const { dishes, categories } = useMenu();
  const [selectedQuickViewDish, setSelectedQuickViewDish] = useState<Dish | null>(null);

  // Featured signature dishes (Truffle Risotto, Herb Chicken, Alfredo Pasta, Wood-fired Margherita, Chocolate Lava Cake)
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
    <div className="space-y-32 pb-24 overflow-x-hidden">
      <MetaTags
        title="Craftsland — Good Food Brighter Moods"
        description="Experience a world of flavors crafted with passion and the freshest ingredients."
      />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl mx-3 sm:mx-8 my-4 border border-[#3A3027] shadow-2xl bg-[#0D0B09]">
        {/* Background Ambient Imagery with Cinematic Slow Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920&auto=format&fit=crop"
            alt="Craftsland Warm Dining Atmosphere"
            className="w-full h-full object-cover opacity-25"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-[#0D0B09]/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D0B09]/60 to-[#0D0B09]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-5 sm:space-y-7 pt-6 sm:pt-12">
          {/* Brand Monogram Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#B84A32]/15 border border-[#B84A32]/35 text-[#D29A55] text-xs font-sans font-bold tracking-[0.25em] uppercase backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D29A55]" />
              <span>A World of Crafted Flavors</span>
            </div>
          </motion.div>

          {/* Main Title & Brand Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#F5EFE5] leading-[1.05]">
              {RESTAURANT_BRAND.name}
            </h1>
            <p className="font-serif italic text-2xl sm:text-3xl text-[#C85A3A] font-medium">
              "{RESTAURANT_BRAND.tagline}"
            </p>
          </motion.div>

          {/* Supporting Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-sans text-base sm:text-lg text-[#F5EFE5] max-w-2xl mx-auto font-normal leading-relaxed tracking-wide"
          >
            {RESTAURANT_BRAND.storySubheading}
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/reservation"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#211B16] hover:bg-[#171310] text-[#F5EFE5] hover:text-[#B84A32] font-sans font-semibold text-xs uppercase tracking-[0.2em] border border-[#3A3027] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#B84A32]" />
              <span>Reserve a Table</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE FOUR PILLARS / EXPERIENCE SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="bg-[#211B16] p-6 sm:p-8 rounded-3xl border border-[#3A3027] hover:border-[#B84A32]/50 hover:shadow-xl transition-all duration-300 space-y-4 text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#B84A32]/15 border border-[#B84A32]/30 text-[#B84A32] flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#F5EFE5] group-hover:text-[#B84A32] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#B8AEA1] text-xs leading-relaxed font-sans">
                  "{item.desc}"
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE FEATURED DISHES (WITH VIDEO MEDIA) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#3A3027] pb-6">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-[#B84A32] tracking-[0.25em] uppercase block">
              Curated Selections
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5EFE5]">
              Signature Dishes
            </h2>
            <p className="text-[#B8AEA1] text-sm font-light max-w-xl">
              Hover over dishes to experience motion sizzle previews and culinary artistry.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#B84A32] hover:text-[#C85A3A] uppercase tracking-widest group"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="font-sans text-xs font-bold text-[#B84A32] tracking-[0.25em] uppercase block">
            Crafted Menus
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5EFE5]">
            Food Categories
          </h2>
          <p className="text-[#B8AEA1] text-sm max-w-lg mx-auto font-light">
            Every course is thoughtfully composed with artisanal flair and vibrant seasoning.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu/${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#211B16] border border-[#3A3027] hover:border-[#B84A32]/60 hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-4 text-center"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop'}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/95 via-[#0D0B09]/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-base font-bold text-[#F5EFE5] group-hover:text-[#B84A32] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-[#B8AEA1] uppercase tracking-wider block font-sans">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#171310] p-8 sm:p-16 rounded-3xl border border-[#3A3027] shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-sans text-xs font-bold text-[#B84A32] tracking-[0.3em] uppercase block">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5EFE5] leading-tight">
              {RESTAURANT_BRAND.storyHeading}
            </h2>
            <p className="text-[#B8AEA1] text-sm leading-relaxed font-sans">
              At Craftsland, culinary excellence is more than culinary technique—it is an art form committed to brighter moods. We celebrate harvest freshness, flame-roasted authenticity, and the simple joy of gathering around a table of exceptional food.
            </p>
            <p className="text-[#B8AEA1] text-sm leading-relaxed font-sans">
              From our slow-simmered risotto to stone-fired sourdough pizzas, every dish is an invitation to pause, savor, and create memories.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#B84A32] hover:text-[#C85A3A] uppercase tracking-widest group"
              >
                <span>Discover Our Heritage</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#3A3027] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"
              alt="Craftsland culinary team"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-serif text-sm font-bold text-[#F5EFE5] italic">
                "We don't simply cook food; we craft happiness."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. RESERVATION CTA */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl mx-3 sm:mx-8 overflow-hidden border border-[#3A3027] shadow-2xl py-20 px-6 sm:px-12 text-center bg-gradient-to-br from-[#8B3525] via-[#B84A32] to-[#211B16]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop"
            alt="Craftsland dining table"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/90 via-[#8B3525]/75 to-[#0D0B09]/90" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-[#F5EFE5] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#F5EFE5]">
            Your Table Awaits
          </h2>
          <p className="text-[#F5EFE5]/90 text-sm font-light leading-relaxed font-sans">
            Whether an intimate dinner for two, a celebration with close friends, or a grand family reunion, reserve your sanctuary at Craftsland today.
          </p>
          <div className="pt-4">
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#F5EFE5] hover:bg-[#F5EFE5]/90 text-[#0D0B09] font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl cursor-pointer"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="font-sans text-xs font-bold text-[#B84A32] tracking-[0.25em] uppercase block">
            Accolades & Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5EFE5]">
            What Our Patrons Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#211B16] p-8 rounded-3xl border border-[#3A3027] space-y-4 flex flex-col justify-between shadow-xl hover:border-[#B84A32]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex text-[#D29A55] gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D29A55] text-[#D29A55]" />
                  ))}
                </div>
                <p className="text-[#B8AEA1] text-xs leading-relaxed italic font-serif">
                  "{t.review}"
                </p>
              </div>
              <div className="pt-4 border-t border-[#3A3027]">
                <h4 className="font-serif font-bold text-sm text-[#F5EFE5]">{t.name}</h4>
                <p className="text-[11px] text-[#D29A55] font-sans font-semibold">{t.role}</p>
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
