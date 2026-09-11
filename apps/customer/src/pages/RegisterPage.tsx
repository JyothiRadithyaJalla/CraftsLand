import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { useAuth } from '@shared/hooks/useAuth';
import { AlertCircle, CheckCircle2, Lock, Mail, User, Phone, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Register with Supabase Auth (Notice: role is never accepted from client)
      const result = await register({
        email,
        password,
        fullName,
        phone: phone || undefined,
      });

      if (result.error) {
        setErrorMsg(result.error);
        return;
      }

      if (result.requiresEmailVerification) {
        setSuccessNotice('Registration successful! Please check your email to verify your account.');
      } else {
        navigate('/account', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Guest Registration | Craftsland" />
      <div className="bg-white p-8 rounded-2xl space-y-6 border border-[#E5E5E5] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-red-gradient">Register Guest Account</h1>
          <p className="text-xs text-[#6B6B6B]">Join our culinary community for reservations and ordering</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-red-600 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-700 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#171717] mb-1 font-semibold">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lady Genevieve Sterling"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#B11226] rounded-lg text-[#171717] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#171717] mb-1 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="genevieve@craftsland.com"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#B11226] rounded-lg text-[#171717] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#171717] mb-1 font-semibold">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-234-5678"
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
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Profile...
              </>
            ) : (
              'Create Profile'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#6B6B6B]">
          Already registered?{' '}
          <Link to="/login" className="text-[#B11226] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

