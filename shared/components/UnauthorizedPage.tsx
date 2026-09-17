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
    <div className="min-h-screen bg-[#FAF9F5] text-[#111A15] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl border border-[#E2E8E0] bg-white text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#111A15]">Access Denied</h1>
          <p className="text-xs text-[#5C6E63]">
            You do not have the required security credentials to access the <strong>{appName}</strong>.
          </p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#E2E8E0] p-4 rounded-xl text-xs space-y-1.5 font-mono text-left">
          <div className="flex justify-between">
            <span className="text-[#5C6E63]">Authenticated User:</span>
            <span className="text-[#111A15] font-bold">{user?.fullName || user?.email || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5C6E63]">Your Current Role:</span>
            <span className="text-[#15803D] font-bold">{role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5C6E63]">Required Role:</span>
            <span className="text-[#14532D] font-bold">{requiredRole}</span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full min-h-[44px] py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Session
        </button>
      </div>
    </div>
  );
};

