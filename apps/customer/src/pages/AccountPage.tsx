import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { useOrders } from '@shared/hooks/useOrders';
import { ReservationService } from '@shared/services/reservationService';
import type { Reservation } from '@shared/types/reservation';
import { MetaTags } from '@shared/components/MetaTags';
import { SEATING_SECTIONS } from '@shared/config/constants';
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
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-[#F5EFE5]">
      <MetaTags title="Guest Account | Craftsland" />

      {/* Account Info */}
      <div className="bg-[#211B16] p-8 rounded-2xl space-y-6 border border-[#3A3027] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#3A3027] pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#B84A32]/15 text-[#B84A32] flex items-center justify-center font-bold text-xl">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#F5EFE5]">{user?.fullName || 'Distinguished Guest'}</h1>
              <p className="text-xs text-[#B8AEA1]">{user?.email || 'guest@craftsland.com'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-full border border-[#3A3027] bg-[#171310] hover:border-[#B84A32] text-[#B8AEA1] hover:text-[#B84A32] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-[#B8AEA1]">
          <span>Assigned Permission Role:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold text-[#B84A32] bg-[#B84A32]/15 px-3 py-1 rounded-full border border-[#B84A32]/30">
            <Shield className="w-3.5 h-3.5" /> {role}
          </span>
        </div>
      </div>

      {/* Table Reservations Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl font-bold text-[#F5EFE5] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B84A32]" /> Your Table Reservations
          </h2>
          <Link
            to="/reservation"
            className="text-xs text-[#B84A32] hover:underline font-semibold flex items-center gap-1"
          >
            + Book Table
          </Link>
        </div>

        {loadingReservations ? (
          <div className="text-xs text-[#B8AEA1] py-4 animate-pulse">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="bg-[#211B16] p-6 rounded-xl text-center space-y-2 border border-[#3A3027] shadow-sm">
            <p className="text-sm text-[#B8AEA1] font-serif">No table bookings recorded under your profile.</p>
            <Link to="/reservation" className="text-xs text-[#B84A32] hover:underline font-semibold">
              Reserve a table for tonight
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((res) => {
              const sectionObj = SEATING_SECTIONS.find((s) => s.id === res.seatingSection);
              return (
                <div key={res.id} className="bg-[#211B16] p-4 rounded-xl flex items-center justify-between gap-4 border border-[#3A3027] shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#B84A32] text-sm">{res.bookingReference}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${
                        res.status === 'CONFIRMED'
                          ? 'bg-[#B84A32]/20 text-[#B84A32]'
                          : res.status === 'SEATED'
                          ? 'bg-blue-950/40 text-blue-400 border border-blue-900/50'
                          : res.status === 'COMPLETED'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50'
                          : 'bg-red-950/40 text-red-400 border border-red-900/50'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#B8AEA1] flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#B84A32]" /> {res.reservationDate} at {res.reservationTime}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#B84A32]" /> {res.partySize} Guests</span>
                    </p>
                    <p className="text-[11px] text-[#B8AEA1]">{sectionObj?.name || res.seatingSection}</p>
                  </div>

                  {res.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-950/40 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
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
        <h2 className="font-serif text-2xl font-bold text-[#F5EFE5] flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#B84A32]" /> Recent Dining Orders
        </h2>

        {orders.length === 0 ? (
          <div className="bg-[#211B16] p-6 rounded-xl text-center space-y-2 border border-[#3A3027] shadow-sm">
            <p className="text-sm text-[#B8AEA1] font-serif">No order tickets recorded on your account yet.</p>
            <Link to="/menu" className="text-xs text-[#B84A32] hover:underline font-semibold">
              Explore our reserve menu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-[#211B16] p-4 rounded-xl flex items-center justify-between gap-4 border border-[#3A3027] shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#B84A32] text-sm">{ord.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#171310] border border-[#3A3027] text-[#B8AEA1] uppercase font-semibold">
                      {ord.orderType}
                    </span>
                  </div>
                  <p className="text-xs text-[#B8AEA1] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#B84A32]" />
                    {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#F5EFE5] block">
                      ${ord.totalAmount.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      ord.orderStatus === 'COMPLETED'
                        ? 'text-emerald-400'
                        : ord.orderStatus === 'CANCELLED'
                        ? 'text-red-400'
                        : 'text-[#B84A32]'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <Link
                    to={`/order/${ord.id}`}
                    className="p-2 rounded-lg bg-[#B84A32]/15 text-[#B84A32] hover:bg-[#B84A32] hover:text-white transition-colors cursor-pointer"
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
