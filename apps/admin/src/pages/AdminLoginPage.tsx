import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { MetaTags } from '@shared/components/MetaTags';
import { Shield, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@craftsland.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await login({ email, password });
      if (result.error) {
        setError(result.error);
        return;
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] flex items-center justify-center p-4">
      <MetaTags title="Admin Authentication | Craftsland" />
      <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#E5E5E5] space-y-6 shadow-md">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#B11226]/10 border border-[#B11226]/20 text-[#B11226] flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-red-gradient">Admin Command Portal</h1>
          <p className="text-xs text-gray-500">Executive staff access strictly enforced via Supabase RLS</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-700 font-semibold">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@craftsland.com"
              className="w-full px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-[#171717] focus:outline-none focus:border-[#B11226]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700 font-semibold">Passkey</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-[#171717] focus:outline-none focus:border-[#B11226]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold uppercase tracking-wider text-xs shadow-md hover:brightness-110 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isSubmitting ? 'Authenticating...' : 'Authenticate Session'}
          </button>
        </form>
      </div>
    </div>
  );
};
