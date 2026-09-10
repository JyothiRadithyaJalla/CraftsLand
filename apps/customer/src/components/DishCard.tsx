import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye } from 'lucide-react';
import type { Dish } from '@shared/types/menu';
import { useCart } from '@shared/hooks/useCart';
import { MediaView } from '@shared/components/MediaView';

interface DishCardProps {
  dish: Dish;
  onQuickView: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onQuickView }) => {
  const { addItem } = useCart();

  const getDietaryBadge = (tag: string) => {
    switch (tag) {
      case 'SIGNATURE':
        return { label: 'Signature', class: 'bg-[#D4AF37]/25 text-[#D4AF37] border-[#D4AF37]/50' };
      case 'CHEFS_CHOICE':
        return { label: "Chef's Pick", class: 'bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/40' };
      case 'VEGETARIAN':
        return { label: 'Vegetarian', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'VEGAN':
        return { label: 'Vegan', class: 'bg-green-500/20 text-green-300 border-green-500/30' };
      case 'SPICY':
        return { label: 'Spicy', class: 'bg-red-500/20 text-red-300 border-red-500/30' };
      default:
        return { label: tag.replace('_', ' '), class: 'bg-white/10 text-gray-300 border-white/20' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group glass-card rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] transition-all duration-500 flex flex-col justify-between"
    >
      {/* Media with Video/Hover Zoom & Clickable Lightbox */}
      <div className="relative overflow-hidden">
        <MediaView
          mediaUrl={dish.mediaUrl}
          posterUrl={dish.posterUrl}
          videoUrl={dish.videoUrl}
          alt={dish.name}
          aspectRatio="aspect-[4/3]"
          autoPlayOnHover={true}
          clickable={true}
          onImageClick={() => onQuickView(dish)}
        />

        {/* Price Tag */}
        <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-[#0B0C10]/85 backdrop-blur-md text-[#D4AF37] font-serif font-bold text-xs border border-[#D4AF37]/35 shadow-lg">
          ${dish.price.toFixed(2)}
        </div>

        {/* Sold Out Overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 z-30 bg-[#0B0C10]/90 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}

        {/* Dietary Tags Overlay */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-1.5 max-w-[80%]">
          {dish.dietaryTags.slice(0, 2).map((tag) => {
            const badge = getDietaryBadge(tag);
            return (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold border backdrop-blur-md ${badge.class}`}
              >
                {badge.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Dish Content Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-sans tracking-widest text-[#D4AF37]/80 font-bold block">
            {dish.categorySlug}
          </span>
          <h3 className="font-serif text-lg font-bold text-[#F4F1EA] group-hover:text-gold-gradient transition-colors line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 font-sans">
            {dish.description}
          </p>
        </div>

        {/* Action Controls: Quick View + Add to Bag */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onQuickView(dish)}
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#D4AF37] text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            type="button"
            disabled={!dish.isAvailable}
            onClick={() => {
              addItem(dish, 1, []);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              dish.isAvailable
                ? 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0C10] shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
            title="Add to order"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Order</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
