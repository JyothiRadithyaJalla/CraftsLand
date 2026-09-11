import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { useAuth } from '@shared/hooks/useAuth';
import { AlertCircle, CheckCircle2, Mail, Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);
    setIsSubmitting(true);

    try {
      const result = await resetPassword(email);
      if (!result.success) {
        setErrorMsg(result.error || 'Failed to send recovery link.');
      } else {
        setSuccessNotice('A recovery link has been dispatched to your email address.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <MetaTags title="Password Recovery | Craftsland" />
      <div className="bg-[#211B16] p-8 rounded-2xl space-y-6 border border-[#3A3027] shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#F5EFE5]">Recover Credentials</h1>
          <p className="text-xs text-[#B8AEA1]">Enter your email to receive a password recovery link</p>
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
            <label className="block text-[#F5EFE5] mb-1 font-semibold">Registered Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B8AEA1] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@craftsland.com"
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
                <Loader2 className="w-4 h-4 animate-spin" /> Dispatching...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#B8AEA1]">
          <Link to="/login" className="text-[#B84A32] font-semibold hover:underline">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

