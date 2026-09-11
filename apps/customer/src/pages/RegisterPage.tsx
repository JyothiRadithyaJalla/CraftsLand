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
      <div className="bg-[#211B16] p-8 rounded-2xl space-y-6 border border-[#3A3027] shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#F5EFE5]">Register Guest Account</h1>
          <p className="text-xs text-[#B8AEA1]">Join our culinary community for reservations and ordering</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-800/60 p-3.5 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-3.5 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#F5EFE5] mb-1 font-semibold">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B8AEA1] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lady Genevieve Sterling"
                className="w-full pl-9 pr-4 py-2.5 bg-[#171310] border border-[#3A3027] focus:border-[#B84A32] rounded-lg text-[#F5EFE5] placeholder:text-[#B8AEA1]/40 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F5EFE5] mb-1 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B8AEA1] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="genevieve@craftsland.com"
                className="w-full pl-9 pr-4 py-2.5 bg-[#171310] border border-[#3A3027] focus:border-[#B84A32] rounded-lg text-[#F5EFE5] placeholder:text-[#B8AEA1]/40 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F5EFE5] mb-1 font-semibold">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#B8AEA1] absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-234-5678"
                className="w-full pl-9 pr-4 py-2.5 bg-[#171310] border border-[#3A3027] focus:border-[#B84A32] rounded-lg text-[#F5EFE5] placeholder:text-[#B8AEA1]/40 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F5EFE5] mb-1 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B8AEA1] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-[#171310] border border-[#3A3027] focus:border-[#B84A32] rounded-lg text-[#F5EFE5] placeholder:text-[#B8AEA1]/40 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#B84A32] to-[#8B3525] hover:from-[#C85A3A] hover:to-[#B84A32] text-[#F5EFE5] font-bold uppercase tracking-wider text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
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

        <div className="text-center text-xs text-[#B8AEA1]">
          Already registered?{' '}
          <Link to="/login" className="text-[#B84A32] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

