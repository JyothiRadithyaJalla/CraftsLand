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
    <div className="min-h-screen bg-[#171310] text-[#F5EFE5] flex items-center justify-center p-4">
      <MetaTags title="Admin Authentication | Craftsland" />
      <div className="bg-[#211B16] max-w-md w-full p-8 rounded-3xl border border-[#3A3027] space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#B84A32]/15 border border-[#B84A32]/30 text-[#C85A3A] flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-red-gradient">Admin Command Portal</h1>
          <p className="text-xs text-[#B8AEA1]">Executive staff access strictly enforced via Supabase RLS</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[#B8AEA1] font-semibold">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@craftsland.com"
              className="w-full px-4 py-2.5 bg-[#171310] border border-[#3A3027] rounded-xl text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#B8AEA1] font-semibold">Passkey</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#171310] border border-[#3A3027] rounded-xl text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C85A3A] via-[#B84A32] to-[#8B3525] text-[#F5EFE5] font-bold uppercase tracking-wider text-xs shadow-lg hover:brightness-110 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isSubmitting ? 'Authenticating...' : 'Authenticate Session'}
          </button>
        </form>
      </div>
    </div>
  );
};
