import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';
import { Shield } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Admin Authentication | L'Étoile Noir" />
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <Shield className="w-10 h-10 text-[#D4AF37] mx-auto" />
          <h1 className="font-serif text-2xl font-bold text-gold-gradient">Admin Command Portal</h1>
          <p className="text-xs text-gray-400">Authenticated staff access strictly enforced via Supabase RLS</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Admin Email</label>
            <input type="email" required placeholder="admin@letoilenoir.com" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Passkey</label>
            <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold uppercase tracking-wider text-xs">
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
};
