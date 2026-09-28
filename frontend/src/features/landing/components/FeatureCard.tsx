import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="group relative p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 transition-all duration-500 hover:border-cyan-500/50 hover:bg-slate-900/80 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-slate-700 group-hover:border-cyan-500 transition-colors" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-slate-700 group-hover:border-cyan-500 transition-colors" />

      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-none blur opacity-0 group-hover:opacity-10 transition duration-500" />

      <div className="relative z-10">
        <div className="w-14 h-14 bg-cyan-500/10 rounded-none border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-cyan-500/20">
          <Icon className="text-cyan-400" size={28} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-100 mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
          {description}
        </p>

        {/* Scanline Effect on Hover */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-0 group-hover:opacity-20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-[2000ms] linear infinite" />
      </div>
    </div>
  );
};

export default FeatureCard;
