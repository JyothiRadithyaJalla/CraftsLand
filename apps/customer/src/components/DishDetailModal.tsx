import React, { useState } from 'react';
import { Modal } from '@shared/components/Modal';
import type { Dish } from '@shared/types/menu';
import type { SelectedModifierOption } from '@shared/types/order';
import { useCart } from '@shared/hooks/useCart';
import { Plus, Minus, Flame, Wine, ShieldAlert } from 'lucide-react';
import { MediaView } from '@shared/components/MediaView';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dish.name}>
      <div className="space-y-6">
        {/* Media / Video View */}
        <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-xl">
          <MediaView
            mediaUrl={dish.mediaUrl}
            posterUrl={dish.posterUrl}
            videoUrl={dish.videoUrl}
            alt={dish.name}
            aspectRatio="aspect-[16/9]"
            autoPlayOnHover={true}
            priority={true}
          />
        </div>

        {/* Details Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block">
                {dish.categorySlug}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#F4F1EA]">{dish.name}</h2>
            </div>
            <div className="text-right">
              <span className="font-serif text-2xl font-bold text-[#D4AF37]">${unitPrice.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">{dish.description}</p>
        </div>

        {/* Nutritional & Pairing Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-400">
          {dish.calories && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{dish.calories} kcal</span>
            </div>
          )}
          {dish.winePairing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Wine className="w-3.5 h-3.5" />
              <span>Pairing: {dish.winePairing}</span>
            </div>
          )}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Allergens: {dish.allergens.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Customization Modifiers */}
        {dish.modifiers && dish.modifiers.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="font-serif text-sm font-semibold text-[#D4AF37] tracking-wider uppercase">
              Artisanal Additions
            </h4>
            {dish.modifiers.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-xs text-gray-300 font-medium">
                  {mod.title} {mod.required && <span className="text-amber-400">*</span>}
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
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white font-semibold'
                            : 'border-white/10 bg-[#12141C] text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[#D4AF37] font-serif">
                          {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quantity & Add to Cart Footer */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#12141C] p-1.5 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-serif font-bold text-sm px-2 text-[#F4F1EA]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            disabled={!dish.isAvailable}
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0C10] font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
          >
            Add To Order • ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </Modal>
  );
};
