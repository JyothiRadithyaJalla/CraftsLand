import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@shared/components/Modal';
import type { Dish } from '@shared/types/menu';
import type { SelectedModifierOption } from '@shared/types/order';
import { useCart } from '@shared/hooks/useCart';
import { Plus, Minus, Flame, Wine, ShieldAlert, Leaf } from 'lucide-react';
import { PremiumAutoVideo } from '@shared/components/PremiumAutoVideo';
import { formatPrice } from '@shared/utils/formatters';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, isOpen, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifierOption[]>([]);

  if (!dish) return null;

  const handleModifierToggle = (modifierTitle: string, optionName: string, price: number, required: boolean) => {
    setSelectedModifiers((prev) => {
      const exists = prev.some((m) => m.modifierTitle === modifierTitle && m.optionName === optionName);
      if (exists) {
        return prev.filter((m) => !(m.modifierTitle === modifierTitle && m.optionName === optionName));
      }
      if (required) {
        const filtered = prev.filter((m) => m.modifierTitle !== modifierTitle);
        return [...filtered, { modifierTitle, optionName, price }];
      }
      return [...prev, { modifierTitle, optionName, price }];
    });
  };

  const extraModifiersPrice = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
  const unitPrice = dish.price + extraModifiersPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(dish, quantity, selectedModifiers);
    onClose();
  };

  const isVegetarian = dish.dietaryTags.some((t) => t === 'VEGETARIAN' || t === 'VEGAN');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dish.name} variant="customer">
      <div className="space-y-6">
        {/* Cinematic Video / Image — large and prominent */}
        <div className="relative rounded-2xl overflow-hidden border border-[#DDD9CB] shadow-sm -mx-2">
          <PremiumAutoVideo
            videoUrl={dish.videoUrl}
            posterUrl={dish.posterUrl || dish.mediaUrl}
            fallbackImageUrl={dish.mediaUrl}
            alt={dish.name}
            aspectRatio="aspect-[16/9]"
            priority={true}
          />
        </div>

        {/* Details Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-sans tracking-widest text-[#31543A] font-bold block mb-1">
                {dish.categorySlug}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center bg-white shadow-xs shrink-0 ${
                    isVegetarian ? 'border-emerald-600' : 'border-rose-700'
                  }`}
                  title={isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isVegetarian ? 'bg-emerald-600' : 'bg-rose-700'
                    }`}
                  />
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#182019]">{dish.name}</h2>
              </div>
            </div>
            <div className="text-right">
              <span className="font-serif text-2xl font-bold text-[#31543A]">{formatPrice(unitPrice)}</span>
            </div>
          </div>
          <p className="text-[#3A453C] text-sm leading-relaxed font-sans">{dish.description}</p>
        </div>

        {/* Dietary Tags */}
        {dish.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dish.dietaryTags.map((tag) => {
              const isVeg = tag === 'VEGETARIAN' || tag === 'VEGAN';
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                    isVeg
                      ? 'bg-[#E4ECE5] text-[#31543A] border-[#DDD9CB]'
                      : tag === 'SIGNATURE'
                      ? 'bg-[#C97852]/15 text-[#C97852] border-[#C97852]/30 font-bold'
                      : 'bg-[#F7F4EC] text-[#3A453C] border-[#DDD9CB]'
                  }`}
                >
                  {isVeg && <Leaf className="w-2.5 h-2.5" />}
                  {tag.replace('_', ' ')}
                </span>
              );
            })}
          </div>
        )}

        {/* Nutritional & Pairing Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#3A453C]">
          {dish.calories && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F4EC] border border-[#DDD9CB] text-[#3A453C]">
              <Flame className="w-3.5 h-3.5 text-[#C97852]" />
              <span>{dish.calories} kcal</span>
            </div>
          )}
          {dish.winePairing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#31543A]/10 border border-[#31543A]/20 text-[#31543A] font-semibold">
              <Wine className="w-3.5 h-3.5 text-[#31543A]" />
              <span>Pairing: {dish.winePairing}</span>
            </div>
          )}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEBE9] border border-[#DDD9CB] text-[#A8382B]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#A8382B]" />
              <span>Allergens: {dish.allergens.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Customization Modifiers */}
        {dish.modifiers && dish.modifiers.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#DDD9CB]">
            <h4 className="font-serif text-sm font-semibold text-[#182019] tracking-wider uppercase">
              Customizations
            </h4>
            {dish.modifiers.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-xs text-[#626F64] font-medium">
                  {mod.title} {mod.required && <span className="text-[#31543A] font-bold">*</span>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mod.options.map((opt) => {
                    const isSelected = selectedModifiers.some(
                      (m) => m.modifierTitle === mod.title && m.optionName === opt.name
                    );
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleModifierToggle(mod.title, opt.name, opt.price, mod.required)}
                        className={`p-3 rounded-xl border text-left text-xs flex justify-between items-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#31543A] bg-[#31543A]/10 text-[#182019] font-semibold ring-1 ring-[#31543A]'
                            : 'border-[#DDD9CB] bg-[#F7F4EC] text-[#3A453C] hover:border-[#31543A]/40 hover:text-[#182019]'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[#31543A] font-mono font-bold">
                          {opt.price > 0 ? `+${formatPrice(opt.price)}` : 'Included'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="pt-6 border-t border-[#DDD9CB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#F7F4EC] p-1.5 rounded-full border border-[#DDD9CB]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#626F64] hover:text-[#182019] hover:bg-white transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-serif font-bold text-sm px-2 text-[#182019]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#626F64] hover:text-[#182019] hover:bg-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={!dish.isAvailable}
            onClick={handleAddToCart}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-xs border cursor-pointer min-h-[44px] ${
              dish.isAvailable
                ? 'bg-[#31543A] hover:bg-[#26432E] text-white border-[#26432E]'
                : 'bg-[#F7F4EC] text-[#626F64] border-[#DDD9CB] cursor-not-allowed'
            }`}
          >
            {dish.isAvailable ? `Add To Order • ${formatPrice(totalPrice)}` : 'Currently Unavailable'}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};
