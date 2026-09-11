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
        <div className="rounded-2xl overflow-hidden border border-[#3A3027] shadow-md">
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
              <span className="text-xs uppercase font-sans tracking-widest text-[#B84A32] font-bold block">
                {dish.categorySlug}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#F5EFE5]">{dish.name}</h2>
            </div>
            <div className="text-right">
              <span className="font-serif text-2xl font-bold text-[#B84A32]">${unitPrice.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-[#B8AEA1] text-sm leading-relaxed font-sans">{dish.description}</p>
        </div>

        {/* Nutritional & Pairing Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#B8AEA1]">
          {dish.calories && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171310] border border-[#3A3027] text-[#B8AEA1]">
              <Flame className="w-3.5 h-3.5 text-[#D29A55]" />
              <span>{dish.calories} kcal</span>
            </div>
          )}
          {dish.winePairing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B84A32]/15 border border-[#B84A32]/30 text-[#D29A55]">
              <Wine className="w-3.5 h-3.5 text-[#B84A32]" />
              <span>Pairing: {dish.winePairing}</span>
            </div>
          )}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-900/50 text-red-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Allergens: {dish.allergens.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Customization Modifiers */}
        {dish.modifiers && dish.modifiers.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#3A3027]">
            <h4 className="font-serif text-sm font-semibold text-[#F5EFE5] tracking-wider uppercase">
              Artisanal Additions
            </h4>
            {dish.modifiers.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-xs text-[#B8AEA1] font-medium">
                  {mod.title} {mod.required && <span className="text-[#B84A32]">*</span>}
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
                            ? 'border-[#B84A32] bg-[#B84A32]/15 text-[#F5EFE5] font-semibold'
                            : 'border-[#3A3027] bg-[#171310] text-[#B8AEA1] hover:border-[#B84A32]/40 hover:text-[#F5EFE5]'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[#B84A32] font-mono font-bold">
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
        <div className="pt-6 border-t border-[#3A3027] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#171310] p-1.5 rounded-full border border-[#3A3027]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#B8AEA1] hover:text-[#F5EFE5] hover:bg-[#211B16] transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-serif font-bold text-sm px-2 text-[#F5EFE5]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#B8AEA1] hover:text-[#F5EFE5] hover:bg-[#211B16] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            disabled={!dish.isAvailable}
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
          >
            Add To Order • ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </Modal>
  );
};
