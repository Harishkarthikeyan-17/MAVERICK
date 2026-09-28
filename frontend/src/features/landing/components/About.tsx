import React from 'react';
import { ShieldCheck, HardDrive, Cpu, Network } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content Left */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase">
              Core Protocol
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase">
              Engineered for the <span className="text-cyan-500">Digital Vanguard</span>
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              MAVERICK AI isn't just a platform; it's a decentralized command intelligence designed to handle the complexities of modern engineering. We've built the system from the silicon up to be fast, secure, and intuitive.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-900 border border-slate-800 text-cyan-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 uppercase text-sm tracking-widest mb-1">Hardened Security</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Military-grade protection for every node.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-900 border border-slate-800 text-cyan-500">
                  <HardDrive size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 uppercase text-sm tracking-widest mb-1">Persistent Core</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Always-on redundancy for critical tasks.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-900 border border-slate-800 text-cyan-500">
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 uppercase text-sm tracking-widest mb-1">Neural Compute</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Massive parallel processing capabilities.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-900 border border-slate-800 text-cyan-500">
                  <Network size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 uppercase text-sm tracking-widest mb-1">P2P Network</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Fully distributed across global cloud meshes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Holographic Visual Right */}
          <div className="flex-1 relative lg:mt-0 mt-12">
            <div className="relative w-full aspect-square max-w-[500px] mx-auto group">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-[1px] border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border-[1px] border-blue-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-10 border-t-2 border-cyan-500/40 rounded-full animate-[spin_5s_linear_infinite]" />
              
              {/* Central Core */}
              <div className="absolute inset-[30%] bg-cyan-500/10 rounded-full backdrop-blur-3xl border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all duration-700 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                <div className="w-1/2 h-1/2 bg-cyan-400 rounded-full animate-pulse blur-[15px] opacity-50" />
                <div className="w-4 h-4 bg-white rounded-full relative z-10 shadow-[0_0_20px_#fff]" />
              </div>

              {/* Orbital Dots */}
              <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4] animate-ping" />
              <div className="absolute bottom-[20%] right-[10%] w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
              
              {/* HUD Elements */}
              <div className="absolute -top-4 -right-4 p-3 bg-slate-900/80 border border-slate-700 backdrop-blur-md hidden sm:block">
                <span className="block text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-1">LATENCY</span>
                <span className="block text-xl font-black text-white">0.02ms</span>
              </div>
              <div className="absolute -bottom-4 -left-4 p-3 bg-slate-900/80 border border-slate-700 backdrop-blur-md hidden sm:block">
                <span className="block text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-1">UPTIME</span>
                <span className="block text-xl font-black text-white">99.99%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
