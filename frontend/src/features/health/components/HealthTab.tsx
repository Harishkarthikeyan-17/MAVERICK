import React, { useState, useEffect } from 'react';
import { Heart, Activity, Waves, Zap, Moon, Footprints, Watch, Loader2, Brain, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateStress, calculateEnergy, syncWatchData, type StressResponse, type EnergyResponse } from '../services/healthApi';
import SummaryCard from './SummaryCard';

interface HealthTabProps {
  healthData: any;
  setHealthData: React.Dispatch<React.SetStateAction<any>>;
  syncing: boolean;
  setSyncing: React.Dispatch<React.SetStateAction<boolean>>;
}

const HealthTab: React.FC<HealthTabProps> = ({ healthData, setHealthData, syncing, setSyncing }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEdit, setActiveEdit] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    updateResults();
  }, [healthData.heartRate, healthData.bloodPressure, healthData.hrv, healthData.steps, healthData.sleep, healthData.calories]);

  const updateResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, eRes] = await Promise.all([
        calculateStress({ heartRate: healthData.heartRate, bloodPressure: healthData.bloodPressure, hrv: healthData.hrv }),
        calculateEnergy({ activitySteps: healthData.steps, sleepHours: healthData.sleep, caloriesConsumed: healthData.calories })
      ]);
      setHealthData(prev => ({
        ...prev,
        stressScore: sRes.score,
        stressLevel: sRes.level,
        stressTip: sRes.tip,
        energyScore: eRes.score,
        energyLevel: eRes.level,
        energyMessage: eRes.message,
      }));
    } catch (err) {
      console.error('Failed to update health results', err);
      setError('Failed to fetch latest health insights.');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncWatchData({
        heartRate: Math.floor(65 + Math.random() * 20),
        bloodPressure: Math.floor(115 + Math.random() * 15),
        hrv: Math.floor(55 + Math.random() * 25),
        steps: Math.floor(5000 + Math.random() * 5000)
      });
      setHealthData(prev => ({
        ...prev,
        heartRate: 74,
        bloodPressure: 118,
        hrv: 68,
        steps: 9200
      }));
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  const openEdit = (field: string, current: number) => {
    setActiveEdit(field);
    setEditValue(String(current));
  };

  const saveEdit = () => {
    if (!activeEdit) return;
    const val = Number(editValue);
    if (isNaN(val)) return;

    setHealthData(prev => ({ ...prev, [activeEdit]: val }));
    setActiveEdit(null);
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

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-rose-400" size={20} />
            <p className="text-sm font-medium text-rose-200">{error}</p>
          </div>
          <button 
            onClick={updateResults}
            className="flex items-center gap-2 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Top Results Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <>
            <div className="bg-slate-900 border border-rose-500/10 p-6 rounded-3xl h-32 animate-pulse"></div>
            <div className="bg-slate-900 border border-cyan-500/10 p-6 rounded-3xl h-32 animate-pulse"></div>
          </>
        ) : (
          <>
            {healthData.stressLevel && (
              <div className="bg-slate-900 border border-rose-500/20 p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group">
                <div className="space-y-1 relative z-10 w-1/2">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Stress Index</p>
                  <h3 className="text-4xl font-black text-white">{healthData.stressScore}</h3>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Brain size={14} className="text-purple-400" /> {healthData.stressLevel} Stress
                  </p>
                </div>
                <div className="text-right relative z-10 w-1/2 flex flex-col items-end justify-center">
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {healthData.stressTip || 'Keep your stress levels in check.'}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full group-hover:bg-rose-500/10 transition-all duration-500" />
              </div>
            )}

            {healthData.energyLevel && (
              <div className="bg-slate-900 border border-cyan-500/20 p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group">
                <div className="space-y-1 relative z-10 w-1/2">
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Energy Level</p>
                  <h3 className="text-4xl font-black text-white">{healthData.energyScore}</h3>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> {healthData.energyLevel} Vitality
                  </p>
                </div>
                <div className="text-right relative z-10 w-1/2 flex flex-col items-end justify-center">
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {healthData.energyMessage || 'Maintain your energy throughout the day.'}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-all duration-500" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard 
          label="Heart Rate" 
          value={healthData.heartRate} 
          unit="bpm" 
          icon={Heart} 
          color="text-rose-400" 
          bg="bg-rose-500/10" 
          subValue="60-100 normal"
          onClick={() => openEdit('heartRate', healthData.heartRate)}
        />
        <SummaryCard 
          label="Blood Pressure" 
          value={healthData.bloodPressure} 
          unit="mmHg" 
          icon={Activity} 
          color="text-cyan-400" 
          bg="bg-cyan-500/10" 
          subValue="< 120 normal"
          onClick={() => openEdit('bloodPressure', healthData.bloodPressure)}
        />
        <SummaryCard 
          label="HRV" 
          value={healthData.hrv} 
          unit="ms" 
          icon={Waves} 
          color="text-purple-400" 
          bg="bg-purple-500/10" 
          subValue="60-100 optimal"
          onClick={() => openEdit('hrv', healthData.hrv)}
        />
        <SummaryCard 
          label="Sleep" 
          value={healthData.sleep} 
          unit="hrs" 
          icon={Moon} 
          color="text-indigo-400" 
          bg="bg-indigo-500/10" 
          progress={(healthData.sleep / 8) * 100}
          onClick={() => openEdit('sleep', healthData.sleep)}
        />
        <SummaryCard 
          label="Steps" 
          value={healthData.steps} 
          unit="steps" 
          icon={Footprints} 
          color="text-emerald-400" 
          bg="bg-emerald-500/10" 
          progress={(healthData.steps / 10000) * 100}
          onClick={() => openEdit('steps', healthData.steps)}
        />
      </div>

      {/* Sync Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
            <Watch size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Device Sync</p>
            <p className="text-[10px] text-slate-500">Last synced 2m ago</p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          {syncing ? <Loader2 size={14} className="animate-spin" /> : <Watch size={14} />}
          {syncing ? 'Syncing...' : 'Sync Device'}
        </button>
      </div>

      {/* Trends Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-400" /> Weekly Trends
          </h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { day: 'Mon', stress: 30, energy: 80 },
              { day: 'Tue', stress: 45, energy: 70 },
              { day: 'Wed', stress: 25, energy: 85 },
              { day: 'Thu', stress: 55, energy: 60 },
              { day: 'Fri', stress: 40, energy: 75 },
              { day: 'Sat', stress: 20, energy: 90 },
              { day: 'Sun', stress: 15, energy: 95 },
            ]}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="stress" stroke="#f43f5e" fillOpacity={1} fill="url(#colorStress)" strokeWidth={2} />
              <Area type="monotone" dataKey="energy" stroke="#06b6d4" fillOpacity={1} fill="url(#colorEnergy)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Edit Modal / Drawer */}
      {activeEdit && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={(e) => { if (e.target === e.currentTarget) setActiveEdit(null); }}
        >
          <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-8 pb-10 sm:pb-8 shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 relative">
            <h3 className="text-xl font-black text-white mb-2 capitalize">Edit {activeEdit.replace(/([A-Z])/g, ' $1')}</h3>
            <p className="text-sm text-slate-400 mb-6">Update your latest reading manually.</p>
            
            <div className="space-y-4">
              <input 
                type="number" 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                className="w-full bg-slate-800 border border-slate-700 text-white text-3xl font-black p-6 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 outline-none text-center"
              />
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveEdit(null)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEdit}
                  className="py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTab;
