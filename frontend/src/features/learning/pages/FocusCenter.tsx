import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Zap, 
  Flame, 
  BarChart2, 
  AlertTriangle, 
  Smartphone, 
  Users, 
  Bell, 
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const FocusCenter: React.FC = () => {
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'debrief'>('idle');
  const [activeTab, setActiveTab] = useState<'timer' | 'analytics'>('timer');
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes default
  const [isPaused, setIsPaused] = useState(false);

  // Distraction logging state
  const [showDistractionLog, setShowDistractionLog] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = () => setSessionState('active');
  const handleStop = () => setSessionState('debrief');
  const handleSaveDebrief = () => setSessionState('idle');

  return (
    <div className="p-6 md:p-8 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Zap className="text-cyan-400" /> Focus Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">Deep work and distraction intelligence</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('timer')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'timer' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Timer
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'timer' && (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          {sessionState === 'idle' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md animate-in slide-in-from-bottom-4">
              <h2 className="text-xl font-black text-slate-100 mb-6 text-center">New Focus Session</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Skill / Topic</label>
                  <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors">
                    <option>React Native Navigation</option>
                    <option>System Design</option>
                    <option>AWS Deployment</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Goal (Optional)</label>
                  <input type="text" placeholder="e.g. Finish the auth flow..." className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Duration</label>
                    <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors">
                      <option value="25">25 mins (Pomodoro)</option>
                      <option value="50">50 mins (Deep Work)</option>
                      <option value="90">90 mins (Flow)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Energy</label>
                    <div className="flex justify-between items-center h-12 bg-slate-950 border border-slate-800 rounded-xl px-3">
                      {[1,2,3,4,5].map(e => (
                        <button key={e} className="w-6 h-6 rounded-full bg-slate-800 hover:bg-orange-500 transition-colors" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Play fill="currentColor" /> Start Session
              </button>
            </div>
          )}

          {sessionState === 'active' && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
               <div className="text-center mb-12">
                 <h2 className="text-2xl font-black text-slate-100 mb-2">React Native Navigation</h2>
                 <p className="text-slate-400 font-medium">Deep Work Mode</p>
               </div>

               {/* Large Timer with Breathing Ring */}
               <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                 <div className={`absolute inset-0 rounded-full border border-cyan-500/30 ${!isPaused ? 'animate-[ping_4s_ease-in-out_infinite]' : ''}`} />
                 <div className={`absolute inset-4 rounded-full border border-cyan-500/50 ${!isPaused ? 'animate-[ping_4s_ease-in-out_infinite_delay-1s]' : ''}`} />
                 <div className="absolute inset-8 rounded-full bg-slate-900 border-4 border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.2)] flex items-center justify-center">
                    <span className="text-6xl font-black text-white font-mono tracking-wider">{formatTime(timeRemaining)}</span>
                 </div>
               </div>

               <div className="flex items-center gap-6 mb-12">
                 <button 
                   onClick={() => setIsPaused(!isPaused)}
                   className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-all"
                 >
                   {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
                 </button>
                 <button 
                   onClick={handleStop}
                   className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                 >
                   <Square size={24} fill="currentColor" />
                 </button>
               </div>

               <button 
                 onClick={() => setShowDistractionLog(true)}
                 className="px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-orange-400 hover:border-orange-500/50 transition-all flex items-center gap-2 text-sm font-bold"
               >
                 <AlertTriangle size={16} /> Log Distraction
               </button>

               {/* Distraction Quick Overlay */}
               {showDistractionLog && (
                 <div className="absolute inset-x-0 bottom-0 top-auto bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-3xl p-6 animate-in slide-in-from-bottom-8 z-50 shadow-2xl">
                    <h3 className="text-center font-bold text-slate-300 mb-4">What distracted you?</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { icon: <Smartphone size={18}/>, label: 'Phone' },
                        { icon: <Users size={18}/>, label: 'People' },
                        { icon: <Bell size={18}/>, label: 'Notification' },
                        { icon: <Flame size={18}/>, label: 'Fatigue' },
                        { icon: <Coffee size={18}/>, label: 'Hunger' },
                        { icon: <AlertTriangle size={18}/>, label: 'Other' },
                      ].map(d => (
                        <button key={d.label} onClick={() => setShowDistractionLog(false)} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500 hover:text-cyan-400 transition-all text-slate-400">
                          {d.icon}
                          <span className="text-xs font-bold">{d.label}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowDistractionLog(false)} className="w-full py-3 text-slate-500 hover:text-slate-300 font-bold text-sm">Cancel</button>
                 </div>
               )}
            </div>
          )}

          {sessionState === 'debrief' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md animate-in zoom-in-95">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-100 mb-2 text-center">Session Complete!</h2>
              <p className="text-slate-400 text-center mb-8">You focused for 25 minutes.</p>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Accomplishments</label>
                  <textarea className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors h-24 resize-none" placeholder="What did you get done?" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Quality Rating</label>
                  <div className="flex justify-between items-center h-12 bg-slate-950 border border-slate-800 rounded-xl px-3">
                    {[1,2,3,4,5].map(e => (
                      <button key={e} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-cyan-500 transition-colors" />
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveDebrief}
                className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black shadow-lg shadow-cyan-500/20 transition-all"
              >
                Save & Continue
              </button>
            </div>
          )}

        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="flex-1 overflow-y-auto animate-in fade-in">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Focus Debt</p>
                <div className="text-3xl font-black text-orange-400 mb-2">3.5 hrs</div>
                <p className="text-xs text-slate-400 leading-relaxed">Behind your weekly focus target. Recommended to add 30 mins to today's schedule.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Flow Frequency</p>
                <div className="text-3xl font-black text-emerald-400 mb-2">12</div>
                <p className="text-xs text-slate-400 leading-relaxed">Sessions over 25 mins without interruption this week.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Optimal Duration</p>
                <div className="text-3xl font-black text-cyan-400 mb-2">52 min</div>
                <p className="text-xs text-slate-400 leading-relaxed">Your best quality scores occur during 50-55 minute sessions.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Concentration Trend</h3>
                 <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={[{v:60},{v:65},{v:80},{v:75},{v:90},{v:85}]}>
                       <Tooltip cursor={false} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                       <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <AlertTriangle size={16} /> Distraction Triggers
                 </h3>
                 <div className="space-y-4">
                   {[
                     { label: 'Social Media', count: 18, color: 'bg-red-500' },
                     { label: 'Fatigue', count: 12, color: 'bg-orange-500' },
                     { label: 'Notifications', count: 8, color: 'bg-blue-500' },
                     { label: 'Environment', count: 5, color: 'bg-slate-500' },
                   ].map(d => (
                     <div key={d.label}>
                       <div className="flex justify-between text-xs font-bold mb-1 text-slate-300">
                         <span>{d.label}</span>
                         <span>{d.count} times</span>
                       </div>
                       <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                         <div className={`h-full ${d.color} rounded-full`} style={{ width: `${(d.count/18)*100}%` }} />
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="mt-6 pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-400 leading-relaxed"><strong className="text-slate-200">AI Note:</strong> Social media distractions spike heavily between 2 PM and 4 PM. Suggest turning on aggressive blocking during these hours.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FocusCenter;
