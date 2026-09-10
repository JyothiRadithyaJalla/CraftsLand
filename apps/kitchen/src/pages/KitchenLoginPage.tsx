import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { MetaTags } from '@shared/components/MetaTags';
import { ChefHat, AlertCircle } from 'lucide-react';

export const KitchenLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('kitchen@craftsland.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      // In development, dev role can be KITCHEN
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F1EA] flex items-center justify-center p-4">
      <MetaTags title="Kitchen Display Authentication | Craftsland" />
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-[#D4AF37]/30 bg-[#12141C] space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gold-gradient">Kitchen Display Login</h1>
          <p className="text-xs text-gray-400">Authorized culinary staff and expeditor pass access</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 p-3 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">Kitchen Pass Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kitchen@craftsland.com"
              className="w-full px-4 py-2.5 bg-[#0B0C10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">Passkey</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#0B0C10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold uppercase tracking-wider text-xs shadow-lg hover:opacity-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying...' : 'Access Kitchen Display'}
          </button>
        </form>
      </div>
    </div>
  );
};
