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
    <div className="min-h-screen bg-[#F4F4F1] text-[#0F172A] flex items-center justify-center p-4">
      <MetaTags title="Admin Authentication | Craftsland" />
      <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#D8D8D2] space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-[#CBD5E1] text-[#0F172A] flex items-center justify-center mx-auto shadow-xs">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0F172A]">Admin Command Portal</h1>
          <p className="text-xs text-slate-500 font-medium">Executive staff access strictly enforced via Supabase RLS</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-600 font-bold uppercase text-[10px] tracking-wider">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@craftsland.com"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] transition-colors font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-600 font-bold uppercase text-[10px] tracking-wider">Passkey</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] transition-colors font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold uppercase tracking-wider text-xs shadow-md cursor-pointer disabled:opacity-50 transition-all min-h-[48px]"
          >
            {isSubmitting ? 'Authenticating...' : 'Authenticate Session'}
          </button>
        </form>
      </div>
    </div>
  );
};
