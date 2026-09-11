import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Password Recovery | Craftsland" />
      <div className="bg-white p-8 rounded-2xl space-y-6 border border-[#E5E5E5] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-red-gradient">Recover Credentials</h1>
          <p className="text-xs text-gray-500">Enter your email to receive a password reset link</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Registered Email</label>
            <input type="email" required placeholder="guest@craftsland.com" className="w-full px-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#B11226] rounded-lg text-[#171717] outline-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold uppercase tracking-wider text-xs shadow-md hover:brightness-110 transition-all">
            Send Reset Link
          </button>
        </form>
        <div className="text-center text-xs text-gray-500">
          <Link to="/login" className="text-[#B11226] hover:underline">Return to Login</Link>
        </div>
      </div>
    </div>
  );
};
