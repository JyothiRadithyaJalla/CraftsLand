import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Utensils, Truck, Store } from 'lucide-react';
import { useCart } from '@shared/hooks/useCart';

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#211B16] border-l border-[#3A3027] flex flex-col justify-between text-[#F5EFE5] shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-[#3A3027] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B84A32]" />
              <h2 className="font-serif text-xl font-bold text-[#F5EFE5]">Your Craftsland Order</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Indicator Badge if Table Param is set */}
          {tableNumber && (
            <div className="bg-[#B84A32]/10 border-b border-[#B84A32]/20 px-6 py-2 flex items-center justify-between text-xs text-[#B84A32]">
              <span className="font-semibold flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5" /> Dine-In Order</span>
              <span className="font-mono font-bold bg-[#B84A32] text-white px-2 py-0.5 rounded">Table {tableNumber}</span>
            </div>
          )}

          {/* Order Type Selector */}
          <div className="px-6 py-3 border-b border-[#3A3027] grid grid-cols-3 gap-2 text-xs bg-[#171310]">
            <button
              onClick={() => setOrderType('DINE_IN')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                orderType === 'DINE_IN' ? 'bg-[#B84A32] text-white font-bold border-[#B84A32]' : 'bg-[#211B16] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Dine-In
            </button>
            <button
              onClick={() => setOrderType('PICKUP')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                orderType === 'PICKUP' ? 'bg-[#B84A32] text-white font-bold border-[#B84A32]' : 'bg-[#211B16] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Pickup
            </button>
            <button
              onClick={() => setOrderType('DELIVERY')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                orderType === 'DELIVERY' ? 'bg-[#B84A32] text-white font-bold border-[#B84A32]' : 'bg-[#211B16] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Delivery
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#B84A32]/30 mx-auto" />
                <p className="text-[#B8AEA1] text-sm font-serif">Your dining cart is currently empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.dish.id} className="bg-[#171310] border border-[#3A3027] p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#F5EFE5]">{item.dish.name}</h4>
                      <p className="text-xs text-[#B84A32] font-mono font-bold">${item.dish.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.dish.id)} className="text-[#B8AEA1] hover:text-red-400 p-1 cursor-pointer transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modifiers List */}
                  {item.selectedModifiers.length > 0 && (
                    <div className="text-[11px] text-[#B8AEA1] space-y-0.5 pt-1 border-t border-[#3A3027]">
                      {item.selectedModifiers.map((m, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• {m.optionName}</span>
                          {m.price > 0 && <span className="font-mono text-[#B84A32]">+${m.price.toFixed(2)}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity & Subtotal */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#3A3027] rounded-lg overflow-hidden bg-[#211B16] text-xs">
                      <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="px-2 py-1 text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono font-bold text-[#B84A32]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} className="px-2 py-1 text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#F5EFE5]">${item.itemSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#3A3027] space-y-4 bg-[#171310]">
              {/* Tip Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#B8AEA1]">Add Concierge Gratuity:</span>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[10, 15, 18, 20].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => setTipPercent(percent)}
                      className={`py-1 rounded border text-[11px] font-mono cursor-pointer transition-colors ${
                        tipPercent === percent ? 'bg-[#B84A32] border-[#B84A32] text-white font-bold' : 'border-[#3A3027] bg-[#211B16] text-[#B8AEA1] hover:text-[#F5EFE5]'
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#B8AEA1]"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[#B8AEA1]"><span>Tax (8.5%):</span><span>${taxAmount.toFixed(2)}</span></div>
                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between text-[#B8AEA1]"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between font-serif text-sm font-bold text-[#F5EFE5] pt-2 border-t border-[#3A3027]">
                  <span>Total Amount:</span>
                  <span className="text-[#B84A32] font-mono font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={clearCart} className="px-3 py-3 rounded-full border border-[#3A3027] bg-[#211B16] text-[#B8AEA1] hover:text-[#F5EFE5] text-xs cursor-pointer transition-colors">
                  Clear
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
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
