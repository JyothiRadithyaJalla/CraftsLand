import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';
import { DollarSign, ShoppingBag, Calendar, TrendingUp } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <MetaTags title="Admin Dashboard | L'Étoile Noir" />
      
      <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Executive Command Center</h1>
          <p className="text-xs text-gray-400">Realtime revenue performance & dining suite metrics</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-sans">Today's Revenue</p>
            <p className="text-2xl font-serif font-bold text-[#D4AF37]">$4,890.00</p>
          </div>
          <div className="p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]"><DollarSign className="w-6 h-6" /></div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-sans">Active Orders</p>
            <p className="text-2xl font-serif font-bold text-[#F4F1EA]">8</p>
          </div>
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-400"><ShoppingBag className="w-6 h-6" /></div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-sans">Bookings Today</p>
            <p className="text-2xl font-serif font-bold text-[#F4F1EA]">14</p>
          </div>
          <div className="p-3 rounded-full bg-purple-500/10 text-purple-400"><Calendar className="w-6 h-6" /></div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-sans">Avg Ticket Value</p>
            <p className="text-2xl font-serif font-bold text-[#D4AF37]">$185.50</p>
          </div>
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-6 h-6" /></div>
        </div>
      </div>
    </div>
  );
};
