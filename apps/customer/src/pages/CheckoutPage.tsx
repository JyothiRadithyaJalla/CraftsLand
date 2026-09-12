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
import { env } from '@shared/config/env';
import { RESTAURANT_BRAND } from '@shared/config/constants';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { placeOrder, isPlacingOrder, isPaymentConfigured } = useOrders();
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
        <div className="w-16 h-16 rounded-full bg-[#B84A32]/15 text-[#B84A32] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#F5EFE5]">Your Cart is Empty</h2>
        <p className="text-[#B8AEA1] text-sm max-w-md mx-auto">
          Please add dishes from our artisan menu to your selection before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest shadow-md transition-colors"
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-[#F5EFE5]">
      <MetaTags title="Checkout & Payment | Craftsland" />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5EFE5]">Checkout Portal</h1>
        <p className="text-[#B8AEA1] text-xs sm:text-sm tracking-wide">
          Finalize your culinary order with our concierge service
        </p>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="flex items-center justify-between max-w-xl mx-auto border-b border-[#3A3027] pb-4 text-xs font-semibold">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 1 ? 'text-[#B84A32]' : step > 1 ? 'text-[#F5EFE5]' : 'text-[#B8AEA1]/60'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#B84A32] text-white font-bold' : 'bg-[#211B16] text-[#B8AEA1] border border-[#3A3027]'}`}>1</span>
          <span>Review Selection</span>
        </button>
        <div className="w-8 h-px bg-[#3A3027]" />
        <button
          onClick={() => { if (step > 1 || items.length > 0) setStep(2); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 2 ? 'text-[#B84A32]' : step > 2 ? 'text-[#F5EFE5]' : 'text-[#B8AEA1]/60'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#B84A32] text-white font-bold' : 'bg-[#211B16] text-[#B8AEA1] border border-[#3A3027]'}`}>2</span>
          <span>Dining Details</span>
        </button>
        <div className="w-8 h-px bg-[#3A3027]" />
        <button
          onClick={() => { if (validateStep2()) setStep(3); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 3 ? 'text-[#B84A32]' : 'text-[#B8AEA1]/60'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-[#B84A32] text-white font-bold' : 'bg-[#211B16] text-[#B8AEA1] border border-[#3A3027]'}`}>3</span>
          <span>Payment</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="bg-red-950/40 p-4 rounded-xl border border-red-900/50 text-red-300 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
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
            <div className="bg-[#211B16] border border-[#3A3027] p-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-[#F5EFE5] border-b border-[#3A3027] pb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#B84A32]" /> Review Dishes & Quantities
              </h3>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.dish.id} className="bg-[#171310] border border-[#3A3027] p-4 rounded-xl flex items-center justify-between gap-4">
                    <img src={item.dish.mediaUrl} alt={item.dish.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-[#F5EFE5] text-sm">{item.dish.name}</h4>
                      <p className="text-xs text-[#B84A32] font-mono font-bold">{RESTAURANT_BRAND.currencySymbol}{item.dish.price.toFixed(2)} each</p>

                      {item.selectedModifiers.length > 0 && (
                        <div className="text-[11px] text-[#B8AEA1] mt-1">
                          {item.selectedModifiers.map((m, idx) => (
                            <span key={idx} className="block">• {m.optionName} {m.price > 0 && `(+${RESTAURANT_BRAND.currencySymbol}${m.price.toFixed(2)})`}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#3A3027] rounded-lg overflow-hidden bg-[#211B16] text-xs">
                        <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="px-2.5 py-1 text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-mono font-bold text-[#B84A32]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} className="px-2.5 py-1 text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#F5EFE5] min-w-[60px] text-right">
                        {RESTAURANT_BRAND.currencySymbol}{item.itemSubtotal.toFixed(2)}
                      </span>
                      <button onClick={() => removeItem(item.dish.id)} className="text-[#B8AEA1] hover:text-red-400 p-1 cursor-pointer transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#3A3027] text-sm">
                <span className="text-[#B8AEA1]">Subtotal:</span>
                <span className="font-mono font-bold text-[#B84A32] text-lg">{RESTAURANT_BRAND.currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/menu" className="text-xs text-[#B8AEA1] hover:text-[#B84A32] flex items-center gap-1.5 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Add More Dishes
              </Link>
              <button
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors"
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
            <div className="bg-[#211B16] border border-[#3A3027] p-6 rounded-2xl space-y-6 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-[#F5EFE5] border-b border-[#3A3027] pb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#B84A32]" /> Select Order Mode & Details
              </h3>

              {/* Order Type Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#F5EFE5] font-semibold">Dining Method</label>
                <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setOrderType('DINE_IN')}
                    className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      orderType === 'DINE_IN'
                        ? 'bg-[#B84A32]/20 border-[#B84A32] text-[#B84A32] font-bold ring-1 ring-[#B84A32]'
                        : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
                    }`}
                  >
                    <Utensils className="w-5 h-5" /> Dine-In
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('PICKUP')}
                    className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      orderType === 'PICKUP'
                        ? 'bg-[#B84A32]/20 border-[#B84A32] text-[#B84A32] font-bold ring-1 ring-[#B84A32]'
                        : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
                    }`}
                  >
                    <Store className="w-5 h-5" /> Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('DELIVERY')}
                    className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      orderType === 'DELIVERY'
                        ? 'bg-[#B84A32]/20 border-[#B84A32] text-[#B84A32] font-bold ring-1 ring-[#B84A32]'
                        : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
                    }`}
                  >
                    <Truck className="w-5 h-5" /> Delivery
                  </button>
                </div>
              </div>

              {/* Conditional Inputs based on orderType */}
              {orderType === 'DINE_IN' && (
                <div className="space-y-2">
                  <label className="text-xs text-[#F5EFE5] font-semibold flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#B84A32]" /> Table Number <span className="text-[#B84A32]">*</span>
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 14"
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                  />
                </div>
              )}

              {orderType === 'DELIVERY' && (
                <div className="space-y-2">
                  <label className="text-xs text-[#F5EFE5] font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B84A32]" /> Delivery Address <span className="text-[#B84A32]">*</span>
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your residence or suite delivery address..."
                    rows={3}
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                  />
                </div>
              )}

              {/* Guest Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#F5EFE5] font-semibold">Guest Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Lord / Lady Sterling"
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#F5EFE5] font-semibold">Contact Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="guest@craftsland.com"
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#F5EFE5] font-semibold">Special Instructions or Dietary Notes</label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Preferred doneness, allergy warnings, sommelier notes..."
                  rows={2}
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                />
              </div>

              {/* Concierge Gratuity Selector */}
              <div className="space-y-2 pt-2 border-t border-[#3A3027]">
                <label className="text-xs text-[#F5EFE5] font-semibold">Concierge Gratuity (Tip)</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[10, 15, 18, 20].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setTipPercent(percent)}
                      className={`py-2 rounded-xl border font-mono transition-all cursor-pointer ${
                        tipPercent === percent
                          ? 'bg-[#B84A32] border-[#B84A32] text-white font-bold'
                          : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
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
                className="text-xs text-[#B8AEA1] hover:text-[#B84A32] flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Review
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors"
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
              <div className="bg-[#211B16] border border-[#3A3027] p-6 rounded-2xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#3A3027] pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#F5EFE5] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#B84A32]" /> Payment Authentication
                  </h3>
                  <span className="text-[11px] text-[#B8AEA1] flex items-center gap-1 font-medium">
                    <Lock className="w-3.5 h-3.5 text-[#B84A32]" /> 256-Bit Encrypted
                  </span>
                </div>

                {env.isRazorpayConfigured ? (
                  <div className="bg-[#B84A32]/10 border border-[#B84A32]/30 p-4 rounded-xl text-xs space-y-2 text-[#F5EFE5]">
                    <div className="flex items-center gap-2 text-[#D29A55] font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#B84A32]" />
                      <span>Razorpay Sandbox (TEST Mode) Active</span>
                    </div>
                    <p className="text-[#B8AEA1] leading-relaxed">
                      Your transaction will be processed via <span className="font-bold text-[#F5EFE5]">Razorpay Test Gateway</span>. You can safely authenticate with test UPI, Netbanking, or mock test cards. No real bank charges will be incurred.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#B8AEA1]/80 pt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Currency: {RESTAURANT_BRAND.currency} ({RESTAURANT_BRAND.currencySymbol})</span>
                    </div>
                  </div>
                ) : !isPaymentConfigured ? (
                  <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-xs space-y-1 text-red-300">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-400" /> Gateway Unavailable
                    </p>
                    <p>
                      Online payment gateway is temporarily unconfigured. Please contact restaurant concierge.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#B84A32]/10 border border-[#B84A32]/30 p-4 rounded-xl text-xs space-y-1 text-[#B84A32]">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Local Development Simulation Active
                    </p>
                    <p className="text-[#B8AEA1]">
                      Local developer mock provider is running. Configure <span className="font-mono text-white">VITE_RAZORPAY_KEY_ID</span> to test live Razorpay checkout.
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePayAndPlaceOrder}
                  disabled={isPlacingOrder || !isPaymentConfigured}
                  className="w-full py-4 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating Razorpay Gateway...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Pay with Razorpay ({RESTAURANT_BRAND.currencySymbol}{totalAmount.toFixed(2)})
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={isPlacingOrder}
                className="text-xs text-[#B8AEA1] hover:text-[#B84A32] flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Edit Order Details
              </button>
            </div>

            {/* Sidebar Order Summary */}
            <div className="space-y-4">
              <div className="bg-[#211B16] border border-[#3A3027] p-6 rounded-2xl space-y-4 text-xs shadow-xl">
                <h4 className="font-serif text-lg font-bold text-[#F5EFE5] border-b border-[#3A3027] pb-2">
                  Order Summary
                </h4>

                <div className="space-y-2 font-mono text-[#F5EFE5]">
                  <div className="flex justify-between">
                    <span className="text-[#B8AEA1]">Order Type:</span>
                    <span className="text-[#B84A32] font-bold">{orderType}</span>
                  </div>
                  {orderType === 'DINE_IN' && (
                    <div className="flex justify-between">
                      <span className="text-[#B8AEA1]">Table Number:</span>
                      <span className="text-[#F5EFE5] font-bold">{tableNumber}</span>
                    </div>
                  )}
                  {orderType === 'DELIVERY' && (
                    <div className="flex justify-between">
                      <span className="text-[#B8AEA1]">Delivery Address:</span>
                      <span className="text-[#F5EFE5] truncate max-w-[120px]">{deliveryAddress}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#B8AEA1]">Items Count:</span>
                    <span>{items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#3A3027]">
                  <div className="flex justify-between text-[#B8AEA1]"><span>Subtotal:</span><span>{RESTAURANT_BRAND.currencySymbol}{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[#B8AEA1]"><span>Tax (8.5%):</span><span>{RESTAURANT_BRAND.currencySymbol}{taxAmount.toFixed(2)}</span></div>
                  {orderType === 'DELIVERY' && (
                    <div className="flex justify-between text-[#B8AEA1]"><span>Delivery Fee:</span><span>{RESTAURANT_BRAND.currencySymbol}{deliveryFee.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-[#B8AEA1]"><span>Concierge Tip ({tipPercent}%):</span><span>{RESTAURANT_BRAND.currencySymbol}{tipAmount.toFixed(2)}</span></div>
                  
                  <div className="flex justify-between font-serif text-base font-bold text-[#F5EFE5] pt-3 border-t border-[#3A3027]">
                    <span>Total Amount:</span>
                    <span className="text-[#B84A32] font-mono font-bold">{RESTAURANT_BRAND.currencySymbol}{totalAmount.toFixed(2)}</span>
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
