import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { Search } from 'lucide-react';

interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  registeredDate: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export const AdminCustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [customers] = useState<CustomerRecord[]>([
    {
      id: 'usr-1',
      fullName: 'Lord Sterling Vance',
      email: 'sterling@vance-holdings.com',
      phone: '+1 555-019-2834',
      role: 'CUSTOMER',
      registeredDate: '2025-11-14',
      ordersCount: 14,
      totalSpent: 3420.50,
      lastOrderDate: '2026-09-08',
    },
    {
      id: 'usr-2',
      fullName: 'Lady Genevieve Du Pont',
      email: 'genevieve@dupont-estate.com',
      phone: '+1 555-018-9921',
      role: 'CUSTOMER',
      registeredDate: '2026-01-20',
      ordersCount: 8,
      totalSpent: 1890.00,
      lastOrderDate: '2026-09-05',
    },
    {
      id: 'usr-3',
      fullName: 'Baron William Rothschild',
      email: 'rothschild@cellar-reserve.org',
      phone: '+1 555-017-4412',
      role: 'CUSTOMER',
      registeredDate: '2026-03-12',
      ordersCount: 21,
      totalSpent: 5640.00,
      lastOrderDate: '2026-09-09',
    },
  ]);

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <MetaTags title="Customer CRM | Craftsland Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Customer Directory & CRM</h1>
          <p className="text-xs text-gray-400">Registered patron profiles, order history totals, and lifetime value</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, or phone..."
            className="w-full bg-[#12141C] border border-white/15 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#12141C]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0C10] border-b border-white/10 text-gray-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4 text-right">Latest Dining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <span className="font-serif font-bold text-[#F4F1EA] text-sm block">{c.fullName}</span>
                    <span className="text-[10px] text-[#D4AF37] font-mono">{c.role}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-300">
                    <span className="block">{c.email}</span>
                    <span className="text-gray-400 text-[11px]">{c.phone}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{c.registeredDate}</td>
                  <td className="p-4 font-mono font-bold text-[#F4F1EA]">{c.ordersCount} orders</td>
                  <td className="p-4 font-mono font-bold text-[#D4AF37]">${c.totalSpent.toFixed(2)}</td>
                  <td className="p-4 font-mono text-gray-400 text-right">{c.lastOrderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
