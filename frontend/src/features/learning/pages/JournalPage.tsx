import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  BrainCircuit, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Smile
} from 'lucide-react';

const JournalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [energyLevel, setEnergyLevel] = useState(0);

  // Auto-save mock
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');

  const handleBlur = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
            <BookOpen className="text-pink-400" /> Learning Journal
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Reflect on your progress and extract AI patterns</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button 
            onClick={() => setActiveTab('today')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'today' ? 'bg-slate-800 text-pink-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Today's Entry
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-slate-800 text-pink-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            History & Patterns
          </button>
        </div>
      </div>

      {activeTab === 'today' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in pb-32">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
              <h2 className="text-xl font-bold text-slate-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
              <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-600 cursor-not-allowed"><ChevronRight size={20}/></button>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              {saveStatus === 'saving' && <span className="text-slate-400 animate-pulse">Saving...</span>}
              {saveStatus === 'saved' && <span className="text-emerald-400 flex items-center gap-1"><Check size={14}/> Saved</span>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 focus-within:border-pink-500/50 transition-colors">
              <label className="text-sm font-bold text-slate-300 block mb-3">1. What did you learn today?</label>
              <textarea 
                onBlur={handleBlur}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-xl outline-none focus:border-pink-500 transition-colors resize-none min-h-[100px]" 
                placeholder="I finally understood how the Stack Navigator handles params..."
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 focus-within:border-pink-500/50 transition-colors">
              <label className="text-sm font-bold text-slate-300 block mb-3">2. What was difficult?</label>
              <textarea 
                onBlur={handleBlur}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-xl outline-none focus:border-pink-500 transition-colors resize-none min-h-[80px]" 
                placeholder="Passing data backwards between screens was confusing."
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 focus-within:border-pink-500/50 transition-colors">
              <label className="text-sm font-bold text-slate-300 block mb-3">3. What distracted you?</label>
              <textarea 
                onBlur={handleBlur}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-xl outline-none focus:border-pink-500 transition-colors resize-none min-h-[60px]" 
                placeholder="Kept checking Twitter during the 50-minute deep work block."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 focus-within:border-pink-500/50 transition-colors">
                <label className="text-sm font-bold text-slate-300 block mb-3">4. Priority for tomorrow?</label>
                <textarea 
                  onBlur={handleBlur}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-xl outline-none focus:border-pink-500 transition-colors resize-none min-h-[80px]" 
                  placeholder="Build the nested tab navigator."
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <label className="text-sm font-bold text-slate-300 block mb-3">5. Energy Level Today</label>
                <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {[1,2,3,4,5].map(level => (
                    <button 
                      key={level}
                      onClick={() => { setEnergyLevel(level); handleBlur(); }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${energyLevel === level ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 focus-within:border-pink-500/50 transition-colors">
              <label className="text-sm font-bold text-slate-300 block mb-3">6. One thing you're proud of?</label>
              <input 
                type="text"
                onBlur={handleBlur}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-xl outline-none focus:border-pink-500 transition-colors" 
                placeholder="I didn't give up on the auth bug!"
              />
            </div>
          </div>

          {/* AI Insight Panel */}
          <div className="bg-gradient-to-r from-indigo-900/40 to-pink-900/20 border border-indigo-500/30 rounded-3xl p-6 mt-8">
             <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BrainCircuit size={16} /> AI Daily Observations
             </h3>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-indigo-100">
                 <div className="mt-1 shrink-0 text-emerald-400"><TrendingUp size={16}/></div>
                 You successfully linked today's learning directly to your overarching React Native Goal.
               </li>
               <li className="flex items-start gap-3 text-sm text-indigo-100">
                 <div className="mt-1 shrink-0 text-orange-400"><AlertTriangle size={16}/></div>
                 Twitter was a major distraction again. In Focus Center, consider enabling strict block mode for tomorrow's Priority task.
               </li>
               <li className="flex items-start gap-3 text-sm text-indigo-100">
                 <div className="mt-1 shrink-0 text-pink-400"><Smile size={16}/></div>
                 Your energy level (4/5) correlates with high focus scores today! Keep up the good sleep routine.
               </li>
             </ul>
          </div>

        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-t border-slate-800 animate-in fade-in">
          {/* Calendar Panel */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/50 p-6 overflow-y-auto">
            <div className="relative group mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-pink-500 transition-all"
              />
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">October 2026</h3>
            <div className="grid grid-cols-7 gap-2 mb-8 text-center">
              {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] text-slate-600 font-bold">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => (
                <button key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all relative
                  ${i === 13 ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 
                    [2,3,4,8,9,10].includes(i) ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-900'}`
                }>
                  {i + 1}
                  {[2,3,4,8,9,10,13].includes(i) && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-pink-400" />}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Filter size={14}/> Filter Tags
               </h4>
               <div className="flex flex-wrap gap-2">
                 <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">Motivated</span>
                 <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded">Frustrated</span>
                 <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded">System Design</span>
                 <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded">React Native</span>
               </div>
            </div>
          </div>

          {/* Read-Only Entry View */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-slate-100 mb-2">Tuesday, October 14, 2026</h2>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">React Native</span>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase">Focused</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Energy</p>
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => <div key={i} className="w-3 h-3 rounded-full bg-pink-500"/>)}
                    <div className="w-3 h-3 rounded-full bg-slate-800"/>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-slate-300">
                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">What did you learn?</h3>
                  <p className="leading-relaxed bg-slate-900 border border-slate-800 p-4 rounded-2xl">I finally understood how the Stack Navigator handles params and how to pass data backwards using setParams.</p>
                </section>
                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">What was difficult?</h3>
                  <p className="leading-relaxed bg-slate-900 border border-slate-800 p-4 rounded-2xl text-orange-200/80">Passing data backwards between screens was confusing because I didn't realize it required a callback approach or specific state management.</p>
                </section>
                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">What distracted you?</h3>
                  <p className="leading-relaxed bg-slate-900 border border-slate-800 p-4 rounded-2xl">Kept checking Twitter during the 50-minute deep work block.</p>
                </section>
              </div>

              {/* Monthly AI Pattern */}
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-3xl p-6 mt-12">
                 <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BrainCircuit size={16} /> October AI Pattern Analysis
                 </h3>
                 <p className="text-sm text-indigo-100/90 leading-relaxed mb-4">
                   Over the last 14 days, you have mentioned "React Navigation" as difficult 4 times. This indicates a persistent friction point.
                   Additionally, your energy drops consistently on Thursdays.
                 </p>
                 <button className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-lg hover:bg-indigo-500/20 transition-colors">
                   Generate Recovery Plan in AI Coach
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
