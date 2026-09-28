import React, { useState, useEffect } from 'react';
import { Flame, Footprints, Plus, Loader2, Target, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { logActivity, getActivityHistory, getGoals, type ActivityLog, type Goal } from '../services/healthApi';
import SummaryCard from './SummaryCard';

interface FitnessTabProps {
  healthData: any;
  setHealthData: React.Dispatch<React.SetStateAction<any>>;
}

const FitnessTab: React.FC<FitnessTabProps> = ({ healthData, setHealthData }) => {
  const [history, setHistory] = useState<ActivityLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeEdit, setActiveEdit] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetching(true);
    setError(null);
    try {
      const [hData, gData] = await Promise.all([
        getActivityHistory(),
        getGoals()
      ]);
      setHistory(hData);
      setGoals(gData.filter(g => g.category === 'fitness' || g.category === 'diet'));
    } catch (err) {
      console.error('Failed to fetch fitness data', err);
      setError('Failed to load activity history and goals.');
    } finally {
      setFetching(false);
    }
  };

  const handleQuickLog = async (field: 'calories' | 'steps', value: number) => {
    setLoading(true);
    try {
      await logActivity({ [field]: value });
      
      // Update global health data so Overview reflects the change immediately
      setHealthData(prev => ({
        ...prev,
        [field]: value
      }));

      await fetchData();
    } catch (err) {
      console.error('Failed to log activity', err);
    } finally {
      setLoading(false);
    }
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeEdit) {
        setActiveEdit(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEdit]);

  const today = history[history.length - 1] || { calories: healthData.calories, steps: healthData.steps, date: new Date().toISOString() };
  const fitnessGoals = goals.filter(g => g.category === 'fitness');
  const dietGoals = goals.filter(g => g.category === 'diet');

  const chartData = history.slice(-7).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: d.calories,
    steps: d.steps,
  }));

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-rose-400" size={20} />
            <p className="text-sm font-medium text-rose-200">{error}</p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          label="Calories Burnt" 
          value={healthData.calories} 
          unit="kcal" 
          icon={Flame} 
          color="text-orange-400" 
          bg="bg-orange-500/10" 
          progress={(healthData.calories / 2500) * 100}
          onClick={() => { setActiveEdit('calories'); setEditValue(String(healthData.calories)); }}
        />
        <SummaryCard 
          label="Active Steps" 
          value={healthData.steps} 
          unit="steps" 
          icon={Footprints} 
          color="text-emerald-400" 
          bg="bg-emerald-500/10" 
          progress={(healthData.steps / 10000) * 100}
          onClick={() => { setActiveEdit('steps'); setEditValue(String(healthData.steps)); }}
        />
        {/* Integrated Goal Cards */}
        {fitnessGoals.slice(0, 2).map(goal => (
          <div key={goal.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{goal.title}</span>
              <Target size={14} className="text-cyan-400" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-white">{goal.currentValue} <span className="text-xs text-slate-500 font-normal">/ {goal.targetValue} {goal.unit}</span></p>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} className="text-emerald-400" /> Activity History
            </h3>
          </div>
          <div className="h-64">
            {fetching ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-slate-500" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} 
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Steps" />
                  <Bar dataKey="calories" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} name="Calories" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Nutrition / Diet Goals */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Plus size={16} className="text-orange-400" /> Nutrition Focus
          </h3>
          <div className="space-y-4">
            {dietGoals.length > 0 ? dietGoals.map(goal => (
              <div key={goal.id} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">{goal.title}</span>
                  <span className="text-xs font-bold text-orange-400">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs">No diet goals active</p>
                <button className="text-[10px] text-cyan-400 mt-2 font-bold uppercase tracking-widest">+ Create One</button>
              </div>
            )}
            
            {/* Quick Suggestions */}
            <div className="mt-8 space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Suggestions</p>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                  You're 1,200 steps away from your goal. A 10-minute walk will get you there!
                </p>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <p className="text-[11px] text-amber-400/80 leading-relaxed">
                  Calorie intake is lower than usual today. Ensure you're getting enough protein.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Overlay */}
      {activeEdit && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={(e) => { if (e.target === e.currentTarget) setActiveEdit(null); }}
        >
          <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-8 pb-10 sm:pb-8 shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 relative">
            <h3 className="text-xl font-black text-white mb-2 capitalize">Log {activeEdit}</h3>
            <p className="text-sm text-slate-400 mb-6">Enter your updated {activeEdit} for today.</p>
            <input 
              type="number" 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 text-white text-3xl font-black p-6 rounded-2xl text-center outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button onClick={() => setActiveEdit(null)} className="py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl transition-all hover:bg-slate-700">Cancel</button>
              <button 
                onClick={async () => {
                  await handleQuickLog(activeEdit as any, Number(editValue));
                  setActiveEdit(null);
                }}
                disabled={loading}
                className="py-4 bg-emerald-600 text-white font-bold rounded-2xl transition-all hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessTab;
