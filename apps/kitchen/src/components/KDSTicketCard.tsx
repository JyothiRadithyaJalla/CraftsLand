import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Utensils, Store, Truck, AlertTriangle, CheckCircle2, ChefHat, Bell } from 'lucide-react';
import type { Order, OrderStatus } from '@shared/types/order';

interface KDSTicketCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

export const KDSTicketCard: React.FC<KDSTicketCardProps> = ({ order, onUpdateStatus }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const created = new Date(order.createdAt).getTime();
    return Math.max(0, Math.floor((Date.now() - created) / 1000));
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const created = new Date(order.createdAt).getTime();
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - created) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const displaySeconds = String(elapsedSeconds % 60).padStart(2, '0');
  const displayMinutes = String(elapsedMinutes).padStart(2, '0');

  // Urgency tier classification
  let urgencyLevel: 'normal' | 'warning' | 'urgent' = 'normal';
  if (elapsedMinutes >= 20) {
    urgencyLevel = 'urgent';
  } else if (elapsedMinutes >= 10) {
    urgencyLevel = 'warning';
  }

  // Action Button config
  const getActionConfig = () => {
    switch (order.orderStatus) {
      case 'PENDING':
        return {
          nextStatus: 'ACCEPTED' as OrderStatus,
          label: 'Accept Order',
          bgClass: 'bg-blue-600 hover:bg-blue-500 text-white',
          icon: CheckCircle2,
        };
      case 'ACCEPTED':
        return {
          nextStatus: 'PREPARING' as OrderStatus,
          label: 'Start Preparation',
          bgClass: 'bg-purple-600 hover:bg-purple-500 text-white',
          icon: ChefHat,
        };
      case 'PREPARING':
        return {
          nextStatus: 'READY' as OrderStatus,
          label: 'Mark Ready for Pass',
          bgClass: 'bg-gradient-to-r from-[#B84A32] to-[#8B3525] hover:brightness-110 text-white font-bold',
          icon: Bell,
        };
      case 'READY':
        return {
          nextStatus: 'COMPLETED' as OrderStatus,
          label: 'Complete Order',
          bgClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
          icon: CheckCircle2,
        };
      default:
        return null;
    }
  };

  const actionConfig = getActionConfig();

  const handleActionClick = async () => {
    if (!actionConfig || isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, actionConfig.nextStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  // Allergy warning detection logic
  const allergyList: string[] = [];
  const textToCheck = `${order.specialInstructions || ''}`.toLowerCase();
  
  if (textToCheck.includes('nut') || textToCheck.includes('peanut')) allergyList.push('NUT ALLERGY');
  if (textToCheck.includes('gluten') || textToCheck.includes('wheat')) allergyList.push('GLUTEN SENSITIVE');
  if (textToCheck.includes('dairy') || textToCheck.includes('lactose')) allergyList.push('DAIRY FREE');
  if (textToCheck.includes('shellfish') || textToCheck.includes('seafood')) allergyList.push('SHELLFISH ALLERGY');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
        urgencyLevel === 'urgent'
          ? 'border-red-500 bg-red-50/70 ring-2 ring-red-400 shadow-md'
          : urgencyLevel === 'warning'
          ? 'border-amber-400 bg-amber-50/50'
          : 'border-[#E2DDD6] bg-[#FFFFFF]'
      }`}
    >
      {/* Ticket Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-[#E2DDD6] pb-2.5">
          <div>
            <span className="font-mono text-base font-bold text-[#B84A32] block">
              {order.orderNumber}
            </span>
            <span className="text-[11px] text-[#6B6560] font-mono">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Elapsed Timer Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
              urgencyLevel === 'urgent'
                ? 'bg-red-600 text-white animate-bounce'
                : urgencyLevel === 'warning'
                ? 'bg-amber-100 border border-amber-300 text-amber-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{displayMinutes}:{displaySeconds}</span>
          </div>
        </div>

        {/* Order Mode Badge & Table Info */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            {order.orderType === 'DINE_IN' && (
              <span className="inline-flex items-center gap-1 bg-[#B84A32]/10 border border-[#B84A32]/25 text-[#B84A32] px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                <Utensils className="w-3 h-3" /> Dine-In
              </span>
            )}
            {order.orderType === 'PICKUP' && (
              <span className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                <Store className="w-3 h-3" /> Pickup
              </span>
            )}
            {order.orderType === 'DELIVERY' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                <Truck className="w-3 h-3" /> Delivery
              </span>
            )}
          </div>

          {order.tableNumber && (
            <span className="font-mono font-bold text-white bg-[#B84A32] px-2 py-0.5 rounded text-xs">
              {order.tableNumber.startsWith('Table') ? order.tableNumber : `Table ${order.tableNumber}`}
            </span>
          )}
        </div>
      </div>

      {/* Allergy Callout Warnings */}
      {allergyList.length > 0 && (
        <div className="bg-red-100 border border-red-300 p-2 rounded-xl space-y-1">
          {allergyList.map((allergy, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-red-800 tracking-wider uppercase">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>⚠️ {allergy}</span>
            </div>
          ))}
        </div>
      )}

      {/* Item List */}
      <div className="space-y-3 py-1 border-t border-b border-[#E2DDD6] my-1 max-h-56 overflow-y-auto">
        {order.items.map((item) => (
          <div key={item.id} className="text-xs space-y-1">
            <div className="flex items-start justify-between font-bold text-[#1A1714]">
              <span className="flex gap-2">
                <span className="text-[#B84A32] font-mono text-sm bg-[#B84A32]/10 border border-[#B84A32]/20 px-1.5 py-0.5 rounded font-bold">
                  {item.quantity}×
                </span>
                <span className="text-sm font-serif text-[#1A1714]">{item.dishName}</span>
              </span>
            </div>

            {/* Modifiers List */}
            {item.selectedModifiers.length > 0 && (
              <div className="pl-7 space-y-0.5 text-[11px] text-[#8B3525] font-mono">
                {item.selectedModifiers.map((m, idx) => (
                  <span key={idx} className="block font-medium">• {m.optionName}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Special Instructions Notes */}
      {order.specialInstructions && (
        <div className="bg-[#F5F2EE] border border-[#E2DDD6] p-2.5 rounded-xl text-xs space-y-1">
          <span className="text-[10px] text-[#6B6560] uppercase tracking-wider block font-semibold">Special Instructions</span>
          <p className="text-[#1A1714] italic font-serif">{order.specialInstructions}</p>
        </div>
      )}

      {/* Status Action Button */}
      {actionConfig && (
        <button
          onClick={handleActionClick}
          disabled={isUpdating}
          className={`w-full py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${actionConfig.bgClass} disabled:opacity-50`}
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Updating Ticket...
            </span>
          ) : (
            <>
              <actionConfig.icon className="w-4 h-4" /> {actionConfig.label}
            </>
          )}
        </button>
      )}
    </motion.div>
  );
};
