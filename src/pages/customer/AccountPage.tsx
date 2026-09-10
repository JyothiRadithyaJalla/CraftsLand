import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { MetaTags } from '../../components/common/MetaTags';
import { User, Shield, ShoppingBag, Clock, ArrowRight } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, role } = useAuth();
  const { orders } = useOrders();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-[#F4F1EA]">
      <MetaTags title="Guest Account | L'Étoile Noir" />

      {/* Account Info */}
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-4 border-b border-[#D4AF37]/20 pb-4">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#F4F1EA]">{user?.fullName || 'Distinguished Guest'}</h1>
            <p className="text-xs text-gray-400">{user?.email || 'guest@letoilenoir.com'}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span>Assigned Permission Role:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            <Shield className="w-3.5 h-3.5" /> {role}
          </span>
        </div>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gold-gradient flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#D4AF37]" /> Recent Dining Orders
        </h2>

        {orders.length === 0 ? (
          <div className="glass-panel p-6 rounded-xl text-center space-y-2">
            <p className="text-sm text-gray-400 font-serif">No order tickets recorded on your account yet.</p>
            <Link to="/menu" className="text-xs text-[#D4AF37] hover:underline font-semibold">
              Explore our reserve menu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#D4AF37] text-sm">{ord.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 uppercase font-semibold">
                      {ord.orderType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#F4F1EA] block">
                      ${ord.totalAmount.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      ord.orderStatus === 'COMPLETED'
                        ? 'text-emerald-400'
                        : ord.orderStatus === 'CANCELLED'
                        ? 'text-red-400'
                        : 'text-[#D4AF37]'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <Link
                    to={`/order/${ord.id}`}
                    className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0C10] transition-colors cursor-pointer"
                    title="View Order Status"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
