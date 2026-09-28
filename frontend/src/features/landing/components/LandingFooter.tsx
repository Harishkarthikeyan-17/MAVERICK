import React from 'react';
import { Github, Twitter, Linkedin, Terminal } from 'lucide-react';

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 relative overflow-hidden">
      {/* Neon Line Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Terminal className="text-cyan-500" size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-widest uppercase">MAVERICK</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-8">
            <a href="#about" className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">About</a>
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">Features</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">Contact</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">Privacy</a>
          </nav>

          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <Github size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 text-center gap-4">
          <p className="text-xs text-slate-600 font-medium">
            &copy; 2026 MAVERICK AI CORE. ALL PERMISSIONS GRANTED.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
            <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">System Status: NOMINAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
