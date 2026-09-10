import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MetaTags } from '../../components/common/MetaTags';
import { User, Shield } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <MetaTags title="Guest Account | L'Étoile Noir" />
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-4 border-b border-[#D4AF37]/20 pb-4">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#F4F1EA]">{user?.fullName || 'Distinguished Guest'}</h1>
            <p className="text-xs text-gray-400">{user?.email || 'guest@letoilenoir.com'}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span>Assigned Permission Role:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            <Shield className="w-3.5 h-3.5" /> {role}
          </span>
        </div>
      </div>
    </div>
  );
};
