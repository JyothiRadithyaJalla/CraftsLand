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
      const result = await login({ email, password });
      if (result.error) {
        setError(result.error);
        return;
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF3F3] text-[#0F2424] flex items-center justify-center p-4">
      <MetaTags title="Kitchen Display Authentication | Craftsland" />
      <div className="bg-white max-w-md w-full p-8 rounded-3xl border-2 border-[#CBD8D8] space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#E0EBEB] border border-[#CBD8D8] text-[#0D474A] flex items-center justify-center mx-auto shadow-xs">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0D474A]">Kitchen Display Login</h1>
          <p className="text-xs text-slate-500 font-medium">Authorized culinary staff and expeditor pass access</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-600 font-bold uppercase text-[10px] tracking-wider">Kitchen Pass Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kitchen@craftsland.com"
              className="w-full px-4 py-2.5 bg-[#F4F8F8] border border-[#CBD8D8] rounded-xl text-[#0F2424] placeholder-slate-400 focus:outline-none focus:border-[#0D474A] transition-colors font-medium"
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
              className="w-full px-4 py-2.5 bg-[#F4F8F8] border border-[#CBD8D8] rounded-xl text-[#0F2424] placeholder-slate-400 focus:outline-none focus:border-[#0D474A] transition-colors font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#0D474A] hover:bg-[#0A3638] text-white font-bold uppercase tracking-wider text-xs shadow-md cursor-pointer disabled:opacity-50 transition-all min-h-[48px]"
          >
            {isSubmitting ? 'Verifying...' : 'Access Kitchen Display'}
          </button>
        </form>
      </div>
    </div>
  );
};
