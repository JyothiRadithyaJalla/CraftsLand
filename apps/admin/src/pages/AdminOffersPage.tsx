import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { Plus, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react';

interface PromoOffer {
  id: string;
  code: string;
  discountPercent: number;
  activeFrom: string;
  activeTo: string;
  isActive: boolean;
}

export const AdminOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<PromoOffer[]>([
    {
      id: 'off-1',
      code: 'LETOILE15',
      discountPercent: 15,
      activeFrom: '2026-09-01',
      activeTo: '2026-12-31',
      isActive: true,
    },
    {
      id: 'off-2',
      code: 'VIPRESERVE20',
      discountPercent: 20,
      activeFrom: '2026-09-10',
      activeTo: '2026-10-31',
      isActive: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newActiveFrom, setNewActiveFrom] = useState<string>('2026-09-10');
  const [newActiveTo, setNewActiveTo] = useState<string>('2026-12-31');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const formattedCode = newCode.trim().toUpperCase();
    if (!formattedCode) {
      setErrorMsg('Promo code string is required.');
      return;
    }

    if (newDiscount <= 0 || newDiscount > 100) {
      setErrorMsg('Discount percentage must be greater than 0% and less than or equal to 100%.');
      return;
    }

    if (offers.some((o) => o.code === formattedCode)) {
      setErrorMsg(`Promo code "${formattedCode}" already exists.`);
      return;
    }

    const created: PromoOffer = {
      id: `off-${Date.now()}`,
      code: formattedCode,
      discountPercent: newDiscount,
      activeFrom: newActiveFrom,
      activeTo: newActiveTo,
      isActive: true,
    };

    setOffers([created, ...offers]);
    setIsModalOpen(false);
    setNewCode('');
  };

  return (
    <AdminLayout>
      <MetaTags title="Offers & Promo Codes | L'Étoile Noir Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Promo Codes & Offers</h1>
          <p className="text-xs text-gray-400">Configure promotional discounts and validity dates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Create Promo Code
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#12141C]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0C10] border-b border-white/10 text-gray-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Promo Code</th>
                <th className="p-4">Discount %</th>
                <th className="p-4">Validity Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {offers.map((off) => (
                <tr key={off.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#D4AF37] text-sm">{off.code}</td>
                  <td className="p-4 font-mono font-bold text-[#F4F1EA]">{off.discountPercent}% OFF</td>
                  <td className="p-4 font-mono text-gray-400">
                    {off.activeFrom} to {off.activeTo}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold font-mono ${
                      off.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {off.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleActive(off.id)}
                      className={`px-3 py-1 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ml-auto ${
                        off.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {off.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {off.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0C10]/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateOffer}
            className="glass-panel w-full max-w-md bg-[#12141C] border border-[#D4AF37]/30 rounded-3xl p-6 space-y-4 text-[#F4F1EA]"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-gold-gradient">Create Promo Code</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-950/40 border border-red-500/40 p-3 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Promo Code *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. LUXURY25"
                  className="w-full bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Discount Percentage (1 - 100%) *</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(Number(e.target.value) || 10)}
                  className="w-full bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Active From</label>
                  <input
                    type="date"
                    value={newActiveFrom}
                    onChange={(e) => setNewActiveFrom(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Active To</label>
                  <input
                    type="date"
                    value={newActiveTo}
                    onChange={(e) => setNewActiveTo(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-full border border-white/15 text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:opacity-90"
              >
                Create Code
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
