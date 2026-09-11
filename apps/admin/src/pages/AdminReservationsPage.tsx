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
      <MetaTags title="Reservations Control | Craftsland Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3027] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Table Reservations Suite</h1>
          <p className="text-xs text-[#B8AEA1]">Manage seating section allocations, guest check-ins, and booking status</p>
        </div>
        <button
          onClick={() => loadReservations()}
          className="px-4 py-2.5 rounded-xl border border-[#3A3027] bg-[#171310] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B84A32] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Bookings
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#211B16] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs border border-[#3A3027] shadow-md">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#B8AEA1] uppercase font-semibold">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-1.5 text-xs text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] transition-colors"
            >
              <option value="ALL" className="bg-[#211B16] text-[#F5EFE5]">All Statuses</option>
              <option value="CONFIRMED" className="bg-[#211B16] text-[#F5EFE5]">CONFIRMED</option>
              <option value="SEATED" className="bg-[#211B16] text-[#F5EFE5]">SEATED</option>
              <option value="COMPLETED" className="bg-[#211B16] text-[#F5EFE5]">COMPLETED</option>
              <option value="CANCELLED" className="bg-[#211B16] text-[#F5EFE5]">CANCELLED</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#B8AEA1] uppercase font-semibold">Seating Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-1.5 text-xs text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] transition-colors"
            >
              <option value="ALL" className="bg-[#211B16] text-[#F5EFE5]">All Sections</option>
              {SEATING_SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id} className="bg-[#211B16] text-[#F5EFE5]">{sec.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#B8AEA1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking #, guest, or email..."
            className="w-full bg-[#171310] border border-[#3A3027] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-[#211B16] rounded-2xl overflow-hidden border border-[#3A3027] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171310] border-b border-[#3A3027] text-[#B8AEA1] uppercase text-[10px] font-mono">
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
            <tbody className="divide-y divide-[#3A3027]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#B8AEA1] font-mono animate-pulse">
                    Loading table reservations...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#B8AEA1] font-serif text-sm">
                    No table reservations match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const sectionObj = SEATING_SECTIONS.find((s) => s.id === res.seatingSection);
                  return (
                    <tr key={res.id} className="hover:bg-[#2A231C]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#C85A3A]">{res.bookingReference}</td>
                      <td className="p-4">
                        <span className="font-serif font-bold text-[#F5EFE5] text-sm block">{res.guestName}</span>
                        <span className="text-[11px] text-[#B8AEA1] font-mono">{res.guestEmail} • {res.guestPhone}</span>
                        {res.specialRequests && (
                          <p className="text-[10px] text-[#C85A3A] italic mt-0.5 max-w-xs truncate">
                            "{res.specialRequests}"
                          </p>
                        )}
                      </td>
                      <td className="p-4 font-mono text-[#B8AEA1]">
                        <span className="block font-bold text-[#F5EFE5]">{res.reservationDate}</span>
                        <span className="text-[#C85A3A]">{res.reservationTime}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#F5EFE5]">{res.partySize} Guests</td>
                      <td className="p-4 font-mono text-[#B8AEA1]">{sectionObj?.name || res.seatingSection}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-bold ${
                          res.status === 'CONFIRMED'
                            ? 'bg-[#B84A32]/20 text-[#C85A3A] border border-[#B84A32]/40'
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
                          className="bg-[#171310] border border-[#3A3027] rounded-lg px-2.5 py-1 text-xs text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] transition-colors"
                        >
                          <option value="CONFIRMED" className="bg-[#211B16] text-[#F5EFE5]">CONFIRMED</option>
                          <option value="SEATED" className="bg-[#211B16] text-[#F5EFE5]">SEATED</option>
                          <option value="COMPLETED" className="bg-[#211B16] text-[#F5EFE5]">COMPLETED</option>
                          <option value="CANCELLED" className="bg-[#211B16] text-[#F5EFE5]">CANCELLED</option>
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
