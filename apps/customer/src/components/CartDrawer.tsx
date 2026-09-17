import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Utensils, Truck, Store } from 'lucide-react';
import { useCart } from '@shared/hooks/useCart';
import { RESTAURANT_BRAND } from '@shared/config/constants';

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

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E2E8E0] flex flex-col justify-between text-[#111A15] shadow-2xl pointer-events-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E2E8E0] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#15803D]" />
                  <h2 className="font-serif text-xl font-bold text-[#111A15]">Your Craftsland Order</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-stone-400 hover:text-[#111A15] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table Indicator Badge if Table Param is set */}
              {tableNumber && (
                <div className="bg-[#15803D]/10 border-b border-[#15803D]/20 px-6 py-2 flex items-center justify-between text-xs text-[#15803D]">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" /> Dine-In Order
                  </span>
                  <span className="font-mono font-bold bg-[#15803D] text-white px-2 py-0.5 rounded">
                    Table {tableNumber}
                  </span>
                </div>
              )}

              {/* Order Type Selector */}
              <div className="px-6 py-3 border-b border-[#E2E8E0] grid grid-cols-3 gap-2 text-xs bg-white">
                <button
                  onClick={() => setOrderType('DINE_IN')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer font-bold ${
                    orderType === 'DINE_IN'
                      ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E2E8E0] text-[#37473D] hover:text-[#111A15]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" /> Dine-In
                </button>
                <button
                  onClick={() => setOrderType('PICKUP')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer font-bold ${
                    orderType === 'PICKUP'
                      ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E2E8E0] text-[#37473D] hover:text-[#111A15]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" /> Pickup
                </button>
                <button
                  onClick={() => setOrderType('DELIVERY')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer font-bold ${
                    orderType === 'DELIVERY'
                      ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E2E8E0] text-[#37473D] hover:text-[#111A15]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> Delivery
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[#15803D]/30 mx-auto" />
                    <p className="text-[#5C6E63] text-sm font-serif">Your dining cart is currently empty.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.dish.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-[#E2E8E0] p-4 rounded-2xl space-y-2 shadow-xs"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#111A15]">{item.dish.name}</h4>
                            <p className="text-xs text-[#15803D] font-mono font-bold">
                              {RESTAURANT_BRAND.currencySymbol}
                              {item.dish.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.dish.id)}
                            className="text-stone-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Modifiers List */}
                        {item.selectedModifiers.length > 0 && (
                          <div className="text-[11px] text-[#5C6E63] space-y-0.5 pt-1 border-t border-[#E2E8E0]">
                            {item.selectedModifiers.map((m, idx) => (
                              <div key={idx} className="flex justify-between font-mono">
                                <span>• {m.optionName}</span>
                                {m.price > 0 && (
                                  <span className="text-[#15803D] font-bold">
                                    +{RESTAURANT_BRAND.currencySymbol}
                                    {m.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quantity & Subtotal */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#E2E8E0] rounded-xl overflow-hidden bg-[#FAF9F5] text-xs">
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-[#5C6E63] hover:text-[#111A15] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 font-mono font-bold text-[#15803D]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-[#5C6E63] hover:text-[#111A15] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#111A15]">
                            {RESTAURANT_BRAND.currencySymbol}
                            {item.itemSubtotal.toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer Summary & Actions */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#E2E8E0] space-y-4 bg-white shadow-lg">
                  {/* Tip Selector */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#5C6E63] font-medium">Add Concierge Gratuity:</span>
                    <div className="grid grid-cols-4 gap-1.5 text-xs">
                      {[10, 15, 18, 20].map((percent) => (
                        <button
                          key={percent}
                          onClick={() => setTipPercent(percent)}
                          className={`py-1.5 rounded-xl border text-[11px] font-mono cursor-pointer transition-colors font-bold ${
                            tipPercent === percent
                              ? 'bg-[#15803D] border-[#15803D] text-white shadow-xs'
                              : 'border-[#E2E8E0] bg-[#FAF9F5] text-[#37473D] hover:text-[#111A15]'
                          }`}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#37473D]">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold">
                        {RESTAURANT_BRAND.currencySymbol}
                        {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#37473D]">
                      <span>Tax (8.5%):</span>
                      <span className="font-mono font-semibold">
                        {RESTAURANT_BRAND.currencySymbol}
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                    {orderType === 'DELIVERY' && (
                      <div className="flex justify-between text-[#37473D]">
                        <span>Delivery Fee:</span>
                        <span className="font-mono font-semibold">
                          {RESTAURANT_BRAND.currencySymbol}
                          {deliveryFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-serif text-sm font-bold text-[#111A15] pt-2 border-t border-[#E2E8E0]">
                      <span>Total Amount:</span>
                      <span className="text-[#15803D] font-mono font-bold text-base">
                        {RESTAURANT_BRAND.currencySymbol}
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="px-4 py-3 rounded-xl border border-[#E2E8E0] bg-[#FAF9F5] text-[#37473D] hover:bg-stone-100 text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Clear
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={handleCheckout}
                      className="flex-1 py-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all min-h-[48px]"
                    >
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
