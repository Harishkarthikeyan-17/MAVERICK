import React, { useState } from 'react';
import { Shield, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { loginUser, registerUser } from '../../services/authService';
import MatrixBackground from '../../shared/components/MatrixBackground';
import { UserRole } from '../../core/types';

interface AuthProps {
  onLogin: (role: UserRole, token: string, name?: string) => void;
  onForgotPassword?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onForgotPassword }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.SOLO);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser(email, password);
        onLogin(data.role as UserRole, data.token, data.full_name);
      } else {
        await registerUser(email, password, role, name);
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setName('');
        setError('Account created. Please login.');
      }
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Shield className="text-cyan-400" size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-[0.2em] bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            MAVERICK
          </h1>
          <p className="text-slate-400 mt-2 font-medium tracking-wide">SMART MANAGEMENT PLATFORM</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative">

          {/* Toggle Login / Signup */}
          <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl mb-8 border border-slate-800">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              LOGIN
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              SIGNUP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name — signup only */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                required
              />
            </div>

            {/* Role selector — signup only */}
            {!isLogin && (
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest">
                  Select Access Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[UserRole.SOLO, UserRole.WARD, UserRole.GUARDIAN].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`
                        py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter border transition-all
                        ${role === r
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}
                      `}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error / success message */}
            {error && (
              <p className={`text-xs text-center ${error.includes('created') ? 'text-green-400' : 'text-red-400'}`}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-2 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); if (onForgotPassword) onForgotPassword(); }}
              className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Forgot password? Recover safely.
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;