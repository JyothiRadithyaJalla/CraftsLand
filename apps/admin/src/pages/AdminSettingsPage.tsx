import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { Save, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [brandName, setBrandName] = useState(RESTAURANT_BRAND.name);
  const [tagline, setTagline] = useState(RESTAURANT_BRAND.tagline);
  const [phone, setPhone] = useState(RESTAURANT_BRAND.phone);
  const [email, setEmail] = useState(RESTAURANT_BRAND.email);
  const [address, setAddress] = useState(RESTAURANT_BRAND.address);
  const [hours, setHours] = useState(RESTAURANT_BRAND.operatingHours);
  const [taxRate, setTaxRate] = useState(RESTAURANT_BRAND.defaultTaxRate * 100);
  const [deliveryFee, setDeliveryFee] = useState(RESTAURANT_BRAND.defaultDeliveryFee);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [savedMsg, setSavedMsg] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 4000);
  };

  return (
    <AdminLayout>
      <MetaTags title="Restaurant Settings | Craftsland Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B11226]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Restaurant System Settings</h1>
          <p className="text-xs text-gray-400">Configure operating parameters, concierge contacts, taxes, and store status</p>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-white p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Restaurant system settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl space-y-6 border border-[#B11226]/20 bg-[#FFFFFF]/80 max-w-3xl">
        {/* Store Open / Closed Override */}
        <div className="flex items-center justify-between bg-[#FAFAFA] p-4 rounded-2xl border border-[#E5E5E5]">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#171717]">Restaurant Operational State</h3>
            <p className="text-xs text-gray-400">Toggle whether the online ordering pass & table reservations are active</p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer transition-all ${
              isOpen
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {isOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {isOpen ? 'STORE OPEN' : 'STORE CLOSED'}
          </button>
        </div>

        {/* Brand Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2">
            Brand Identity & Concierge Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Restaurant Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B11226]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B11226]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Concierge Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B11226]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Concierge Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B11226]"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-gray-300 font-semibold">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B11226]"
            />
          </div>
        </div>

        {/* Financial & Financial Config */}
        <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
          <h3 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2">
            Tax Rates & Logistics Fees
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] font-mono focus:outline-none focus:border-[#B11226]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Delivery Fee ($ USD)</label>
              <input
                type="number"
                step="0.5"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] font-mono focus:outline-none focus:border-[#B11226]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Operating Hours</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B11226]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg hover:opacity-90"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
