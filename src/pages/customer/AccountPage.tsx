import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { ReservationService } from '../../services/reservationService';
import type { Reservation } from '../../types/reservation';
import { MetaTags } from '../../components/common/MetaTags';
import { SEATING_SECTIONS } from '../../config/constants';
import { User, Shield, ShoppingBag, Clock, ArrowRight, Calendar, Users, XCircle } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, role } = useAuth();
  const { orders } = useOrders();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState<boolean>(true);

  const fetchReservations = async () => {
    setLoadingReservations(true);
    const list = await ReservationService.getCustomerReservations(user?.id, user?.email);
    setReservations(list);
    setLoadingReservations(false);
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const handleCancelReservation = async (id: string) => {
    if (window.confirm('Are you sure you wish to cancel this table reservation?')) {
      const success = await ReservationService.cancelReservation(id);
      if (success) {
        await fetchReservations();
      }
    }
  };

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

      {/* Table Reservations Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl font-bold text-gold-gradient flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D4AF37]" /> Your Table Reservations
          </h2>
          <Link
            to="/reservation"
            className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
          >
            + Book Table
          </Link>
        </div>

        {loadingReservations ? (
          <div className="text-xs text-gray-400 py-4 animate-pulse">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="glass-panel p-6 rounded-xl text-center space-y-2">
            <p className="text-sm text-gray-400 font-serif">No table bookings recorded under your profile.</p>
            <Link to="/reservation" className="text-xs text-[#D4AF37] hover:underline font-semibold">
              Reserve a table for tonight
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((res) => {
              const sectionObj = SEATING_SECTIONS.find((s) => s.id === res.seatingSection);
              return (
                <div key={res.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#D4AF37] text-sm">{res.bookingReference}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${
                        res.status === 'CONFIRMED'
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                          : res.status === 'SEATED'
                          ? 'bg-blue-500/20 text-blue-300'
                          : res.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#D4AF37]" /> {res.reservationDate} at {res.reservationTime}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#D4AF37]" /> {res.partySize} Guests</span>
                    </p>
                    <p className="text-[11px] text-gray-400">{sectionObj?.name || res.seatingSection}</p>
                  </div>

                  {res.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/40 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Cancel Reservation"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
