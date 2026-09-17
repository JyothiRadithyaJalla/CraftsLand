import React from 'react';
import { useCart } from '@shared/hooks/useCart';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { EmptyState } from '@shared/components/EmptyState';
import { RESTAURANT_BRAND } from '@shared/config/constants';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotal, taxAmount, deliveryFee, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <MetaTags title="Cart | Craftsland" />
        <EmptyState
          title="Your Cart is Empty"
          description="You have not added any dishes from our menu to your current dining order."
          icon={<ShoppingBag className="w-7 h-7 text-[#31543A]" />}
          action={
            <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#31543A] hover:bg-[#26432E] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors">
              Explore Fresh Menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <MetaTags title="Your Selection | Craftsland" />
      <h1 className="font-serif text-3xl font-bold text-[#182019]">Your Fresh Selection</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.dish.id} className="bg-white p-4 rounded-2xl flex items-center justify-between gap-4 border border-[#DDD9CB] shadow-xs">
            <img src={item.dish.mediaUrl} alt={item.dish.name} className="w-16 h-16 rounded-xl object-cover border border-[#DDD9CB]" />
            <div className="flex-1">
              <h3 className="font-serif font-bold text-[#182019] text-sm">{item.dish.name}</h3>
              <p className="text-xs text-[#31543A] font-bold">{RESTAURANT_BRAND.currencySymbol}{item.dish.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#DDD9CB] bg-[#FAF8F3] rounded-xl overflow-hidden text-xs">
                <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="px-3 py-1.5 text-[#626F64] hover:text-[#182019] hover:bg-[#31543A]/10 transition-colors cursor-pointer">-</button>
                <span className="px-3 font-mono font-bold text-[#182019]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} className="px-3 py-1.5 text-[#626F64] hover:text-[#182019] hover:bg-[#31543A]/10 transition-colors cursor-pointer">+</button>
              </div>
              <button onClick={() => removeItem(item.dish.id)} className="text-[#626F64] hover:text-[#A8382B] p-1.5 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-2xl space-y-3 max-w-md ml-auto border border-[#DDD9CB] shadow-sm">
        <div className="flex justify-between text-xs text-[#626F64]"><span>Subtotal:</span><span className="text-[#182019] font-semibold">{RESTAURANT_BRAND.currencySymbol}{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-[#626F64]"><span>Estimated Tax:</span><span className="text-[#182019] font-semibold">{RESTAURANT_BRAND.currencySymbol}{taxAmount.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-[#626F64]"><span>Delivery Fee:</span><span className="text-[#182019] font-semibold">{RESTAURANT_BRAND.currencySymbol}{deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm font-bold text-[#182019] pt-3 border-t border-[#DDD9CB]"><span>Total:</span><span className="text-[#31543A] font-mono text-base">{RESTAURANT_BRAND.currencySymbol}{totalAmount.toFixed(2)}</span></div>
        <Link to="/checkout" className="w-full mt-4 min-h-[48px] inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#31543A] hover:bg-[#26432E] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer">
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
