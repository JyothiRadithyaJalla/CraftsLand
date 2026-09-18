import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MetaTags } from '@shared/components/MetaTags';
import { OrderTimeline, STATUS_MESSAGES } from '../components/OrderTimeline';
import { useOrders } from '@shared/hooks/useOrders';
import type { Order, OrderStatus } from '@shared/types/order';
import { Clock, ShoppingBag, ArrowLeft, AlertCircle, CreditCard, Sparkles, X, Receipt } from 'lucide-react';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { InvoiceModal } from '@shared/components/InvoiceModal';
import { RESTAURANT_BRAND } from '@shared/config/constants';

export const OrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, subscribeToOrder, payPendingOrder, isPlacingOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [statusToast, setStatusToast] = useState<{ message: string; status: OrderStatus } | null>(null);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const prevStatusRef = useRef<OrderStatus | null>(null);

  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Autoplay browser policy catch
    }
  };

  useEffect(() => {
    if (!statusToast) return;
    const timer = setTimeout(() => setStatusToast(null), 6000);
    return () => clearTimeout(timer);
  }, [statusToast]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setErrorMsg('No order ticket specified.');
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const fetchAndSubscribe = async () => {
      setLoading(true);
      setErrorMsg(null);

      const foundOrder = await getOrderById(id);
      if (foundOrder) {
        setOrder(foundOrder);
        prevStatusRef.current = foundOrder.orderStatus;
        setLoading(false);

        // Subscribe to live status changes (multi-transport realtime)
        unsubscribe = subscribeToOrder(foundOrder.id, (updatedOrder) => {
          setOrder(updatedOrder);

          if (prevStatusRef.current && prevStatusRef.current !== updatedOrder.orderStatus) {
            const msg = STATUS_MESSAGES[updatedOrder.orderStatus] || `Order status updated to ${updatedOrder.orderStatus}.`;
            setStatusToast({ message: msg, status: updatedOrder.orderStatus });
            playNotificationChime();
          }
          prevStatusRef.current = updatedOrder.orderStatus;
        }, foundOrder.trackingToken);
      } else {
        setLoading(false);
        setErrorMsg(`Order ticket "${id}" was not found.`);
      }
    };

    fetchAndSubscribe();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <MetaTags title="Tracking Order... | Aura" />
        <LoadingSpinner label="Retrieving culinary ticket from concierge registry..." />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 text-[#182019]">
        <MetaTags title="Order Not Found | Aura" />
        <div className="w-16 h-16 rounded-2xl bg-[#A8382B]/10 border border-[#A8382B]/20 text-[#A8382B] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#182019]">Ticket Not Found</h2>
        <p className="text-[#626F64] text-sm max-w-md mx-auto">{errorMsg || 'Unable to locate order ticket.'}</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#31543A] hover:bg-[#26432E] text-white font-bold text-xs uppercase tracking-widest shadow-xs border border-[#26432E] transition-all min-h-[44px]"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-[#182019]">
      <MetaTags title={`Order ${order.orderNumber} Status | Aura`} />

      {/* Realtime Status Advancement Notification Toast */}
      <AnimatePresence>
        {statusToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-2xl bg-[#31543A] text-white shadow-md border border-[#26432E] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#78956A] block">Live Status Update</span>
                <p className="text-xs sm:text-sm font-semibold">{statusToast.message}</p>
              </div>
            </div>
            <button
              onClick={() => setStatusToast(null)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#31543A]/10 border border-[#31543A]/30 text-[#31543A] text-xs font-mono font-bold">
          <Clock className="w-3.5 h-3.5 animate-pulse text-[#31543A]" /> Live Order Tracking
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#182019]">
          Ticket {order.orderNumber}
        </h1>
        <p className="text-[#626F64] text-xs sm:text-sm">
          Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Mode: <span className="text-[#31543A] font-bold">{order.orderType}</span>
        </p>
      </div>

      {/* Animated Order Timeline */}
      <div className="bg-white border border-[#DDD9CB] p-6 sm:p-8 rounded-2xl space-y-8 shadow-xs">
        <OrderTimeline orderStatus={order.orderStatus} orderType={order.orderType} />
      </div>

      {/* Ticket Details & Items Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ordered Dishes List */}
        <div className="md:col-span-2 bg-white border border-[#DDD9CB] p-6 rounded-2xl space-y-4 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#182019] border-b border-[#DDD9CB] pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#31543A]" /> Prepared Items
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="bg-[#FAF8F3] border border-[#DDD9CB] p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif font-bold text-[#182019] text-sm">{item.dishName}</h4>
                  <p className="text-xs text-[#31543A] font-mono font-bold">
                    {RESTAURANT_BRAND.currencySymbol}{item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                  {item.selectedModifiers.length > 0 && (
                    <div className="text-[11px] text-[#626F64] mt-1">
                      {item.selectedModifiers.map((m, idx) => (
                        <span key={idx} className="block">• {m.optionName} {m.price > 0 && `(+${RESTAURANT_BRAND.currencySymbol}${m.price.toFixed(2)})`}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-mono text-sm font-bold text-[#182019]">
                  {RESTAURANT_BRAND.currencySymbol}{item.itemSubtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Info Sidebar */}
        <div className="space-y-6">
          {payError && (
            <div className="bg-[#A8382B]/10 border border-[#A8382B]/20 p-4 rounded-xl text-xs text-[#A8382B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#A8382B] shrink-0" />
              <span>{payError}</span>
            </div>
          )}

          <div className="bg-white border border-[#DDD9CB] p-6 rounded-2xl space-y-4 text-xs shadow-xs">
            <h4 className="font-serif text-lg font-bold text-[#182019] border-b border-[#DDD9CB] pb-2">
              Ticket Overview
            </h4>

            <div className="space-y-2 text-[#182019] font-mono">
              <div className="flex justify-between">
                <span className="text-[#626F64]">Payment Status:</span>
                <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-[#31543A]' : order.paymentStatus === 'FAILED' ? 'text-[#A8382B]' : 'text-[#C97852]'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#626F64]">Reference:</span>
                <span className="text-[#182019] truncate max-w-[100px]">{order.paymentReference || 'N/A'}</span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-[#626F64]">Table Number:</span>
                  <span className="text-[#31543A] font-bold">{order.tableNumber}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="space-y-1">
                  <span className="text-[#626F64] block">Delivery Address:</span>
                  <p className="text-[#182019] font-sans text-xs bg-[#FAF8F3] border border-[#DDD9CB] p-2 rounded-lg">{order.deliveryAddress}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#DDD9CB]">
              <div className="flex justify-between text-[#626F64]"><span>Subtotal:</span><span>{RESTAURANT_BRAND.currencySymbol}{order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#626F64]"><span>Tax:</span><span>{RESTAURANT_BRAND.currencySymbol}{order.taxAmount.toFixed(2)}</span></div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-[#626F64]"><span>Delivery Fee:</span><span>{RESTAURANT_BRAND.currencySymbol}{order.deliveryFee.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-[#626F64]"><span>Gratuity:</span><span>{RESTAURANT_BRAND.currencySymbol}{order.tipAmount.toFixed(2)}</span></div>

              <div className="flex justify-between font-serif text-base font-bold text-[#182019] pt-2 border-t border-[#DDD9CB]">
                <span>Total Amount:</span>
                <span className="text-[#31543A] font-mono font-bold text-lg">{RESTAURANT_BRAND.currencySymbol}{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Abandoned / Failed Payment Retry Button */}
            {order.paymentStatus !== 'PAID' && order.orderStatus !== 'CANCELLED' && (
              <button
                onClick={async () => {
                  try {
                    setPayError(null);
                    const updated = await payPendingOrder(order);
                    setOrder(updated);
                  } catch (e: any) {
                    setPayError(e?.message || 'Payment retry was interrupted.');
                  }
                }}
                disabled={isPlacingOrder}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#31543A] hover:bg-[#26432E] active:scale-[0.97] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-[#26432E] transition-all disabled:opacity-50 min-h-[44px]"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting Gateway...
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Complete Payment ({RESTAURANT_BRAND.currencySymbol}{order.totalAmount.toFixed(2)})
                  </>
                )}
              </button>
            )}
          </div>

          {/* View & Print Tax Invoice Button */}
          <button
            type="button"
            onClick={() => setShowInvoice(true)}
            className="w-full py-3.5 rounded-xl border border-[#DDD9CB] bg-white hover:border-[#31543A] active:scale-[0.97] text-[#182019] hover:text-[#31543A] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all min-h-[44px]"
          >
            <Receipt className="w-4 h-4 text-[#31543A]" /> View & Print Tax Invoice
          </button>

          <Link
            to="/menu"
            className="w-full py-3.5 rounded-xl border border-[#DDD9CB] bg-[#FAF8F3] text-[#182019] hover:text-[#31543A] hover:border-[#31543A]/40 active:scale-[0.97] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </Link>

        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
};
