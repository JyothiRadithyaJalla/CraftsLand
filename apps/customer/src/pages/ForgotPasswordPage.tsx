import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Password Recovery | Craftsland" />
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-gold-gradient">Recover Credentials</h1>
          <p className="text-xs text-gray-400">Enter your email to receive a password reset magic link</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Registered Email</label>
            <input type="email" required placeholder="guest@craftsland.com" className="w-full px-4 py-2.5 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold uppercase tracking-wider text-xs">
            Send Reset Link
          </button>
        </form>
        <div className="text-center text-xs text-gray-400">
          <Link to="/login" className="text-[#D4AF37] hover:underline">Return to Login</Link>
        </div>
      </div>
    </div>
  );
};
