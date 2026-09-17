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
      <div className="bg-white p-8 rounded-3xl space-y-6 border border-[#DDD9CB] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#182019]">Recover Credentials</h1>
          <p className="text-xs text-[#626F64]">Enter your email to receive a password recovery link</p>
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
            <label className="block text-[#182019] mb-1.5 font-semibold">Registered Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#626F64] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@craftsland.com"
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
                <Loader2 className="w-4 h-4 animate-spin" /> Dispatching...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#626F64]">
          <Link to="/login" className="text-[#31543A] font-semibold hover:text-[#26432E] transition-colors">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

