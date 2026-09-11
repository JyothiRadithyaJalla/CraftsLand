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
        return { label: 'Signature', class: 'bg-[#B84A32]/20 text-[#D29A55] border-[#D29A55]/40' };
      case 'CHEFS_CHOICE':
        return { label: "Chef's Pick", class: 'bg-[#D29A55]/15 text-[#D29A55] border-[#D29A55]/40' };
      case 'VEGETARIAN':
        return { label: 'Vegetarian', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'VEGAN':
        return { label: 'Vegan', class: 'bg-green-500/15 text-green-400 border-green-500/30' };
      case 'SPICY':
        return { label: 'Spicy', class: 'bg-red-500/15 text-red-400 border-red-500/30' };
      default:
        return { label: tag.replace('_', ' '), class: 'bg-[#171310] text-[#B8AEA1] border-[#3A3027]' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-[#211B16] rounded-2xl border border-[#3A3027] overflow-hidden hover:border-[#B84A32]/50 hover:shadow-[0_8px_30px_rgba(184,74,50,0.12)] transition-all duration-500 flex flex-col justify-between"
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
        <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-[#171310]/90 backdrop-blur-md text-[#B84A32] font-serif font-bold text-xs border border-[#3A3027] shadow-md">
          ${dish.price.toFixed(2)}
        </div>

        {/* Sold Out Overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-[#171310] text-[#B8AEA1] border border-[#3A3027] text-xs font-bold uppercase tracking-widest">
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
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#211B16]">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-sans tracking-widest text-[#B84A32] font-bold block">
            {dish.categorySlug}
          </span>
          <h3 className="font-serif text-lg font-bold text-[#F5EFE5] group-hover:text-[#B84A32] transition-colors line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-[#B8AEA1] text-xs leading-relaxed line-clamp-2 font-sans">
            {dish.description}
          </p>
        </div>

        {/* Action Controls: Quick View + Add to Bag */}
        <div className="pt-3 border-t border-[#3A3027] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onQuickView(dish)}
            className="flex-1 py-2 rounded-xl bg-[#171310] hover:bg-[#0D0B09] text-[#F5EFE5] hover:text-[#B84A32] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#3A3027] transition-colors cursor-pointer"
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
                ? 'bg-[#B84A32] hover:bg-[#8B3525] text-white shadow-sm hover:shadow-md'
                : 'bg-[#171310] text-[#B8AEA1]/40 border border-[#3A3027] cursor-not-allowed'
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
