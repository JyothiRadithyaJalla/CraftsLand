import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { useAuth } from '@shared/hooks/useAuth';
import { AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to account
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await login({ email, password });
      if (result.error) {
        setErrorMsg(result.error);
        return;
      }

      // Successful customer login: redirect to previous target or /account
      const from = (location.state as any)?.from?.pathname || '/account';
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Guest Login | Craftsland" />
      <div className="bg-white p-8 rounded-3xl space-y-6 border border-[#DDD9CB] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#182019]">Guest Login</h1>
          <p className="text-xs text-[#626F64]">Access your dining history and table reservations</p>
        </div>

        {errorMsg && (
          <div className="bg-[#A8382B]/10 border border-[#A8382B]/20 p-3.5 rounded-xl text-xs text-[#A8382B] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#A8382B] flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#182019] mb-1.5 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#626F64] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@craftsland.com"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F3] border border-[#DDD9CB] focus:border-[#31543A] rounded-xl text-[#182019] placeholder-[#626F64]/50 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#182019] mb-1.5 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#626F64] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F3] border border-[#DDD9CB] focus:border-[#31543A] rounded-xl text-[#182019] placeholder-[#626F64]/50 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] py-3 rounded-xl bg-[#31543A] hover:bg-[#26432E] text-white font-bold uppercase tracking-wider text-xs shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              'Authenticate'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#626F64] pt-2 flex justify-between">
          <Link to="/forgot-password" className="hover:text-[#182019] transition-colors">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-[#31543A] hover:text-[#26432E] font-semibold transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

