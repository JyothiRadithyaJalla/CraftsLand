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
      <MetaTags title="Guest Registration | Aura" />
      <div className="bg-white p-8 rounded-3xl space-y-6 border border-[#DDD9CB] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#182019]">Register Guest Account</h1>
          <p className="text-xs text-[#626F64]">Join our culinary community for reservations and ordering</p>
        </div>

        {errorMsg && (
          <div className="bg-[#A8382B]/10 border border-[#A8382B]/20 p-3.5 rounded-xl text-xs text-[#A8382B] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#A8382B] flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="bg-[#FAF8F3] border border-[#31543A]/30 p-3.5 rounded-xl text-xs text-[#31543A] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#31543A] flex-shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#182019] mb-1.5 font-semibold">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#626F64] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sterling Vance"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F3] border border-[#DDD9CB] focus:border-[#31543A] rounded-xl text-[#182019] placeholder:text-[#626F64]/40 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#182019] mb-1.5 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#626F64] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sterling@aura.com"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F3] border border-[#DDD9CB] focus:border-[#31543A] rounded-xl text-[#182019] placeholder:text-[#626F64]/40 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#182019] mb-1.5 font-semibold">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#626F64] absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-234-5678"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F3] border border-[#DDD9CB] focus:border-[#31543A] rounded-xl text-[#182019] placeholder:text-[#626F64]/40 outline-none transition-colors"
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
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F3] border border-[#DDD9CB] focus:border-[#31543A] rounded-xl text-[#182019] placeholder:text-[#626F64]/40 outline-none transition-colors"
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
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Profile...
              </>
            ) : (
              'Create Profile'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#626F64]">
          Already registered?{' '}
          <Link to="/login" className="text-[#31543A] font-semibold hover:text-[#26432E] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

