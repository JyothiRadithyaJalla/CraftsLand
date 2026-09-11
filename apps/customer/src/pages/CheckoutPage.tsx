import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Utensils, Store, Truck, ArrowLeft, ArrowRight,
  CreditCard, Lock, MapPin, CheckCircle2, AlertCircle, Trash2, Plus, Minus
} from 'lucide-react';
import { useCart } from '@shared/hooks/useCart';
import { useOrders } from '@shared/hooks/useOrders';
import { useAuth } from '@shared/hooks/useAuth';
import { MetaTags } from '@shared/components/MetaTags';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { placeOrder, isPlacingOrder } = useOrders();
  const {
    items,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    deliveryAddress,
    setDeliveryAddress,
    specialInstructions,
    setSpecialInstructions,
    tipPercent,
    setTipPercent,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    taxAmount,
    deliveryFee,
    tipAmount,
    totalAmount,
  } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0 && !isPlacingOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <MetaTags title="Checkout | Craftsland" />
        <div className="w-16 h-16 rounded-full bg-[#B11226]/10 text-[#B11226] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#171717]">Your Cart is Empty</h2>
        <p className="text-[#6B6B6B] text-sm max-w-md mx-auto">
          Please add dishes from our artisan menu to your selection before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#B11226] hover:bg-[#7F0D1D] text-white font-bold text-xs uppercase tracking-widest shadow-md transition-colors"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  const validateStep2 = (): boolean => {
    setErrorMsg(null);
    if (orderType === 'DINE_IN' && !tableNumber.trim()) {
      setErrorMsg('Please enter your table number for Dine-In orders.');
      return false;
    }
    if (orderType === 'DELIVERY' && !deliveryAddress.trim()) {
      setErrorMsg('Please enter a delivery address for Delivery orders.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handlePayAndPlaceOrder = async () => {
    if (!validateStep2()) {
      setStep(2);
      return;
    }

    try {
      setErrorMsg(null);
      const newOrder = await placeOrder({
        orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
        specialInstructions,
        customerId: user?.id,
        customerName: customerName || user?.fullName || 'Distinguished Guest',
        customerEmail: customerEmail || user?.email || 'guest@craftsland.com',
        items: items.map((item) => ({
          dishId: item.dish.id,
          dishName: item.dish.name,
          unitPrice: item.dish.price,
          quantity: item.quantity,
          selectedModifiers: item.selectedModifiers,
          itemSubtotal: item.itemSubtotal,
        })),
        subtotal,
        taxAmount,
        deliveryFee,
        discountAmount: 0,
        tipAmount,
        totalAmount,
      });

      clearCart();
      navigate(`/order/${newOrder.id}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to process payment and place order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-[#171717]">
      <MetaTags title="Checkout & Payment | Craftsland" />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">Checkout Portal</h1>
        <p className="text-[#6B6B6B] text-xs sm:text-sm tracking-wide">
          Finalize your culinary order with our concierge service
        </p>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="flex items-center justify-between max-w-xl mx-auto border-b border-[#E5E5E5] pb-4 text-xs font-semibold">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 1 ? 'text-[#B11226]' : step > 1 ? 'text-[#171717]' : 'text-[#6B6B6B]'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#B11226] text-white font-bold' : 'bg-neutral-100 text-[#6B6B6B]'}`}>1</span>
          <span>Review Selection</span>
        </button>
        <div className="w-8 h-px bg-[#E5E5E5]" />
        <button
          onClick={() => { if (step > 1 || items.length > 0) setStep(2); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 2 ? 'text-[#B11226]' : step > 2 ? 'text-[#171717]' : 'text-[#6B6B6B]'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#B11226] text-white font-bold' : 'bg-neutral-100 text-[#6B6B6B]'}`}>2</span>
          <span>Dining Details</span>
        </button>
        <div className="w-8 h-px bg-[#E5E5E5]" />
        <button
          onClick={() => { if (validateStep2()) setStep(3); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 3 ? 'text-[#B11226]' : 'text-[#6B6B6B]'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-[#B11226] text-white font-bold' : 'bg-neutral-100 text-[#6B6B6B]'}`}>3</span>
          <span>Payment</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Contents */}
      <AnimatePresence mode="wait">
        {/* STEP 1: REVIEW */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#171717] border-b border-[#E5E5E5] pb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#B11226]" /> Review Dishes & Quantities
              </h3>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.dish.id} className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-xl flex items-center justify-between gap-4">
                    <img src={item.dish.mediaUrl} alt={item.dish.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-[#171717] text-sm">{item.dish.name}</h4>
                      <p className="text-xs text-[#B11226] font-mono font-bold">${item.dish.price.toFixed(2)} each</p>

                      {item.selectedModifiers.length > 0 && (
                        <div className="text-[11px] text-[#6B6B6B] mt-1">
                          {item.selectedModifiers.map((m, idx) => (
                            <span key={idx} className="block">• {m.optionName} {m.price > 0 && `(+$${m.price.toFixed(2)})`}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#E5E5E5] rounded-lg overflow-hidden bg-white text-xs">
                        <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="px-2.5 py-1 text-[#6B6B6B] hover:text-[#171717] cursor-pointer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-mono font-bold text-[#B11226]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} className="px-2.5 py-1 text-[#6B6B6B] hover:text-[#171717] cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#171717] min-w-[60px] text-right">
                        ${item.itemSubtotal.toFixed(2)}
                      </span>
                      <button onClick={() => removeItem(item.dish.id)} className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E5E5E5] text-sm">
                <span className="text-[#6B6B6B]">Subtotal:</span>
                <span className="font-mono font-bold text-[#B11226] text-lg">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/menu" className="text-xs text-[#6B6B6B] hover:text-[#B11226] flex items-center gap-1.5 font-medium">
                <ArrowLeft className="w-4 h-4" /> Add More Dishes
              </Link>
              <button
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-[#B11226] hover:bg-[#7F0D1D] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                Proceed to Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#171717] border-b border-[#E5E5E5] pb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#B11226]" /> Select Order Mode & Details
              </h3>

              {/* Order Type Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#171717] font-semibold">Dining Method</label>
                <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setOrderType('DINE_IN')}
                    className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      orderType === 'DINE_IN'
                        ? 'bg-[#B11226]/10 border-[#B11226] text-[#B11226] font-bold ring-1 ring-[#B11226]'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#6B6B6B] hover:text-[#171717]'
                    }`}
                  >
                    <Utensils className="w-5 h-5" /> Dine-In
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('PICKUP')}
                    className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      orderType === 'PICKUP'
                        ? 'bg-[#B11226]/10 border-[#B11226] text-[#B11226] font-bold ring-1 ring-[#B11226]'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#6B6B6B] hover:text-[#171717]'
                    }`}
                  >
                    <Store className="w-5 h-5" /> Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('DELIVERY')}
                    className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      orderType === 'DELIVERY'
                        ? 'bg-[#B11226]/10 border-[#B11226] text-[#B11226] font-bold ring-1 ring-[#B11226]'
                        : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#6B6B6B] hover:text-[#171717]'
                    }`}
                  >
                    <Truck className="w-5 h-5" /> Delivery
                  </button>
                </div>
              </div>

              {/* Conditional Inputs based on orderType */}
              {orderType === 'DINE_IN' && (
                <div className="space-y-2">
                  <label className="text-xs text-[#171717] font-semibold flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#B11226]" /> Table Number <span className="text-[#B11226]">*</span>
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 14"
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#171717] focus:outline-none focus:border-[#B11226]"
                  />
                </div>
              )}

              {orderType === 'DELIVERY' && (
                <div className="space-y-2">
                  <label className="text-xs text-[#171717] font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B11226]" /> Delivery Address <span className="text-[#B11226]">*</span>
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your residence or suite delivery address..."
                    rows={3}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#171717] focus:outline-none focus:border-[#B11226]"
                  />
                </div>
              )}

              {/* Guest Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#171717] font-semibold">Guest Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Lord / Lady Sterling"
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#171717] focus:outline-none focus:border-[#B11226]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#171717] font-semibold">Contact Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="guest@craftsland.com"
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#171717] focus:outline-none focus:border-[#B11226]"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#171717] font-semibold">Special Instructions or Dietary Notes</label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Preferred doneness, allergy warnings, sommelier notes..."
                  rows={2}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#171717] focus:outline-none focus:border-[#B11226]"
                />
              </div>

              {/* Concierge Gratuity Selector */}
              <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
                <label className="text-xs text-[#171717] font-semibold">Concierge Gratuity (Tip)</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[10, 15, 18, 20].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setTipPercent(percent)}
                      className={`py-2 rounded-xl border font-mono transition-all cursor-pointer ${
                        tipPercent === percent
                          ? 'bg-[#B11226] border-[#B11226] text-white font-bold'
                          : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#6B6B6B]'
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#6B6B6B] hover:text-[#B11226] flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Review
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-[#B11226] hover:bg-[#7F0D1D] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Payment Authorization Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#171717] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#B11226]" /> Payment Authentication
                  </h3>
                  <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1 font-medium">
                    <Lock className="w-3.5 h-3.5 text-[#B11226]" /> 256-Bit Encrypted
                  </span>
                </div>

                <div className="bg-[#B11226]/10 border border-[#B11226]/20 p-4 rounded-xl text-xs space-y-1 text-[#B11226]">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Demo Environment Active
                  </p>
                  <p className="text-[#6B6B6B]">
                    Payment will be processed via <span className="font-mono font-bold text-[#B11226]">MockPaymentProvider</span>. No real bank charges will be incurred.
                  </p>
                </div>

                {/* Mock Card Input Simulation */}
                <div className="space-y-4 opacity-80 pointer-events-none">
                  <div className="space-y-1">
                    <label className="text-xs text-[#6B6B6B]">Cardholder Name</label>
                    <input
                      type="text"
                      readOnly
                      value={customerName || "Sterling Vance"}
                      className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2 text-xs text-[#171717]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs text-[#6B6B6B]">Card Number</label>
                      <input
                        type="text"
                        readOnly
                        value="•••• •••• •••• 8892"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2 text-xs text-[#171717] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[#6B6B6B]">CVV / Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value="*** | 12/28"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2 text-xs text-[#171717] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayAndPlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full py-4 rounded-full bg-[#B11226] hover:bg-[#7F0D1D] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating Payment...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Pay & Place Order (${totalAmount.toFixed(2)})
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={isPlacingOrder}
                className="text-xs text-[#6B6B6B] hover:text-[#B11226] flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Edit Order Details
              </button>
            </div>

            {/* Sidebar Order Summary */}
            <div className="space-y-4">
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-4 text-xs shadow-sm">
                <h4 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2">
                  Order Summary
                </h4>

                <div className="space-y-2 font-mono text-[#171717]">
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Order Type:</span>
                    <span className="text-[#B11226] font-bold">{orderType}</span>
                  </div>
                  {orderType === 'DINE_IN' && (
                    <div className="flex justify-between">
                      <span className="text-[#6B6B6B]">Table Number:</span>
                      <span className="text-[#171717] font-bold">{tableNumber}</span>
                    </div>
                  )}
                  {orderType === 'DELIVERY' && (
                    <div className="flex justify-between">
                      <span className="text-[#6B6B6B]">Delivery Address:</span>
                      <span className="text-[#171717] truncate max-w-[120px]">{deliveryAddress}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Items Count:</span>
                    <span>{items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#E5E5E5]">
                  <div className="flex justify-between text-[#6B6B6B]"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[#6B6B6B]"><span>Tax (8.5%):</span><span>${taxAmount.toFixed(2)}</span></div>
                  {orderType === 'DELIVERY' && (
                    <div className="flex justify-between text-[#6B6B6B]"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-[#6B6B6B]"><span>Concierge Tip ({tipPercent}%):</span><span>${tipAmount.toFixed(2)}</span></div>
                  
                  <div className="flex justify-between font-serif text-base font-bold text-[#171717] pt-3 border-t border-[#E5E5E5]">
                    <span>Total Amount:</span>
                    <span className="text-[#B11226] font-mono font-bold">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
