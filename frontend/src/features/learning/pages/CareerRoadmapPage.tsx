import React from 'react';
import { 
  Map, 
  Target, 
  Briefcase, 
  CheckCircle2, 
  Circle, 
  Lock, 
  TrendingUp, 
  BrainCircuit, 
  AlertTriangle,
  ArrowRight,
  GitCommit
} from 'lucide-react';

const CareerRoadmapPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      
      {/* Header */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
            <Map className="text-orange-400" /> Career Roadmap
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">AI-guided pathways to your next role</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Briefcase size={16}/> Target: Senior Frontend Eng.
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
        
        {/* Left Col: The Pathway */}
        <div className="col-span-2 relative">
          
          <h2 className="text-xl font-black text-slate-100 mb-8 tracking-tight">Your Pathway</h2>

          {/* Pathway Nodes */}
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:ml-[1.125rem] before:h-full before:w-1 before:bg-slate-800">
            
            {/* Node 1: Completed */}
            <div className="relative flex items-start gap-6 group">
              <div className="w-10 h-10 rounded-full bg-slate-950 border-4 border-emerald-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all hover:border-emerald-500/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded">Completed</span>
                  <span className="text-xs font-bold text-slate-500">Jan - Mar</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Frontend Foundations</h3>
                <p className="text-sm text-slate-400 mb-4">Mastered React hooks, functional components, and basic state management with Context.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-slate-950 border border-slate-800 px-2 py-1 rounded-md text-slate-300">React</span>
                  <span className="text-xs bg-slate-950 border border-slate-800 px-2 py-1 rounded-md text-slate-300">CSS Grid</span>
                </div>
              </div>
            </div>

            {/* Node 2: Active */}
            <div className="relative flex items-start gap-6 group">
              <div className="w-10 h-10 rounded-full bg-slate-950 border-4 border-cyan-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <GitCommit size={18} className="text-cyan-400 animate-pulse" />
              </div>
              <div className="flex-1 bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-lg shadow-cyan-500/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase rounded">Current Focus</span>
                  <span className="text-xs font-bold text-cyan-400">Apr - Present</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Advanced Mobile & State</h3>
                <p className="text-sm text-slate-400 mb-4">Learning React Native, deep linking, and complex state management via Redux Toolkit.</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-400">Node Progress</span>
                    <span className="text-cyan-400">65%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-md text-cyan-400">React Native</span>
                  <span className="text-xs bg-slate-950 border border-slate-800 px-2 py-1 rounded-md text-slate-300">Redux Toolkit</span>
                </div>
              </div>
            </div>

            {/* Node 3: Upcoming */}
            <div className="relative flex items-start gap-6 group opacity-70">
              <div className="w-10 h-10 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shrink-0 z-10">
                <Lock size={16} className="text-slate-600" />
              </div>
              <div className="flex-1 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase rounded">Up Next</span>
                  <span className="text-xs font-bold text-slate-600">Est. Aug 2026</span>
                </div>
                <h3 className="text-lg font-bold text-slate-300 mb-2">System Design & Architecture</h3>
                <p className="text-sm text-slate-500 mb-4">Understanding scaling, micro-frontends, CI/CD pipelines, and performance optimization.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-slate-950 border border-slate-800/50 px-2 py-1 rounded-md text-slate-500">System Design</span>
                  <span className="text-xs bg-slate-950 border border-slate-800/50 px-2 py-1 rounded-md text-slate-500">Webpack/Vite</span>
                </div>
              </div>
            </div>

             {/* Node 4: Goal */}
             <div className="relative flex items-start gap-6 group">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 border-4 border-orange-500 flex items-center justify-center shrink-0 z-10">
                <Target size={18} className="text-orange-400" />
              </div>
              <div className="flex-1 bg-gradient-to-r from-orange-900/20 to-slate-900 border border-orange-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-black text-orange-400 mb-1">Target: Senior Frontend Engineer</h3>
                <p className="text-sm text-orange-200/60 mb-4">Capable of designing scalable frontends, leading teams, and optimizing performance.</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                   <TrendingUp size={14}/> Projected readiness: <strong className="text-slate-200">Nov 2026</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: AI Gap Analysis & Readiness */}
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Role Readiness</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black text-white">42%</span>
              <span className="text-sm text-emerald-400 font-bold mb-1">+2% this week</span>
            </div>
            
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Gap Analysis</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">React Mastery</span>
                  <span className="text-emerald-400">90%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">State Architecture</span>
                  <span className="text-cyan-400">60%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">System Design</span>
                  <span className="text-orange-400">15%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Testing & CI/CD</span>
                  <span className="text-red-400">5%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/20 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BrainCircuit size={16} /> Market Intelligence
            </h3>
            <p className="text-sm text-indigo-100/90 leading-relaxed mb-4">
              AI analysis of 1,200 recent Senior Frontend Engineer job postings indicates <strong className="text-white">Testing & CI/CD</strong> is currently highly demanded.
            </p>
            <div className="bg-black/20 rounded-xl p-3 border border-indigo-500/10">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1">
                <AlertTriangle size={14}/> Recommendation
              </div>
              <p className="text-xs text-indigo-200/70">Move Testing from Node 3 to Node 2 to increase market readiness faster.</p>
              <button className="mt-3 text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-colors w-full">Apply Change to Roadmap</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CareerRoadmapPage;
