import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UnauthorizedPageProps {
  appName: string;
  requiredRole: string;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ appName, requiredRole }) => {
  const { user, role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0D0B09] text-[#F5EFE5] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl border border-[#3A3027] bg-[#211B16] text-center space-y-6 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-[#B84A32]/10 border border-[#B84A32]/25 text-[#B84A32] flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-red-gradient">Access Denied</h1>
          <p className="text-xs text-[#B8AEA1]">
            You do not have the required security credentials to access the <strong>{appName}</strong>.
          </p>
        </div>

        <div className="bg-[#171310] border border-[#3A3027] p-4 rounded-xl text-xs space-y-1.5 font-mono text-left">
          <div className="flex justify-between">
            <span className="text-[#B8AEA1]">Authenticated User:</span>
            <span className="text-[#F5EFE5] font-bold">{user?.fullName || user?.email || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B8AEA1]">Your Current Role:</span>
            <span className="text-[#B84A32] font-bold">{role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#B8AEA1]">Required Role:</span>
            <span className="text-emerald-400 font-bold">{requiredRole}</span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#B84A32] to-[#8B3525] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Session
        </button>
      </div>
    </div>
  );
};

