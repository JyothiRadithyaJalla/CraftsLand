import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bell, UtensilsCrossed, XCircle, Truck, Store } from 'lucide-react';
import type { OrderStatus, OrderType } from '../../types/order';

interface OrderTimelineProps {
  orderStatus: OrderStatus;
  orderType: OrderType;
}

interface TimelineStep {
  key: OrderStatus;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ orderStatus, orderType }) => {
  const getReadyLabel = () => {
    switch (orderType) {
      case 'DELIVERY':
        return 'Out for Delivery';
      case 'PICKUP':
        return 'Ready for Pickup';
      case 'DINE_IN':
      default:
        return 'Ready to Serve';
    }
  };

  const steps: TimelineStep[] = [
    {
      key: 'PENDING',
      label: 'Order Placed',
      sublabel: 'Received & transmitted to maitre d’',
      icon: Clock,
    },
    {
      key: 'ACCEPTED',
      label: 'Confirmed',
      sublabel: 'Approved by head sommelier & chef',
      icon: CheckCircle2,
    },
    {
      key: 'PREPARING',
      label: 'Kitchen Prep',
      sublabel: 'Artisanal preparation in progress',
      icon: ChefHat,
    },
    {
      key: 'READY',
      label: getReadyLabel(),
      sublabel: orderType === 'DELIVERY' ? 'Courier en route to your address' : 'Awaiting table presentation',
      icon: orderType === 'DELIVERY' ? Truck : orderType === 'PICKUP' ? Store : Bell,
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      sublabel: 'Delivered with luxury excellence',
      icon: UtensilsCrossed,
    },
  ];

  if (orderStatus === 'CANCELLED') {
    return (
      <div className="glass-card p-6 rounded-2xl border border-red-500/30 text-center space-y-3 bg-red-950/20">
        <XCircle className="w-12 h-12 text-red-400 mx-auto animate-pulse" />
        <h3 className="font-serif text-xl font-bold text-red-300">Order Ticket Cancelled</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          This culinary order was cancelled. If you believe this is an error or wish to modify your reservation, please contact our concierge.
        </p>
      </div>
    );
  }

  const statusOrder: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(orderStatus);

  return (
    <div className="space-y-6">
      {/* Step Indicators Bar (Horizontal Desktop & Compact) */}
      <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
        {/* Background Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-white/10 -z-10" />
        
        {/* Active Progress Line */}
        <motion.div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#8C7853] -z-10"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min(100, Math.max(0, (currentIndex / (steps.length - 1)) * 100))}%`,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center group">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                  isDone
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0C10]'
                    : isCurrent
                    ? 'bg-[#0B0C10] border-[#D4AF37] text-[#D4AF37] ring-4 ring-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#12141C] border-white/10 text-gray-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </motion.div>

              <div className="mt-2 text-center hidden sm:block">
                <p className={`text-[11px] font-bold ${isCurrent ? 'text-[#D4AF37]' : isDone ? 'text-[#F4F1EA]' : 'text-gray-500'}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Current Status Badge */}
      <motion.div
        key={orderStatus}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-5 rounded-2xl border border-[#D4AF37]/30 text-center space-y-1.5 max-w-lg mx-auto bg-[#12141C]/80"
      >
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">Live Order Status</span>
        <h3 className="font-serif text-2xl font-bold text-gold-gradient">
          {steps[currentIndex]?.label || 'Processing Order'}
        </h3>
        <p className="text-xs text-gray-300">
          {steps[currentIndex]?.sublabel || 'Updating status with kitchen staff...'}
        </p>
      </motion.div>
    </div>
  );
};
