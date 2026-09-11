import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';

export const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Guest Login | Craftsland" />
      <div className="bg-white p-8 rounded-2xl space-y-6 border border-[#E5E5E5] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-red-gradient">Guest Login</h1>
          <p className="text-xs text-gray-500">Access your dining history and table reservations</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Email Address</label>
            <input type="email" required placeholder="guest@craftsland.com" className="w-full px-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#B11226] rounded-lg text-[#171717] outline-none" />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Password</label>
            <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#B11226] rounded-lg text-[#171717] outline-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold uppercase tracking-wider text-xs shadow-md hover:brightness-110 transition-all">
            Authenticate
          </button>
        </form>
        <div className="text-center text-xs text-gray-500 pt-2 flex justify-between">
          <Link to="/forgot-password" className="hover:text-[#B11226]">Forgot Password?</Link>
          <Link to="/register" className="hover:text-[#B11226]">Create Account</Link>
        </div>
      </div>
    </div>
  );
};
