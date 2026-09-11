import React from 'react';
import { useCart } from '@shared/hooks/useCart';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { EmptyState } from '@shared/components/EmptyState';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotal, taxAmount, deliveryFee, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <MetaTags title="Cart | Craftsland" />
        <EmptyState
          title="Your Cart is Empty"
          description="You have not added any dishes from our reserve menu to your current dining order."
          icon={<ShoppingBag className="w-7 h-7 text-[#B84A32]" />}
          action={
            <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B84A32] to-[#8B3525] hover:from-[#C85A3A] hover:to-[#B84A32] text-[#F5EFE5] font-semibold text-xs uppercase tracking-wider shadow-md transition-all">
              Explore Haute Menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <MetaTags title="Your Selection | Craftsland" />
      <h1 className="font-serif text-3xl font-bold text-[#F5EFE5]">Your Culinary Selection</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.dish.id} className="bg-[#211B16] p-4 rounded-xl flex items-center justify-between gap-4 border border-[#3A3027] shadow-md">
            <img src={item.dish.mediaUrl} alt={item.dish.name} className="w-16 h-16 rounded-lg object-cover border border-[#3A3027]" />
            <div className="flex-1">
              <h3 className="font-serif font-bold text-[#F5EFE5] text-sm">{item.dish.name}</h3>
              <p className="text-xs text-[#B84A32] font-semibold">${item.dish.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#3A3027] bg-[#171310] rounded-lg overflow-hidden text-xs">
                <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="px-2.5 py-1 text-[#B8AEA1] hover:text-[#F5EFE5] hover:bg-[#211B16] transition-colors">-</button>
                <span className="px-3 font-mono font-bold text-[#F5EFE5]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} className="px-2.5 py-1 text-[#B8AEA1] hover:text-[#F5EFE5] hover:bg-[#211B16] transition-colors">+</button>
              </div>
              <button onClick={() => removeItem(item.dish.id)} className="text-[#B8AEA1]/60 hover:text-red-400 p-1 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-[#211B16] p-6 rounded-xl space-y-3 max-w-md ml-auto border border-[#3A3027] shadow-xl">
        <div className="flex justify-between text-xs text-[#B8AEA1]"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-[#B8AEA1]"><span>Estimated Tax:</span><span>${taxAmount.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-[#B8AEA1]"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm font-bold text-[#F5EFE5] pt-2 border-t border-[#3A3027]"><span>Total:</span><span className="text-[#F5EFE5] font-mono">${totalAmount.toFixed(2)}</span></div>
        <Link to="/checkout" className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#B84A32] to-[#8B3525] hover:from-[#C85A3A] hover:to-[#B84A32] text-[#F5EFE5] font-bold text-xs uppercase tracking-widest shadow-md transition-all">
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
