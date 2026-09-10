import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MenuService } from '@shared/services/menuService';
import type { Dish } from '@shared/types/menu';
import type { SelectedModifierOption } from '@shared/types/order';
import { useCart } from '@shared/hooks/useCart';
import { MetaTags } from '@shared/components/MetaTags';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
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
        <h2 className="font-serif text-2xl font-bold text-gold-gradient">Dish Not Found</h2>
        <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold text-xs uppercase">
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
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <MetaTags title={`${dish.name} | L'Étoile Noir`} />

      <Link to="/menu" className="inline-flex items-center gap-2 text-xs text-[#D4AF37] hover:underline font-mono uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back to Haute Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Media */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-[#D4AF37]/30 shadow-2xl">
          <img src={dish.mediaUrl} alt={dish.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-[#0B0C10]/90 text-[#D4AF37] font-serif font-bold text-base border border-[#D4AF37]/30 shadow-lg">
            ${unitPrice.toFixed(2)}
          </div>
        </div>

        {/* Info & Modifiers */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold-gradient">{dish.name}</h1>
            <p className="text-gray-300 text-sm leading-relaxed font-sans">{dish.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 py-3 border-y border-white/10">
            {dish.calories && (
              <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                <Flame className="w-4 h-4" /> {dish.calories} calories
              </span>
            )}
            {dish.winePairing && (
              <span className="flex items-center gap-1.5 text-[#D4AF37] font-mono">
                <Wine className="w-4 h-4" /> Pairing: {dish.winePairing}
              </span>
            )}
            {dish.allergens.length > 0 && (
              <span className="flex items-center gap-1.5 text-red-300 font-mono">
                <ShieldAlert className="w-4 h-4" /> Allergens: {dish.allergens.join(', ')}
              </span>
            )}
          </div>

          {/* Modifiers Selection */}
          {dish.modifiers && dish.modifiers.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
                Custom Preparation Options
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
                          className={`p-3 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
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

          {/* Add to Cart Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center border border-[#D4AF37]/30 rounded-full overflow-hidden bg-[#12141C]">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-gray-400 hover:text-white cursor-pointer">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-mono font-bold text-sm text-[#D4AF37]">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2.5 text-gray-400 hover:text-white cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full sm:flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Order • ${totalPrice.toFixed(2)}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
