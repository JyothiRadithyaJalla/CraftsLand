import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { ReservationService } from '@shared/services/reservationService';
import { supabase } from '@shared/services/supabaseClient';
import type { Reservation, ReservationStatus } from '@shared/types/reservation';
import { SEATING_SECTIONS } from '@shared/config/constants';
import { Search, RefreshCw } from 'lucide-react';

export const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');

  const loadReservations = async () => {
    setLoading(true);
    const list = await ReservationService.getReservations();
    setReservations(list);
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();

    // Subscribe to realtime reservations updates
    const channel = supabase
      .channel('admin_reservations_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          loadReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (sectionFilter !== 'ALL' && r.seatingSection !== sectionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = r.bookingReference.toLowerCase().includes(q);
      const matchGuest = r.guestName.toLowerCase().includes(q);
      const matchEmail = r.guestEmail.toLowerCase().includes(q);
      if (!matchRef && !matchGuest && !matchEmail) return false;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    await ReservationService.updateReservationStatus(id, newStatus);
    await loadReservations();
  };

  return (
    <AdminLayout>
      <MetaTags title="Reservations Control | Craftsland Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D8D2] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F172A]">Table Reservations Suite</h1>
          <p className="text-xs text-slate-500 font-medium">Manage seating section allocations, guest check-ins, and booking status</p>
        </div>
        <button
          onClick={() => loadReservations()}
          className="px-4 py-2.5 rounded-xl border border-[#D8D8D2] bg-white text-[#0F172A] hover:bg-[#F4F4F1] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Bookings
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs border border-[#D8D8D2] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#0F172A] transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SEATED">SEATED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO_SHOW</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Seating Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#0F172A] transition-colors"
            >
              <option value="ALL">All Sections</option>
              {SEATING_SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking #, guest, or email..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] transition-colors font-medium"
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D8D8D2] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D8D8D2] text-slate-600 uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Reference #</th>
                <th className="p-4">Guest Info</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Party Size</th>
                <th className="p-4">Seating Section</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-mono animate-pulse">
                    Loading table reservations...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-serif text-sm">
                    No table reservations match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const sectionObj = SEATING_SECTIONS.find((s) => s.id === res.seatingSection);
                  return (
                    <tr key={res.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#0F172A]">{res.bookingReference}</td>
                      <td className="p-4">
                        <span className="font-serif font-bold text-[#0F172A] text-sm block">{res.guestName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{res.guestEmail} • {res.guestPhone}</span>
                        {res.specialRequests && (
                          <p className="text-[10px] text-slate-600 italic mt-0.5 max-w-xs truncate">
                            "{res.specialRequests}"
                          </p>
                        )}
                      </td>
                      <td className="p-4 font-mono text-slate-500">
                        <span className="block font-bold text-[#0F172A]">{res.reservationDate}</span>
                        <span className="text-slate-600">{res.reservationTime}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#0F172A]">{res.partySize} Guests</td>
                      <td className="p-4 font-mono text-slate-600">{sectionObj?.name || res.seatingSection}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-bold ${
                          res.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : res.status === 'CONFIRMED'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : res.status === 'SEATED'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : res.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : res.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {res.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={res.status}
                          onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatus)}
                          className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#0F172A] transition-colors"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SEATED">SEATED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="NO_SHOW">NO_SHOW</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
