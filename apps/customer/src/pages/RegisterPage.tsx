import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';

export const RegisterPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Guest Registration | Craftsland" />
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-gold-gradient">Register Guest Account</h1>
          <p className="text-xs text-gray-400">Join our sanctuary for bespoke tasting invitations</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Full Name</label>
            <input type="text" required placeholder="Lord Sterling Vance" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Email Address</label>
            <input type="email" required placeholder="sterling@vance-holdings.com" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold uppercase tracking-wider text-xs">
            Create Profile
          </button>
        </form>
        <div className="text-center text-xs text-gray-400">
          Already registered? <Link to="/login" className="text-[#D4AF37] hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};
