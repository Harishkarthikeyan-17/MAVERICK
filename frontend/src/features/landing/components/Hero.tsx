import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Cpu, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Animated Cyber Grid Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-8 animate-bounce">
          <Zap size={14} /> System Online
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          MAVERICK <span className="text-cyan-500">AI</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-medium">
          The next-generation <span className="text-slate-200">AI-powered command center</span> for elite developers and digital architects.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="group relative px-8 py-4 bg-cyan-500 text-[#020617] font-bold rounded-none clip-path-cyber overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <span className="flex items-center gap-2">
              INITIALIZE SYSTEM <ArrowRight size={20} />
            </span>
          </button>
          
          <button className="px-8 py-4 border border-slate-700 text-slate-300 font-bold hover:bg-slate-800/50 transition-all hover:border-cyan-500/50">
            VIEW ARCHITECTURE
          </button>
        </div>

        {/* Tech Badges */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2">
            <Cpu size={20} /> <span className="text-sm font-bold tracking-widest uppercase">Neural Core</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot size={20} /> <span className="text-sm font-bold tracking-widest uppercase">Autonomous</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={20} /> <span className="text-sm font-bold tracking-widest uppercase">Low Latency</span>
          </div>
        </div>
      </div>

      {/* Decorative Cyber Lines */}
      <div className="absolute bottom-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-cyan-500/20" />
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-cyan-500/20" />
    </div>
  );
};

export default Hero;
