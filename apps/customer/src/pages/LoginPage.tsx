import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';

export const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Guest Login | Craftsland" />
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-gold-gradient">Guest Login</h1>
          <p className="text-xs text-gray-400">Access your dining history and VIP vault reservations</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Email Address</label>
            <input type="email" required placeholder="guest@craftsland.com" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold uppercase tracking-wider text-xs">
            Authenticate
          </button>
        </form>
        <div className="text-center text-xs text-gray-400 pt-2 flex justify-between">
          <Link to="/forgot-password" className="hover:text-[#D4AF37]">Forgot Password?</Link>
          <Link to="/register" className="hover:text-[#D4AF37]">Create Account</Link>
        </div>
      </div>
    </div>
  );
};
