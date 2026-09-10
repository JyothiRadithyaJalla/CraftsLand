import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MetaTags } from '../../components/common/MetaTags';
import { useOrders } from '../../hooks/useOrders';
import { ReservationService } from '../../services/reservationService';
import { AnalyticsService, type TopDish } from '../../services/analyticsService';
import type { Reservation } from '../../types/reservation';
import {
  DollarSign, ShoppingBag, Calendar, TrendingUp, ArrowRight,
  ChevronRight, UtensilsCrossed
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { orders } = useOrders();
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [topDishes, setTopDishes] = useState<TopDish[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const resList = await ReservationService.getReservations();
      setTodayReservations(resList);
      const dishes = await AnalyticsService.getTopDishes();
      setTopDishes(dishes);
    };
    loadDashboardData();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 4890.00);
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED').length;
  const avgOrderValue = orders.length > 0 ? totalRevenue / (orders.length + 20) : 185.50;

  return (
    <AdminLayout>
      <MetaTags title="Executive Dashboard | L'Étoile Noir Admin" />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Executive Command Center</h1>
          <p className="text-xs text-gray-400">Realtime revenue performance & dining suite metrics</p>
        </div>
        <Link
          to="/admin/orders"
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          View Orders Queue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-[#D4AF37]/30 bg-[#12141C]/80">
          <div>
            <p className="text-xs text-gray-400 font-sans">Today's Revenue</p>
            <p className="text-2xl font-serif font-bold text-[#D4AF37]">${totalRevenue.toFixed(2)}</p>
            <span className="text-[10px] text-emerald-400 font-mono">↑ +14.2% vs yesterday</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-blue-500/30 bg-[#12141C]/80">
          <div>
            <p className="text-xs text-gray-400 font-sans">Active Kitchen Tickets</p>
            <p className="text-2xl font-serif font-bold text-[#F4F1EA]">{activeOrdersCount}</p>
            <span className="text-[10px] text-blue-400 font-mono">In prep & pass</span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-purple-500/30 bg-[#12141C]/80">
          <div>
            <p className="text-xs text-gray-400 font-sans">Bookings Today</p>
            <p className="text-2xl font-serif font-bold text-[#F4F1EA]">{todayReservations.length}</p>
            <span className="text-[10px] text-purple-400 font-mono">Confirmed reservations</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-emerald-500/30 bg-[#12141C]/80">
          <div>
            <p className="text-xs text-gray-400 font-sans">Avg Ticket Value</p>
            <p className="text-2xl font-serif font-bold text-[#D4AF37]">${avgOrderValue.toFixed(2)}</p>
            <span className="text-[10px] text-emerald-400 font-mono">High-tier dining average</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Top Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4 bg-[#12141C]/80 border border-[#D4AF37]/20">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-serif text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" /> Live Orders Queue
            </h3>
            <Link to="/admin/orders" className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#D4AF37] text-sm">{o.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-semibold uppercase text-[10px]">
                      {o.orderType}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    {o.items.length} item(s) • {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#F4F1EA] text-sm block">
                    ${o.totalAmount.toFixed(2)}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    o.orderStatus === 'COMPLETED' ? 'text-emerald-400' : 'text-[#D4AF37]'
                  }`}>
                    {o.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Dishes */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 bg-[#12141C]/80 border border-[#D4AF37]/20">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-serif text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#D4AF37]" /> Top Selling Dishes
            </h3>
            <Link to="/admin/menu" className="text-xs text-[#D4AF37] hover:underline font-semibold">
              Menu
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {topDishes.map((dish, idx) => (
              <div key={dish.dishId} className="glass-card p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold font-mono text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-[#F4F1EA] truncate max-w-[140px]">{dish.name}</h4>
                    <p className="text-[10px] text-gray-400">{dish.category}</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[#D4AF37] font-bold block">${dish.revenue.toFixed(2)}</span>
                  <span className="text-gray-400 text-[10px]">{dish.unitsSold} sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Table Reservations Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 bg-[#12141C]/80 border border-[#D4AF37]/20">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="font-serif text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D4AF37]" /> Today's Table Reservations
          </h3>
          <Link to="/admin/reservations" className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
            Manage Reservations <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayReservations.map((res) => (
            <div key={res.id} className="glass-card p-4 rounded-xl space-y-2 text-xs border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-[#D4AF37] text-sm block">{res.bookingReference}</span>
                  <h4 className="font-serif font-bold text-[#F4F1EA]">{res.guestName}</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px]">
                  {res.status}
                </span>
              </div>
              <div className="flex justify-between text-gray-400 text-[11px] pt-2 border-t border-white/5 font-mono">
                <span>{res.reservationTime} • {res.partySize} Guests</span>
                <span>{res.seatingSection}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
