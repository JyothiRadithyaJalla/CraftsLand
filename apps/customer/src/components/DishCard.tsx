import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Sparkles } from 'lucide-react';
import type { Dish } from '@shared/types/menu';
import { useCart } from '@shared/hooks/useCart';

interface DishCardProps {
  dish: Dish;
  onQuickView: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onQuickView }) => {
  const { addItem } = useCart();

  const getDietaryBadgeColor = (tag: string) => {
    switch (tag) {
      case 'CHEFS_CHOICE': return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40';
      case 'VEGAN': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'VEGETARIAN': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'GLUTEN_FREE': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-white/10 text-gray-300 border-white/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group glass-card rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-500 flex flex-col justify-between"
    >
      {/* Image Container with Hover Scale */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#12141C]">
        <img
          src={dish.mediaUrl}
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-transparent opacity-80" />

        {/* Price Tag */}
        <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-[#0B0C10]/85 backdrop-blur-md text-[#D4AF37] font-serif font-bold text-xs border border-[#D4AF37]/30 shadow-lg">
          ${dish.price.toFixed(2)}
        </div>

        {/* Sold Out Overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-[#0B0C10]/90 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}

        {/* Dietary Tags Overlay */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
          {dish.dietaryTags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border backdrop-blur-md ${getDietaryBadgeColor(tag)}`}
            >
              {tag === 'CHEFS_CHOICE' && <Sparkles className="inline w-2.5 h-2.5 mr-1" />}
              {tag.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#F4F1EA] group-hover:text-[#D4AF37] transition-colors leading-snug">
            {dish.name}
          </h3>
          <p className="text-gray-400 text-xs font-sans leading-relaxed line-clamp-2 mt-2">
            {dish.description}
          </p>
        </div>

        {/* Wine Pairing & Action Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          {dish.winePairing ? (
            <span className="text-[10px] text-[#D4AF37] font-mono tracking-wider truncate max-w-[55%]">
              🍷 {dish.winePairing}
            </span>
          ) : (
            <span className="text-[10px] text-gray-500 font-mono tracking-wider">
              Haute Reserve
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onQuickView(dish)}
              className="p-2 rounded-full text-gray-300 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
              title="Quick Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              disabled={!dish.isAvailable}
              onClick={() => addItem(dish)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                dish.isAvailable
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] hover:opacity-90 shadow-md'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
