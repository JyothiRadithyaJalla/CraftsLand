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
        <div className="relative rounded-2xl overflow-hidden border border-[#E2E8E0] shadow-sm -mx-2">
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
              <span className="text-xs uppercase font-sans tracking-widest text-[#15803D] font-bold block mb-1">
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
                <h2 className="font-serif text-2xl font-bold text-[#111A15]">{dish.name}</h2>
              </div>
            </div>
            <div className="text-right">
              <span className="font-serif text-2xl font-bold text-[#15803D]">{formatPrice(unitPrice)}</span>
            </div>
          </div>
          <p className="text-[#37473D] text-sm leading-relaxed font-sans">{dish.description}</p>
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
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : tag === 'SIGNATURE'
                      ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/25'
                      : 'bg-[#FAF9F5] text-[#37473D] border-[#E2E8E0]'
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
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#37473D]">
          {dish.calories && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E2E8E0] text-[#37473D]">
              <Flame className="w-3.5 h-3.5 text-[#15803D]" />
              <span>{dish.calories} kcal</span>
            </div>
          )}
          {dish.winePairing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D]/10 border border-[#15803D]/20 text-[#15803D] font-semibold">
              <Wine className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Pairing: {dish.winePairing}</span>
            </div>
          )}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>Allergens: {dish.allergens.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Customization Modifiers */}
        {dish.modifiers && dish.modifiers.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#E2E8E0]">
            <h4 className="font-serif text-sm font-semibold text-[#111A15] tracking-wider uppercase">
              Customizations
            </h4>
            {dish.modifiers.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-xs text-[#5C6E63] font-medium">
                  {mod.title} {mod.required && <span className="text-[#15803D] font-bold">*</span>}
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
                            ? 'border-[#15803D] bg-[#15803D]/10 text-[#111A15] font-semibold ring-1 ring-[#15803D]'
                            : 'border-[#E2E8E0] bg-[#FAF9F5] text-[#37473D] hover:border-[#15803D]/40 hover:text-[#111A15]'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[#15803D] font-mono font-bold">
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
        <div className="pt-6 border-t border-[#E2E8E0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#FAF9F5] p-1.5 rounded-full border border-[#E2E8E0]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C6E63] hover:text-[#111A15] hover:bg-white transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-serif font-bold text-sm px-2 text-[#111A15]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C6E63] hover:text-[#111A15] hover:bg-white transition-colors cursor-pointer"
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
                ? 'bg-[#15803D] hover:bg-[#166534] text-white border-[#166534]'
                : 'bg-[#FAF9F5] text-[#A8A29E] border-[#E2E8E0] cursor-not-allowed'
            }`}
          >
            {dish.isAvailable ? `Add To Order • ${formatPrice(totalPrice)}` : 'Currently Unavailable'}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};
