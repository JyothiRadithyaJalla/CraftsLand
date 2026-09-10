import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { ReservationService } from '@shared/services/reservationService';
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
    if (newStatus === 'CANCELLED') {
      await ReservationService.cancelReservation(id);
    } else {
      if (envIsDevelopmentMock(id, newStatus)) {
        const res = reservations.find((r) => r.id === id);
        if (res) res.status = newStatus;
      }
    }
    await loadReservations();
  };

  const envIsDevelopmentMock = (id: string, newStatus: ReservationStatus) => {
    const res = reservations.find((r) => r.id === id);
    if (res) {
      res.status = newStatus;
      return true;
    }
    return false;
  };

  return (
    <AdminLayout>
      <MetaTags title="Reservations Control | L'Étoile Noir Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Table Reservations Suite</h1>
          <p className="text-xs text-gray-400">Manage seating section allocations, guest check-ins, and booking status</p>
        </div>
        <button
          onClick={() => loadReservations()}
          className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Bookings
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs bg-[#12141C]/80">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SEATED">SEATED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold">Seating Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
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
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking #, guest, or email..."
            className="w-full bg-[#0B0C10] border border-white/15 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#12141C]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0C10] border-b border-white/10 text-gray-400 uppercase text-[10px] font-mono">
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
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 font-mono animate-pulse">
                    Loading table reservations...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-serif text-sm">
                    No table reservations match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const sectionObj = SEATING_SECTIONS.find((s) => s.id === res.seatingSection);
                  return (
                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#D4AF37]">{res.bookingReference}</td>
                      <td className="p-4">
                        <span className="font-serif font-bold text-[#F4F1EA] text-sm block">{res.guestName}</span>
                        <span className="text-[11px] text-gray-400 font-mono">{res.guestEmail} • {res.guestPhone}</span>
                        {res.specialRequests && (
                          <p className="text-[10px] text-[#D4AF37] italic mt-0.5 max-w-xs truncate">
                            "{res.specialRequests}"
                          </p>
                        )}
                      </td>
                      <td className="p-4 font-mono text-gray-300">
                        <span className="block font-bold text-[#F4F1EA]">{res.reservationDate}</span>
                        <span className="text-[#D4AF37]">{res.reservationTime}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#F4F1EA]">{res.partySize} Guests</td>
                      <td className="p-4 font-mono text-gray-300">{sectionObj?.name || res.seatingSection}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-bold ${
                          res.status === 'CONFIRMED'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                            : res.status === 'SEATED'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : res.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={res.status}
                          onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatus)}
                          className="bg-[#0B0C10] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SEATED">SEATED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
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
