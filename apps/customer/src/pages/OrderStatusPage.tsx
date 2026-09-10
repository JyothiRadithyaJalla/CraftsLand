import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { OrderTimeline } from '../components/OrderTimeline';
import { useOrders } from '@shared/hooks/useOrders';
import type { Order } from '@shared/types/order';
import { Clock, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

export const OrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, subscribeToOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setLoading(false);

        // Subscribe to live status changes
        unsubscribe = subscribeToOrder(foundOrder.id, (updatedOrder) => {
          setOrder(updatedOrder);
        });
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
        <MetaTags title="Tracking Order... | L'Étoile Noir" />
        <LoadingSpinner label="Retrieving culinary ticket from concierge registry..." />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 text-[#F4F1EA]">
        <MetaTags title="Order Not Found | L'Étoile Noir" />
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-red-400">Ticket Not Found</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">{errorMsg || 'Unable to locate order ticket.'}</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest"
        >
          Return to Haute Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-[#F4F1EA]">
      <MetaTags title={`Order ${order.orderNumber} Status | L'Étoile Noir`} />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
          <Clock className="w-3.5 h-3.5 animate-pulse" /> Live Order Tracking
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold-gradient">
          Ticket {order.orderNumber}
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Mode: <span className="text-[#D4AF37] font-semibold">{order.orderType}</span>
        </p>
      </div>

      {/* Animated Order Timeline */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-8">
        <OrderTimeline orderStatus={order.orderStatus} orderType={order.orderType} />
      </div>

      {/* Ticket Details & Items Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ordered Dishes List */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#F4F1EA] border-b border-white/10 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" /> Prepared Items
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif font-bold text-[#F4F1EA] text-sm">{item.dishName}</h4>
                  <p className="text-xs text-[#D4AF37] font-mono">
                    ${item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                  {item.selectedModifiers.length > 0 && (
                    <div className="text-[11px] text-gray-400 mt-1">
                      {item.selectedModifiers.map((m, idx) => (
                        <span key={idx} className="block">• {m.optionName} {m.price > 0 && `(+$${m.price.toFixed(2)})`}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-mono text-sm font-bold text-[#F4F1EA]">
                  ${item.itemSubtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Info Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 text-xs">
            <h4 className="font-serif text-lg font-bold text-gold-gradient border-b border-white/10 pb-2">
              Ticket Overview
            </h4>

            <div className="space-y-2 text-gray-300 font-mono">
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="text-emerald-400 font-bold">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Reference:</span>
                <span className="text-gray-400 truncate max-w-[100px]">{order.paymentReference || 'N/A'}</span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between">
                  <span>Table Number:</span>
                  <span className="text-[#D4AF37] font-bold">{order.tableNumber}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="space-y-1">
                  <span className="text-gray-400 block">Delivery Address:</span>
                  <p className="text-[#F4F1EA] font-sans text-xs bg-white/5 p-2 rounded-lg">{order.deliveryAddress}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex justify-between text-gray-400"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Tax:</span><span>${order.taxAmount.toFixed(2)}</span></div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-400"><span>Delivery Fee:</span><span>${order.deliveryFee.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-gray-400"><span>Gratuity:</span><span>${order.tipAmount.toFixed(2)}</span></div>

              <div className="flex justify-between font-serif text-base font-bold text-[#F4F1EA] pt-2 border-t border-white/10">
                <span>Total Amount:</span>
                <span className="text-gold-gradient">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Link
            to="/menu"
            className="w-full py-3 rounded-full border border-white/15 text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Haute Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
