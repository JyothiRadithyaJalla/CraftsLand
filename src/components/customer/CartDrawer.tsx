import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Utensils, Truck, Store } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    items,
    orderType,
    setOrderType,
    tableNumber,
    removeItem,
    updateQuantity,
    clearCart,
    tipPercent,
    setTipPercent,
    subtotal,
    taxAmount,
    deliveryFee,
    totalAmount,
  } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#0B0C10]/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel bg-[#0B0C10] border-l border-[#D4AF37]/20 flex flex-col justify-between text-[#F4F1EA]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-xl font-bold text-gold-gradient">Your Culinary Order</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Indicator Badge if Table Param is set */}
          {tableNumber && (
            <div className="bg-[#D4AF37]/15 border-b border-[#D4AF37]/30 px-6 py-2 flex items-center justify-between text-xs text-[#D4AF37]">
              <span className="font-semibold flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5" /> Dine-In Order</span>
              <span className="font-mono font-bold bg-[#D4AF37] text-[#0B0C10] px-2 py-0.5 rounded">Table {tableNumber}</span>
            </div>
          )}

          {/* Order Type Selector */}
          <div className="px-6 py-3 border-b border-white/10 grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setOrderType('DINE_IN')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                orderType === 'DINE_IN' ? 'bg-[#D4AF37] text-[#0B0C10] font-bold border-[#D4AF37]' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Dine-In
            </button>
            <button
              onClick={() => setOrderType('PICKUP')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                orderType === 'PICKUP' ? 'bg-[#D4AF37] text-[#0B0C10] font-bold border-[#D4AF37]' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Pickup
            </button>
            <button
              onClick={() => setOrderType('DELIVERY')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                orderType === 'DELIVERY' ? 'bg-[#D4AF37] text-[#0B0C10] font-bold border-[#D4AF37]' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Delivery
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
                <p className="text-gray-400 text-sm font-serif">Your dining cart is currently empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.dish.id} className="glass-card p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#F4F1EA]">{item.dish.name}</h4>
                      <p className="text-xs text-[#D4AF37] font-mono">${item.dish.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.dish.id)} className="text-gray-500 hover:text-red-400 p-1 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modifiers List */}
                  {item.selectedModifiers.length > 0 && (
                    <div className="text-[11px] text-gray-400 space-y-0.5 pt-1 border-t border-white/5">
                      {item.selectedModifiers.map((m, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• {m.optionName}</span>
                          {m.price > 0 && <span className="font-mono text-[#D4AF37]">+${m.price.toFixed(2)}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity & Subtotal */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#12141C] text-xs">
                      <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="px-2 py-1 text-gray-400 hover:text-white cursor-pointer">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono font-bold text-[#D4AF37]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} className="px-2 py-1 text-gray-400 hover:text-white cursor-pointer">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#F4F1EA]">${item.itemSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#D4AF37]/20 space-y-4 bg-[#12141C]/80">
              {/* Tip Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-gray-400">Add Concierge Gratuity:</span>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[10, 15, 18, 20].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => setTipPercent(percent)}
                      className={`py-1 rounded border text-[11px] font-mono cursor-pointer ${
                        tipPercent === percent ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-gray-400'
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-400"><span>Tax (8.5%):</span><span>${taxAmount.toFixed(2)}</span></div>
                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between text-gray-400"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between font-serif text-sm font-bold text-[#F4F1EA] pt-2 border-t border-white/10">
                  <span>Total Amount:</span>
                  <span className="text-gold-gradient">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={clearCart} className="px-3 py-3 rounded-full border border-white/10 text-gray-400 hover:text-white text-xs cursor-pointer">
                  Clear
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
