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
      <MetaTags title="Offers & Promo Codes | Craftsland Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3027] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Promo Codes & Offers</h1>
          <p className="text-xs text-[#B8AEA1]">Configure promotional discounts and validity dates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C85A3A] via-[#B84A32] to-[#8B3525] text-[#F5EFE5] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Promo Code
        </button>
      </div>

      <div className="bg-[#211B16] rounded-2xl overflow-hidden border border-[#3A3027] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171310] border-b border-[#3A3027] text-[#B8AEA1] uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Promo Code</th>
                <th className="p-4">Discount %</th>
                <th className="p-4">Validity Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3027]">
              {offers.map((off) => (
                <tr key={off.id} className="hover:bg-[#2A231C]/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#C85A3A] text-sm">{off.code}</td>
                  <td className="p-4 font-mono font-bold text-[#F5EFE5]">{off.discountPercent}% OFF</td>
                  <td className="p-4 font-mono text-[#B8AEA1]">
                    {off.activeFrom} to {off.activeTo}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold font-mono ${
                      off.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <form
            onSubmit={handleCreateOffer}
            className="bg-[#211B16] w-full max-w-md border border-[#3A3027] rounded-3xl p-6 space-y-4 text-[#F5EFE5] shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#3A3027] pb-3">
              <h3 className="font-serif text-xl font-bold text-red-gradient">Create Promo Code</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#B8AEA1] font-semibold">Promo Code *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. LUXURY25"
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 font-mono focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8AEA1] font-semibold">Discount Percentage (1 - 100%) *</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(Number(e.target.value) || 10)}
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] font-mono focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#B8AEA1] font-semibold">Active From</label>
                  <input
                    type="date"
                    value={newActiveFrom}
                    onChange={(e) => setNewActiveFrom(e.target.value)}
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] font-mono focus:outline-none focus:border-[#B84A32] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#B8AEA1] font-semibold">Active To</label>
                  <input
                    type="date"
                    value={newActiveTo}
                    onChange={(e) => setNewActiveTo(e.target.value)}
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] font-mono focus:outline-none focus:border-[#B84A32] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3A3027] text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-full border border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B8AEA1] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#C85A3A] via-[#B84A32] to-[#8B3525] text-[#F5EFE5] font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:brightness-110 transition-all"
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
