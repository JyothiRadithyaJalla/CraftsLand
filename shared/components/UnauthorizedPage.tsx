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
    <div className="min-h-screen bg-[#F7F4EC] text-[#182019] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl border border-[#DDD9CB] bg-white text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#FCEBE9] border border-[#DDD9CB] text-[#A8382B] flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#182019]">Access Denied</h1>
          <p className="text-xs text-[#626F64]">
            You do not have the required security credentials to access the <strong>{appName}</strong>.
          </p>
        </div>

        <div className="bg-[#F7F4EC] border border-[#DDD9CB] p-4 rounded-xl text-xs space-y-1.5 font-mono text-left">
          <div className="flex justify-between">
            <span className="text-[#626F64]">Authenticated User:</span>
            <span className="text-[#182019] font-bold">{user?.fullName || user?.email || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#626F64]">Your Current Role:</span>
            <span className="text-[#31543A] font-bold">{role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#626F64]">Required Role:</span>
            <span className="text-[#26432E] font-bold">{requiredRole}</span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full min-h-[44px] py-3 rounded-xl bg-[#31543A] hover:bg-[#26432E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Session
        </button>
      </div>
    </div>
  );
};

