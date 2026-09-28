import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, Lock, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';
import MatrixBackground from '../../shared/components/MatrixBackground';
import { apiClient } from '../../services/apiClient';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

type Step = 'request' | 'success';

type PasswordStrength = 'Weak' | 'Medium' | 'Strong' | '';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient('/auth/forgot-password', { method: 'POST', data: { email } });

      setStep('success');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
      <MatrixBackground />

      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <KeyRound className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-[0.1em] bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Password Reset
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Enter your email and we will send you a secure reset link.
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl">

          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4 animate-in fade-in duration-300">

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertTriangle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  placeholder="Your registered email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
                <ArrowRight size={18} />
              </button>

              <div className="pt-4 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </button>
              </div>

            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                <CheckCircle className="text-green-400" size={40} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-200">Check Your Inbox</h2>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  If <span className="text-slate-200">{email}</span> is registered, a password reset link has been sent. The link expires in 15 minutes.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">What to do next</p>
                <p className="text-xs text-slate-500 leading-relaxed">1. Open your email inbox</p>
                <p className="text-xs text-slate-500 leading-relaxed">2. Click the reset link in the email from MAVERICK Security</p>
                <p className="text-xs text-slate-500 leading-relaxed">3. Set your new password</p>
                <p className="text-xs text-slate-500 leading-relaxed">4. Check spam if you do not see it</p>
              </div>

              <button
                onClick={onBackToLogin}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                Back to Login
                <ArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;