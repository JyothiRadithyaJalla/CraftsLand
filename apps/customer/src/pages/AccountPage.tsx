import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { useOrders } from '@shared/hooks/useOrders';
import { ReservationService } from '@shared/services/reservationService';
import type { Reservation } from '@shared/types/reservation';
import { MetaTags } from '@shared/components/MetaTags';
import { SEATING_SECTIONS } from '@shared/config/constants';
import { formatPrice } from '@shared/utils/formatters';
import { User, Shield, ShoppingBag, Clock, ArrowRight, Calendar, Users, XCircle, LogOut } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState<boolean>(true);

  // If unauthenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const fetchReservations = async () => {
    if (!user) return;
    setLoadingReservations(true);
    const list = await ReservationService.getCustomerReservations(user.id, user.email);
    setReservations(list);
    setLoadingReservations(false);
  };

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const handleCancelReservation = async (id: string) => {
    if (window.confirm('Are you sure you wish to cancel this table reservation?')) {
      const success = await ReservationService.cancelReservation(id);
      if (success) {
        await fetchReservations();
      }
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-[#182019]">
      <MetaTags title="Guest Account | Aura" />

      {/* Account Info */}
      <div className="bg-white p-8 rounded-2xl space-y-6 border border-[#DDD9CB] shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DDD9CB] pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#31543A]/10 text-[#31543A] border border-[#31543A]/20 flex items-center justify-center font-bold text-xl">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#182019]">{user?.fullName || 'Distinguished Guest'}</h1>
              <p className="text-xs text-[#626F64]">{user?.email || 'guest@aura.com'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl border border-[#DDD9CB] bg-white hover:border-[#31543A]/40 text-[#3A453C] hover:text-[#31543A] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-[#626F64]">
          <span>Assigned Permission Role:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold text-[#31543A] bg-[#31543A]/10 px-3 py-1 rounded-full border border-[#31543A]/20">
            <Shield className="w-3.5 h-3.5" /> {role}
          </span>
        </div>
      </div>

      {/* Table Reservations Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl font-bold text-[#182019] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#31543A]" /> Your Table Reservations
          </h2>
          <Link
            to="/reservation"
            className="text-xs text-[#31543A] hover:underline font-bold flex items-center gap-1"
          >
            + Book Table
          </Link>
        </div>

        {loadingReservations ? (
          <div className="text-xs text-[#626F64] py-4 animate-pulse">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center space-y-2 border border-[#DDD9CB] shadow-xs">
            <p className="text-sm text-[#626F64] font-serif">No table bookings recorded under your profile.</p>
            <Link to="/reservation" className="text-xs text-[#31543A] hover:underline font-semibold">
              Reserve a table for tonight
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((res) => {
              const sectionObj = SEATING_SECTIONS.find((s) => s.id === res.seatingSection);
              return (
                <div key={res.id} className="bg-white p-4 rounded-xl flex items-center justify-between gap-4 border border-[#DDD9CB] shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#31543A] text-sm">{res.bookingReference}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${
                        res.status === 'CONFIRMED'
                          ? 'bg-[#31543A]/10 text-[#31543A] border border-[#31543A]/30 font-bold'
                          : res.status === 'SEATED'
                          ? 'bg-[#78956A]/15 text-[#31543A] border border-[#78956A]/30'
                          : res.status === 'COMPLETED'
                          ? 'bg-[#31543A]/10 text-[#31543A] border border-[#31543A]/20'
                          : 'bg-[#A8382B]/10 text-[#A8382B] border border-[#A8382B]/20'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#626F64] flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#31543A]" /> {res.reservationDate} at {res.reservationTime}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#31543A]" /> {res.partySize} Guests</span>
                    </p>
                    <p className="text-[11px] text-[#626F64]">{sectionObj?.name || res.seatingSection}</p>
                  </div>

                  {res.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="px-3 py-1.5 rounded-xl border border-[#A8382B]/30 text-[#A8382B] hover:bg-[#A8382B]/10 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
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
        <h2 className="font-serif text-2xl font-bold text-[#182019] flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#31543A]" /> Recent Dining Orders
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center space-y-2 border border-[#DDD9CB] shadow-xs">
            <p className="text-sm text-[#626F64] font-serif">No order tickets recorded on your account yet.</p>
            <Link to="/menu" className="text-xs text-[#31543A] hover:underline font-semibold">
              Explore our reserve menu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white p-4 rounded-xl flex items-center justify-between gap-4 border border-[#DDD9CB] shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#31543A] text-sm">{ord.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F3] border border-[#DDD9CB] text-[#3A453C] uppercase font-semibold">
                      {ord.orderType}
                    </span>
                  </div>
                  <p className="text-xs text-[#626F64] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#31543A]" />
                    {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#182019] block">
                      {formatPrice(ord.totalAmount)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      ord.orderStatus === 'COMPLETED'
                        ? 'text-[#31543A]'
                        : ord.orderStatus === 'CANCELLED'
                        ? 'text-[#A8382B]'
                        : 'text-[#78956A]'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <Link
                    to={`/order/${ord.id}`}
                    className="p-2 rounded-xl bg-[#31543A]/10 text-[#31543A] hover:bg-[#31543A] hover:text-white transition-colors cursor-pointer border border-[#31543A]/20"
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
