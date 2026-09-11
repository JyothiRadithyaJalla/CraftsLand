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
      <div className="bg-white p-8 rounded-2xl space-y-6 border border-[#E5E5E5] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-red-gradient">Guest Login</h1>
          <p className="text-xs text-[#6B6B6B]">Access your dining history and table reservations</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-red-600 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#171717] mb-1 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@craftsland.com"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#B11226] rounded-lg text-[#171717] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#171717] mb-1 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#B11226] rounded-lg text-[#171717] outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold uppercase tracking-wider text-xs shadow-md hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
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

        <div className="text-center text-xs text-[#6B6B6B] pt-2 flex justify-between">
          <Link to="/forgot-password" className="hover:text-[#B11226] transition-colors">
            Forgot Password?
          </Link>
          <Link to="/register" className="hover:text-[#B11226] font-semibold transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

