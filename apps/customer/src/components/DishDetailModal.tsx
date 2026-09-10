import React, { useState } from 'react';
import { Modal } from '@shared/components/Modal';
import type { Dish } from '@shared/types/menu';
import type { SelectedModifierOption } from '@shared/types/order';
import { useCart } from '@shared/hooks/useCart';
import { Plus, Minus, Flame, Wine, ShieldAlert } from 'lucide-react';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, isOpen, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifierOption[]>([]);

  if (!dish) return null;

  const handleModifierToggle = (modifierTitle: string, optionName: string, price: number, required: boolean) => {
    setSelectedModifiers((prev) => {
      const exists = prev.some((m) => m.modifierTitle === modifierTitle && m.optionName === optionName);
      if (exists) {
        return prev.filter((m) => !(m.modifierTitle === modifierTitle && m.optionName === optionName));
      }
      if (required) {
        // Replace single choice for required modifier
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
        {/* Media Container */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#12141C]">
          <img src={dish.mediaUrl} alt={dish.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-[#0B0C10]/90 text-[#D4AF37] font-serif font-bold text-sm border border-[#D4AF37]/30">
            ${unitPrice.toFixed(2)}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <p className="text-gray-300 text-sm leading-relaxed">{dish.description}</p>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t border-white/10">
            {dish.calories && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4" /> {dish.calories} kcal
              </span>
            )}
            {dish.winePairing && (
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Wine className="w-4 h-4" /> {dish.winePairing}
              </span>
            )}
            {dish.allergens.length > 0 && (
              <span className="flex items-center gap-1.5 text-red-300">
                <ShieldAlert className="w-4 h-4" /> Allergens: {dish.allergens.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Modifiers Selection */}
        {dish.modifiers && dish.modifiers.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Custom Preparation & Upgrades
            </h4>
            {dish.modifiers.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#F4F1EA]">
                  <span>{mod.title}</span>
                  {mod.required && <span className="text-[10px] text-amber-400 uppercase font-mono">(Required)</span>}
                </div>
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
                        className={`p-2.5 rounded-lg text-xs flex items-center justify-between border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <span>{opt.name}</span>
                        {opt.price > 0 && <span className="font-mono text-[#D4AF37]">+${opt.price.toFixed(2)}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quantity & Add Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center border border-[#D4AF37]/30 rounded-full overflow-hidden bg-[#12141C]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-mono font-bold text-sm text-[#D4AF37]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
          >
            Add to Order • ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </Modal>
  );
};
