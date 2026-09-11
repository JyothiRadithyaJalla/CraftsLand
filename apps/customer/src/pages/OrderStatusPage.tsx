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
        <MetaTags title="Tracking Order... | Craftsland" />
        <LoadingSpinner label="Retrieving culinary ticket from concierge registry..." />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 text-[#F4F1EA]">
        <MetaTags title="Order Not Found | Craftsland" />
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-red-400">Ticket Not Found</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">{errorMsg || 'Unable to locate order ticket.'}</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:brightness-110 transition-all"
        >
          Return to Haute Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-[#171717]">
      <MetaTags title={`Order ${order.orderNumber} Status | Craftsland`} />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#B11226]/10 border border-[#B11226]/30 text-[#B11226] text-xs font-mono font-bold">
          <Clock className="w-3.5 h-3.5 animate-pulse" /> Live Order Tracking
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
          Ticket {order.orderNumber}
        </h1>
        <p className="text-[#6B6B6B] text-xs sm:text-sm">
          Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Mode: <span className="text-[#B11226] font-bold">{order.orderType}</span>
        </p>
      </div>

      {/* Animated Order Timeline */}
      <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 rounded-2xl space-y-8 shadow-sm">
        <OrderTimeline orderStatus={order.orderStatus} orderType={order.orderType} />
      </div>

      {/* Ticket Details & Items Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ordered Dishes List */}
        <div className="md:col-span-2 bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#171717] border-b border-[#E5E5E5] pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#B11226]" /> Prepared Items
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif font-bold text-[#171717] text-sm">{item.dishName}</h4>
                  <p className="text-xs text-[#B11226] font-mono font-bold">
                    ${item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                  {item.selectedModifiers.length > 0 && (
                    <div className="text-[11px] text-[#6B6B6B] mt-1">
                      {item.selectedModifiers.map((m, idx) => (
                        <span key={idx} className="block">• {m.optionName} {m.price > 0 && `(+$${m.price.toFixed(2)})`}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-mono text-sm font-bold text-[#171717]">
                  ${item.itemSubtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-4 text-xs shadow-sm">
            <h4 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2">
              Ticket Overview
            </h4>

            <div className="space-y-2 text-[#171717] font-mono">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Payment Status:</span>
                <span className="text-emerald-600 font-bold">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Reference:</span>
                <span className="text-[#171717] truncate max-w-[100px]">{order.paymentReference || 'N/A'}</span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Table Number:</span>
                  <span className="text-[#B11226] font-bold">{order.tableNumber}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="space-y-1">
                  <span className="text-[#6B6B6B] block">Delivery Address:</span>
                  <p className="text-[#171717] font-sans text-xs bg-[#FAFAFA] border border-[#E5E5E5] p-2 rounded-lg">{order.deliveryAddress}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E5E5E5]">
              <div className="flex justify-between text-[#6B6B6B]"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#6B6B6B]"><span>Tax:</span><span>${order.taxAmount.toFixed(2)}</span></div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-[#6B6B6B]"><span>Delivery Fee:</span><span>${order.deliveryFee.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-[#6B6B6B]"><span>Gratuity:</span><span>${order.tipAmount.toFixed(2)}</span></div>

              <div className="flex justify-between font-serif text-base font-bold text-[#171717] pt-2 border-t border-[#E5E5E5]">
                <span>Total Amount:</span>
                <span className="text-[#B11226] font-mono font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Link
            to="/menu"
            className="w-full py-3 rounded-full border border-[#E5E5E5] bg-white text-[#171717] hover:text-[#B11226] hover:border-[#B11226] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
