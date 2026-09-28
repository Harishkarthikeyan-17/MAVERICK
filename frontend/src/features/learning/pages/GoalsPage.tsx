import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Link2
} from 'lucide-react';

const MOCK_GOALS = [
  {
    id: 'g1', title: 'Master React Native Navigation', type: 'Monthly', skill: 'React Native', priority: 'High',
    progress: 65, daysRemaining: 12, status: 'Active', 
    milestones: [
      { id: 'm1', title: 'Understand Stack Navigator', completed: true },
      { id: 'm2', title: 'Implement Deep Linking', completed: false },
      { id: 'm3', title: 'Handle Auth Flow', completed: false }
    ],
    blockers: [], aiProbability: 85
  },
  {
    id: 'g2', title: 'System Design Interview Prep', type: 'Quarterly', skill: 'System Design', priority: 'Critical',
    progress: 30, daysRemaining: 45, status: 'At Risk', 
    milestones: [
      { id: 'm4', title: 'Read DDIA', completed: true },
      { id: 'm5', title: 'Design Twitter', completed: false }
    ],
    blockers: ['No Time', 'Concept Unclear'], aiProbability: 42
  },
  {
    id: 'g3', title: 'Complete Tailwind Course', type: 'Weekly', skill: 'CSS', priority: 'Medium',
    progress: 100, daysRemaining: 0, status: 'Completed', 
    milestones: [
      { id: 'm6', title: 'Flexbox & Grid', completed: true }
    ],
    blockers: [], aiProbability: 100
  }
];

const COLUMNS = ['Not Started', 'Active', 'At Risk', 'Completed'];

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Low': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
              <Target size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">Goals & Milestones</h1>
          </div>
          <p className="text-slate-500 font-medium">Track your learning objectives with AI assistance</p>
        </div>
        <button 
          onClick={() => setShowGoalModal(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6 md:p-8">
        <div className="flex gap-6 min-w-max h-full">
          {COLUMNS.map(col => (
            <div key={col} className="w-80 flex flex-col h-full bg-slate-900/50 rounded-3xl border border-slate-800/50 p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm">{col}</h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {goals.filter(g => g.status === col).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {goals.filter(g => g.status === col).map(goal => (
                  <div 
                    key={goal.id} 
                    onClick={() => setSelectedGoal(goal)}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                      <button className="text-slate-600 hover:text-slate-300">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-slate-100 mb-1 leading-tight group-hover:text-cyan-400 transition-colors">{goal.title}</h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-4"><Link2 size={12}/> {goal.skill}</p>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-cyan-400">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${goal.status === 'At Risk' ? 'bg-orange-500' : 'bg-cyan-500'}`} style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-4 pb-4 border-b border-slate-800/50">
                      <div className={`flex items-center gap-1 ${goal.daysRemaining < 7 ? 'text-orange-400 font-bold' : ''}`}>
                        <Clock size={12} /> {goal.daysRemaining} days left
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                        <TrendingUp size={12} /> {goal.aiProbability}% ML
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Milestones</p>
                      {goal.milestones.slice(0, 2).map((m: any) => (
                        <div key={m.id} className="flex items-start gap-2 text-xs">
                          {m.completed ? <CheckCircle2 size={14} className="text-cyan-500 mt-0.5 shrink-0" /> : <Circle size={14} className="text-slate-600 mt-0.5 shrink-0" />}
                          <span className={m.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>{m.title}</span>
                        </div>
                      ))}
                      {goal.milestones.length > 2 && (
                         <div className="text-[10px] text-slate-500 font-bold mt-1">+ {goal.milestones.length - 2} more</div>
                      )}
                    </div>
                    
                    {goal.blockers.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800/50">
                        <div className="flex items-center gap-1 text-red-400 text-xs font-bold mb-1">
                           <AlertOctagon size={12} /> Blockers Detected
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {goal.blockers.map((b: string, i: number) => (
                             <span key={i} className="px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[9px] font-bold">{b}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Detail Modal (Simulated) */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedGoal(null)} />
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl h-[85vh] relative z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getPriorityColor(selectedGoal.priority)}`}>
                     {selectedGoal.priority} Priority
                   </span>
                   <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 rounded">
                     {selectedGoal.type} Goal
                   </span>
                 </div>
                 <h2 className="text-3xl font-black text-slate-100">{selectedGoal.title}</h2>
               </div>
               <button onClick={() => setSelectedGoal(null)} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:text-white">X</button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="col-span-2 space-y-6">
                 {/* Timeline */}
                 <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Milestone Timeline</h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                       {selectedGoal.milestones.map((m: any, i: number) => (
                         <div key={m.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                               {m.completed ? <CheckCircle2 size={18} className="text-cyan-400" /> : <Circle size={18} />}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
                               <p className={`text-sm font-bold ${m.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{m.title}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>

               <div className="space-y-6">
                 {/* AI Insights Panel */}
                 <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/20 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <BrainCircuit size={16} /> AI Micro-Suggestions
                    </h3>
                    <p className="text-xs text-indigo-100/80 mb-4 leading-relaxed">
                       Based on your recent focus sessions, you are struggling with <strong className="text-white">Deep Linking</strong>. Here are 3 immediate actions:
                    </p>
                    <ul className="space-y-3">
                       <li className="text-xs text-indigo-200 flex items-start gap-2 bg-black/20 p-2 rounded-lg">
                          <ArrowRight size={14} className="shrink-0 mt-0.5 text-indigo-400"/> Watch 10-min conceptual video.
                       </li>
                       <li className="text-xs text-indigo-200 flex items-start gap-2 bg-black/20 p-2 rounded-lg">
                          <ArrowRight size={14} className="shrink-0 mt-0.5 text-indigo-400"/> Read Official React Navigation Docs.
                       </li>
                       <li className="text-xs text-indigo-200 flex items-start gap-2 bg-black/20 p-2 rounded-lg">
                          <ArrowRight size={14} className="shrink-0 mt-0.5 text-indigo-400"/> Implement standard boilerplate first.
                       </li>
                    </ul>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
