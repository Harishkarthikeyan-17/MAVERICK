import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  BrainCircuit, 
  Activity, 
  Target, 
  Clock, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertOctagon
} from 'lucide-react';

// Mock Data
const efficiencyData = [
  { date: 'Mon', score: 65 }, { date: 'Tue', score: 72 }, { date: 'Wed', score: 68 }, 
  { date: 'Thu', score: 85 }, { date: 'Fri', score: 82 }, { date: 'Sat', score: 90 }, { date: 'Sun', score: 88 }
];

const roiData = [
  { skill: 'React Native', hours: 45, completion: 80 },
  { skill: 'System Design', hours: 20, completion: 30 },
  { skill: 'TypeScript', hours: 15, completion: 60 },
  { skill: 'AWS', hours: 35, completion: 50 },
];

const sectorData = [
  { sector: 'Technical', value: 120 },
  { sector: 'Academic', value: 40 },
  { sector: 'Career', value: 25 },
  { sector: 'Language', value: 15 },
  { sector: 'Creative', value: 10 },
];

const cognitiveData = [
  { date: 'Mon', load: 45, intensity: 50, breakQuality: 80 },
  { date: 'Tue', load: 60, intensity: 65, breakQuality: 70 },
  { date: 'Wed', load: 85, intensity: 90, breakQuality: 40 },
  { date: 'Thu', load: 70, intensity: 75, breakQuality: 60 },
  { date: 'Fri', load: 50, intensity: 55, breakQuality: 85 },
];

const LearningAnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 flex flex-col space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
          <Activity className="text-cyan-400" /> Executive Analytics
        </h1>
        <p className="text-slate-500 font-medium mt-1">Deep insights into your learning velocity and efficiency</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Efficiency Score Over Time */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Efficiency Index</h3>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-black text-white">88</span>
                <span className="text-emerald-400 flex items-center text-sm font-bold pb-1"><ArrowUpRight size={16}/> +12%</span>
              </div>
            </div>
            <div className="flex gap-2">
              {['7D', '30D', '90D'].map((t, i) => (
                <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold ${i === 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0.75rem' }} />
                <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Sector Balance Report */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Sector Balance</h3>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sectorData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="sector" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Time" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mt-4 flex items-start gap-2 text-red-400 text-xs">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <p><strong>Imbalance Alert:</strong> Technical sector consumes 85% of your time. Consider dedicating 2 hours to Career this week.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. Learning ROI */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Learning ROI</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis dataKey="skill" type="category" stroke="#94a3b8" tickLine={false} axisLine={false} width={80} tick={{fontSize: 10}} />
                <Tooltip cursor={{ fill: '#0f172a' }} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                <Bar dataKey="completion" name="% Complete" fill="#34d399" radius={[0, 4, 4, 0]} />
                <Bar dataKey="hours" name="Hours Invested" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Cognitive Load Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Cognitive Load Index</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cognitiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                <Line type="monotone" dataKey="load" name="Cognitive Load" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="intensity" name="Session Intensity" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="breakQuality" name="Break Quality" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Retention Analysis & 4. Decay Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retention & Decay</h3>
            <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><AlertOctagon size={12}/> 2 At Risk</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs uppercase bg-slate-950 text-slate-500">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Skill</th>
                  <th className="px-4 py-3">Retention</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-3 font-bold text-slate-200">Redux Toolkit</td>
                  <td className="px-4 py-3"><div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-red-500 rounded-full" style={{width:'35%'}}/></div></td>
                  <td className="px-4 py-3 text-red-400 text-xs">High Decay</td>
                  <td className="px-4 py-3"><button className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">Revise Now</button></td>
                </tr>
                <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-3 font-bold text-slate-200">Kubernetes Basics</td>
                  <td className="px-4 py-3"><div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-orange-500 rounded-full" style={{width:'55%'}}/></div></td>
                  <td className="px-4 py-3 text-orange-400 text-xs">Moderate Decay</td>
                  <td className="px-4 py-3"><button className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">Revise Now</button></td>
                </tr>
                <tr className="hover:bg-slate-800/20">
                  <td className="px-4 py-3 font-bold text-slate-200">React Native</td>
                  <td className="px-4 py-3"><div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width:'95%'}}/></div></td>
                  <td className="px-4 py-3 text-emerald-400 text-xs">Strong</td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-500">In 5 days</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 9. Comparative Efficiency */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Comparative Efficiency</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            <div>This Week</div>
            <div>Last Week</div>
            <div>Personal Best</div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Hours', v1: '14.5', v2: '12.0', v3: '18.5' },
              { label: 'Focus Score', v1: '88', v2: '75', v3: '94' },
              { label: 'Distractions', v1: '5', v2: '14', v3: '2' },
              { label: 'Goals Met', v1: '2', v2: '1', v3: '4' }
            ].map(row => (
              <div key={row.label} className="grid grid-cols-3 gap-2 text-center items-center">
                <div className="text-slate-100 font-black text-lg flex flex-col items-center">
                  {row.v1} <span className="text-[9px] text-slate-500 font-normal uppercase">{row.label}</span>
                </div>
                <div className="text-slate-400 font-medium">{row.v2}</div>
                <div className="text-cyan-400 font-bold">{row.v3}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10. ML Insight Cards (Horizontal Scroll) */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <BrainCircuit size={16} className="text-indigo-400" /> Machine Learning Insights
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          
          <div className="min-w-[300px] bg-gradient-to-br from-red-900/20 to-orange-900/10 border border-red-500/20 rounded-2xl p-5 snap-start">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle size={16} /> <h4 className="font-bold text-sm">Burnout Predictor</h4>
            </div>
            <p className="text-xl font-black text-white mb-2">High Risk</p>
            <p className="text-xs text-red-200/70 leading-relaxed">You've logged 24 hours in 5 days with poor break quality. Recommendation: Take tomorrow entirely off from Technical skills.</p>
          </div>

          <div className="min-w-[300px] bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/20 rounded-2xl p-5 snap-start">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Clock size={16} /> <h4 className="font-bold text-sm">Optimal Duration</h4>
            </div>
            <p className="text-xl font-black text-white mb-2">52 Minutes</p>
            <p className="text-xs text-blue-200/70 leading-relaxed">Your highest cognitive retention occurs during 52-minute focus blocks. You are currently averaging 38 minutes.</p>
          </div>

          <div className="min-w-[300px] bg-gradient-to-br from-emerald-900/20 to-teal-900/10 border border-emerald-500/20 rounded-2xl p-5 snap-start">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Target size={16} /> <h4 className="font-bold text-sm">Mastery ETA</h4>
            </div>
            <p className="text-xl font-black text-white mb-2">Oct 14</p>
            <p className="text-xs text-emerald-200/70 leading-relaxed">At your current velocity of 4hrs/week, you will reach "Expert" level in System Design by October 14th.</p>
          </div>

          <div className="min-w-[300px] bg-gradient-to-br from-purple-900/20 to-pink-900/10 border border-purple-500/20 rounded-2xl p-5 snap-start">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Zap size={16} /> <h4 className="font-bold text-sm">Distraction Profile</h4>
            </div>
            <p className="text-xl font-black text-white mb-2">Context Switching</p>
            <p className="text-xs text-purple-200/70 leading-relaxed">70% of your distractions occur right after completing a sub-task. You are vulnerable in the "in-between" moments.</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LearningAnalyticsPage;
