import React from 'react';
import { 
  Activity, 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp, 
  ShieldAlert, 
  BellRing, 
  BrainCircuit, 
  Flame, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

// Mock Data
const sparklineData = [
  { value: 65 }, { value: 68 }, { value: 74 }, { value: 72 }, { value: 80 }, { value: 85 }, { value: 82 }
];

const streakData = Array.from({ length: 90 }).map((_, i) => ({
  date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000),
  hours: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0
}));

const LearningDashboard: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Your AI-driven command center</p>
        </div>
      </div>

      {/* 10. Upcoming Milestone Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
            <BellRing size={20} />
          </div>
          <div>
            <h4 className="text-amber-500 font-bold text-sm">Upcoming Milestone</h4>
            <p className="text-amber-500/80 text-xs mt-0.5">"Complete React Native Auth Flow" in 3 days</p>
          </div>
        </div>
        <button className="text-amber-500/50 hover:text-amber-500 transition-colors">
          <XCircle size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* 1. Daily Readiness Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <Activity size={100} />
          </div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 w-full text-left">Daily Readiness</h3>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.8" strokeDashoffset="70.36" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">80</span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Excellent</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">High energy and 4-day streak. Push hard today.</p>
        </div>

        {/* 2. Learning Progress Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Learning Progress</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-slate-950 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-black text-cyan-400">4</span>
              <span className="text-xs text-slate-500 font-medium">Active Skills</span>
            </div>
            <div className="bg-slate-950 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-black text-emerald-400">12</span>
              <span className="text-xs text-slate-500 font-medium">Completed</span>
            </div>
            <div className="bg-slate-950 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-black text-purple-400">8</span>
              <span className="text-xs text-slate-500 font-medium">In Progress</span>
            </div>
            <div className="bg-slate-950 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-black text-orange-400">5 <span className="text-sm text-orange-400/50">days</span></span>
              <span className="text-xs text-slate-500 font-medium">Current Streak</span>
            </div>
          </div>
        </div>

        {/* 4. Focus Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Focus Score</h3>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-black text-white">92</span>
            <span className="text-sm text-slate-500 font-medium pb-1">/ 100 today</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Sessions Completed</span>
                <span className="text-slate-200">3/4</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Distractions</span>
                <span className="text-slate-200">Low (1)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Tasks Done</span>
                <span className="text-slate-200">5/8</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Learning Health Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Learning Health</h3>
          <div className="flex-1 space-y-4 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Consistency</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">Excellent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Retention</span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold uppercase">Strong</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Burnout Risk</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">Low</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 mt-4 text-center">AI updated · Just now</p>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 3. Today's Plan Card */}
        <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Today's Plan</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-md">Auto-generated</span>
          </div>
          <div className="space-y-3">
            {[
              { title: 'React Native Navigation', type: 'Focus Session', time: '45m', completed: true },
              { title: 'State Management Quiz', type: 'Revision', time: '15m', completed: false },
              { title: 'Read API Docs', type: 'Task', time: '30m', completed: false },
              { title: 'UI Component Review', type: 'Task', time: '20m', completed: false }
            ].map((task, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${task.completed ? 'bg-slate-950 border-slate-800/50 opacity-60' : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'}`}>
                <button className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-cyan-500 border-cyan-500 text-slate-900' : 'border-slate-600 hover:border-cyan-400'}`}>
                  {task.completed && <CheckCircle2 size={14} />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">{task.type}</span>
                    <span className="text-xs text-slate-500">{task.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Active Goal Rings Card & 6. Weekly Growth */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 11. AI Daily Brief Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/20 rounded-3xl p-6 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <BrainCircuit size={100} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit size={16} /> AI Daily Brief
                </h3>
                <button className="text-slate-500 hover:text-indigo-400 transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ul className="space-y-3 text-sm text-indigo-100/80 leading-relaxed relative z-10">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  Your focus score is up 12% this week. Keep utilizing the Pomodoro timer.
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  You haven't practiced TypeScript in 6 days. Recommended to review today.
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  At your current velocity, you will hit your Frontend Goal 3 days early.
                </li>
              </ul>
              <p className="text-[10px] text-indigo-500/50 mt-4 font-mono">Generated 08:00 AM</p>
            </div>

            {/* 8. Efficiency Trend Sparkline & 9. Distraction Rate */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency Trend</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-white">82</span>
                    <div className="flex items-center text-emerald-400 text-sm font-bold">
                      <TrendingUp size={16} className="mr-1" /> +5%
                    </div>
                  </div>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={false} />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Distraction Rate</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white">12%</span>
                    <span className="text-xs text-slate-500 font-medium pb-1 mb-0.5">2 sessions interrupted</span>
                  </div>
                </div>
                <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

          </div>

          {/* 6. Weekly Growth Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Weekly Growth</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Hours Logged</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-100">14.5</span>
                  <span className="text-xs text-emerald-400 font-bold mb-1">+12%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Skills Progressed</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-100">3</span>
                  <span className="text-xs text-emerald-400 font-bold mb-1">+1</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Goals Completed</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-100">2</span>
                  <span className="text-xs text-slate-600 font-bold mb-1">-</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Focus Quality</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-100">8.4</span>
                  <span className="text-xs text-emerald-400 font-bold mb-1">+0.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 12. Streak Heatmap Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Flame size={16} className="text-orange-500" /> 90-Day Consistency
        </h3>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max pb-2">
            {/* Generate a mock GitHub-style calendar grid. 7 rows, 13 cols approx for 90 days */}
            {Array.from({ length: 13 }).map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, rowIndex) => {
                  const dataIndex = colIndex * 7 + rowIndex;
                  if (dataIndex >= 90) return null;
                  const data = streakData[dataIndex];
                  
                  // Color intensity mapping
                  let bgColor = 'bg-slate-800/50'; // 0
                  if (data.hours === 1) bgColor = 'bg-cyan-900/40';
                  if (data.hours === 2) bgColor = 'bg-cyan-700/60';
                  if (data.hours === 3) bgColor = 'bg-cyan-500';
                  if (data.hours >= 4) bgColor = 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]';

                  return (
                    <div 
                      key={rowIndex} 
                      className={`w-4 h-4 rounded-sm ${bgColor} transition-all hover:ring-2 ring-slate-400 cursor-pointer`}
                      title={`${data.date.toDateString()}: ${data.hours} hrs`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500 font-medium">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-800/50" />
          <div className="w-3 h-3 rounded-sm bg-cyan-900/40" />
          <div className="w-3 h-3 rounded-sm bg-cyan-700/60" />
          <div className="w-3 h-3 rounded-sm bg-cyan-500" />
          <div className="w-3 h-3 rounded-sm bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.6)]" />
          <span>More</span>
        </div>
      </div>

    </div>
  );
};

export default LearningDashboard;
