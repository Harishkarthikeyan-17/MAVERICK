
import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Phone, ArrowRight, UserCheck } from 'lucide-react';
import MatrixBackground from '../components/MatrixBackground';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.SOLO);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified validation for demo
    onLogin(role);
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
            MAVERIC
          </h1>
          <p className="text-slate-400 mt-2 font-medium tracking-wide">SMART MANAGEMENT PLATFORM</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative">
          <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl mb-8 border border-slate-800">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              LOGIN
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              SIGNUP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                required
              />
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest">Select Access Role</label>
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

            <button 
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-6 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 active:scale-95"
            >
              {isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <a href="#" className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors">
              Forgot password? Recover safely.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
