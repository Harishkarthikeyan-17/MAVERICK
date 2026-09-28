import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, Terminal } from 'lucide-react';

const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto p-12 bg-slate-900/40 backdrop-blur-md border border-slate-800 relative group">
          {/* Animated Glowing Border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-cyan-500/50 opacity-20 group-hover:opacity-100 blur-sm transition-opacity duration-1000" />
          
          <div className="relative z-10">
            <div className="inline-flex p-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-8 animate-pulse">
              <Power size={32} />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase whitespace-normal break-words">
              Ready to <span className="text-cyan-500">Initialize?</span>
            </h2>
            
            <p className="text-slate-400 mb-10 text-lg font-medium">
              Join the elite architects of the new digital age. Secure your node and start managing your decentralized empire today.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="group relative px-10 py-5 bg-white text-[#020617] font-black rounded-none transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-95 flex items-center gap-3 mx-auto"
            >
              <Terminal size={20} />
              ACCESS SYSTEM_01
            </button>
          </div>

          {/* Decorative Corner Tabs */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-cyan-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-cyan-500" />
        </div>
      </div>
    </section>
  );
};

export default CTA;
