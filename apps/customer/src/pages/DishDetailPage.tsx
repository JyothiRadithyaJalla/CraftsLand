import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MenuService } from '@shared/services/menuService';
import type { Dish } from '@shared/types/menu';
import type { SelectedModifierOption } from '@shared/types/order';
import { useCart } from '@shared/hooks/useCart';
import { MetaTags } from '@shared/components/MetaTags';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { formatPrice } from '@shared/utils/formatters';
import { ArrowLeft, Plus, Minus, Flame, Wine, ShieldAlert, ShoppingBag } from 'lucide-react';

export const DishDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifierOption[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      MenuService.getDishById(id).then((data) => {
        setDish(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner label="Fetching Dish Specifications..." />;
  }

  if (!dish) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#111A15]">Dish Not Found</h2>
        <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors">
          Return to Menu
        </Link>
      </div>
    );
  }

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
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-[#111A15]">
      <MetaTags title={`${dish.name} | Craftsland`} />

      <Link to="/menu" className="inline-flex items-center gap-2 text-xs text-[#15803D] hover:underline font-mono uppercase tracking-widest font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Media */}
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#E2E8E0] shadow-sm">
          <img src={dish.mediaUrl} alt={dish.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-white/95 text-[#15803D] font-mono font-bold text-base border border-[#E2E8E0] shadow-sm">
            {formatPrice(unitPrice)}
          </div>
        </div>

        {/* Info & Modifiers */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111A15]">{dish.name}</h1>
            <p className="text-[#37473D] text-sm leading-relaxed font-sans">{dish.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-[#5C6E63] py-3 border-y border-[#E2E8E0]">
            {dish.calories && (
              <span className="flex items-center gap-1.5 text-[#15803D] font-mono font-semibold">
                <Flame className="w-4 h-4" /> {dish.calories} calories
              </span>
            )}
            {dish.winePairing && (
              <span className="flex items-center gap-1.5 text-[#15803D] font-mono font-semibold">
                <Wine className="w-4 h-4" /> Pairing: {dish.winePairing}
              </span>
            )}
            {dish.allergens.length > 0 && (
              <span className="flex items-center gap-1.5 text-rose-700 font-mono">
                <ShieldAlert className="w-4 h-4" /> Allergens: {dish.allergens.join(', ')}
              </span>
            )}
          </div>

          {/* Modifiers Selection */}
          {dish.modifiers && dish.modifiers.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="font-serif text-sm font-bold text-[#111A15] uppercase tracking-wider">
                Custom Preparation Options
              </h4>
              {dish.modifiers.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#111A15]">
                    <span>{mod.title}</span>
                    {mod.required && <span className="text-[10px] text-[#15803D] uppercase font-mono font-bold">(Required)</span>}
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
                          className={`p-3 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#F1F7F2] border-[#15803D] text-[#111A15] font-semibold ring-1 ring-[#15803D]'
                              : 'bg-white border-[#E2E8E0] text-[#5C6E63] hover:border-[#15803D]/40 hover:text-[#111A15]'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {opt.price > 0 && <span className="font-mono text-[#15803D] font-bold">+{formatPrice(opt.price)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="pt-6 border-t border-[#E2E8E0] flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center border border-[#E2E8E0] rounded-xl overflow-hidden bg-white shadow-xs">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-[#5C6E63] hover:text-[#111A15] hover:bg-[#FAF9F5] cursor-pointer transition-colors" aria-label="Decrease quantity">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-mono font-bold text-sm text-[#111A15]">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2.5 text-[#5C6E63] hover:text-[#111A15] hover:bg-[#FAF9F5] cursor-pointer transition-colors" aria-label="Increase quantity">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full sm:flex-1 min-h-[48px] py-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Order • {formatPrice(totalPrice)}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
