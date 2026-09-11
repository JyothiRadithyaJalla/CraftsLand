import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';


interface EventInquiry {
  id: string;
  requesterName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'DECLINED';
}

export const AdminEventsPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<EventInquiry[]>([
    {
      id: 'ev-101',
      requesterName: 'Lord Vance Holdings',
      email: 'corporate@vance.com',
      phone: '+1 555-019-2834',
      eventType: 'Private Vault Corporate Gala',
      eventDate: '2026-10-15',
      guestCount: 12,
      message: 'Exclusive tasting menu request with sommelier grand cru cellar pairing.',
      status: 'CONFIRMED',
    },
    {
      id: 'ev-102',
      requesterName: 'Lady Genevieve Du Pont',
      email: 'genevieve@dupont.com',
      phone: '+1 555-018-9921',
      eventType: 'Anniversary Banquet',
      eventDate: '2026-11-04',
      guestCount: 8,
      message: 'Private terrace seating request with customized dessert sphere presentation.',
      status: 'CONTACTED',
    },
  ]);

  const handleStatusChange = (id: string, newStatus: EventInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  return (
    <AdminLayout>
      <MetaTags title="Private Event Inquiries | Craftsland Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3027] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Private Event Requests</h1>
          <p className="text-xs text-[#B8AEA1]">VIP Private Vault and Garden Terrace special event inquiries</p>
        </div>
      </div>

      <div className="bg-[#211B16] rounded-2xl overflow-hidden border border-[#3A3027] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171310] border-b border-[#3A3027] text-[#B8AEA1] uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Requester</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Requested Date</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Message / Notes</th>
                <th className="p-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3027]">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#2A231C]/60 transition-colors">
                  <td className="p-4">
                    <span className="font-serif font-bold text-[#F5EFE5] text-sm block">{inq.requesterName}</span>
                    <span className="text-[11px] text-[#B8AEA1] font-mono">{inq.email} • {inq.phone}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-[#C85A3A]">{inq.eventType}</td>
                  <td className="p-4 font-mono text-[#B8AEA1]">{inq.eventDate}</td>
                  <td className="p-4 font-mono font-bold text-[#F5EFE5]">{inq.guestCount} Guests</td>
                  <td className="p-4 max-w-xs text-[#B8AEA1] italic font-serif">"{inq.message}"</td>
                  <td className="p-4 text-right">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as EventInquiry['status'])}
                      className="bg-[#171310] border border-[#3A3027] rounded-lg px-2.5 py-1 text-xs text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] transition-colors"
                    >
                      <option value="NEW" className="bg-[#211B16] text-[#F5EFE5]">NEW</option>
                      <option value="CONTACTED" className="bg-[#211B16] text-[#F5EFE5]">CONTACTED</option>
                      <option value="CONFIRMED" className="bg-[#211B16] text-[#F5EFE5]">CONFIRMED</option>
                      <option value="DECLINED" className="bg-[#211B16] text-[#F5EFE5]">DECLINED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
