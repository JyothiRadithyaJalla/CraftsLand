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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD9CB] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#182019]">Private Event Requests</h1>
          <p className="text-xs text-[#626F64] font-medium">VIP Private Vault and Garden Terrace special event inquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#DDD9CB] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] border-b border-[#DDD9CB] text-[#3A453C] uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Requester</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Requested Date</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Message / Notes</th>
                <th className="p-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CB]">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                  <td className="p-4">
                    <span className="font-serif font-bold text-[#182019] text-sm block">{inq.requesterName}</span>
                    <span className="text-[11px] text-[#626F64] font-mono">{inq.email} • {inq.phone}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-[#182019]">{inq.eventType}</td>
                  <td className="p-4 font-mono text-[#626F64]">{inq.eventDate}</td>
                  <td className="p-4 font-mono font-bold text-[#182019]">{inq.guestCount} Guests</td>
                  <td className="p-4 max-w-xs text-[#3A453C] italic font-serif">"{inq.message}"</td>
                  <td className="p-4 text-right">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as EventInquiry['status'])}
                      className="bg-[#FAF8F3] border border-[#DDD9CB] rounded-lg px-2.5 py-1 text-xs text-[#182019] font-medium focus:outline-none focus:border-[#31543A] transition-colors"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="DECLINED">DECLINED</option>
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
