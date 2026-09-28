/**
 * components/ActivityNutrition.tsx
 * Section: Activity & Nutrition
 * Log calories + steps → POST /api/activity/log
 * Renders: Today's summary, 7-day calorie+step trend chart, macros breakdown
 */

import React, { useState, useEffect } from 'react';
import { Flame, Footprints, Plus, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { logActivity, getActivityHistory, type ActivityLog } from '../services/healthApi';

const ActivityNutrition: React.FC = () => {
  const [form, setForm] = useState({ calories: '', steps: '' });
  const [today, setToday] = useState<ActivityLog | null>(null);
  const [history, setHistory] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch 7-day history on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getActivityHistory();
        setHistory(data);
        const todayKey = new Date().toISOString().split('T')[0];
        const todayLog = data.find((d) => d.date === todayKey) || null;
        setToday(todayLog);
      } catch {
        // API offline — show empty state gracefully
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const handleLog = async () => {
    setError(null);
    setSuccess(false);
    if (!form.calories && !form.steps) {
      setError('Enter at least calories or steps to log.');
      return;
    }
    setLoading(true);
    try {
      const res = await logActivity({
        calories: Number(form.calories) || 0,
        steps:    Number(form.steps) || 0,
      });
      setToday(res.data);
      // Update today in history
      setHistory((h) => h.map((d) => d.date === res.data.date ? res.data : d));
      setForm({ calories: '', steps: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Cannot connect to Health API on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const todayCalories = today?.calories || 0;
  const todaySteps    = today?.steps    || 0;
  const calorieGoal   = 2000;
  const stepGoal      = 10000;

  // Macros (estimated from total calories)
  const protein  = Math.round(todayCalories * 0.3 / 4);
  const carbs    = Math.round(todayCalories * 0.45 / 4);
  const fat      = Math.round(todayCalories * 0.25 / 9);

  const chartData = history.map((d) => ({
    date:     new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: d.calories,
    steps:    Math.round(d.steps / 100), // scale steps for dual-axis readability
  }));

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Calories Today', value: todayCalories, max: calorieGoal, unit: 'kcal', color: 'text-orange-400', bar: 'bg-orange-500' },
          { label: 'Steps Today',    value: todaySteps,    max: stepGoal,    unit: 'steps', color: 'text-emerald-400', bar: 'bg-emerald-500' },
          { label: 'Protein',        value: protein,       max: 150,          unit: 'g',    color: 'text-blue-400',   bar: 'bg-blue-500' },
          { label: 'Deficit',        value: Math.max(0, calorieGoal - todayCalories), max: calorieGoal, unit: 'kcal', color: 'text-cyan-400', bar: 'bg-cyan-500' },
        ].map(({ label, value, max, unit, color, bar }) => {
          const pct = Math.min(100, Math.round((value / max) * 100));
          return (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className={`text-2xl font-black ${color}`}>{value} <span className="text-xs font-normal text-slate-500">{unit}</span></p>
              <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-slate-600 mt-1">{pct}% of goal</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Log Activity</h3>

          {[
            { label: 'Calories Consumed', field: 'calories', unit: 'kcal', icon: Flame, color: 'text-orange-400', placeholder: 'e.g. 500' },
            { label: 'Steps Taken',       field: 'steps',    unit: 'steps', icon: Footprints, color: 'text-emerald-400', placeholder: 'e.g. 3000' },
          ].map(({ label, field, unit, icon: Icon, color, placeholder }) => (
            <div key={field}>
              <label className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2">
                <Icon size={13} className={color} /> {label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all placeholder:text-slate-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">{unit}</span>
              </div>
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertTriangle size={15} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <p className="text-xs text-emerald-300">Activity logged successfully!</p>
            </div>
          )}

          <button
            onClick={handleLog}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Logging…</> : <><Plus size={16} /> Log Activity</>}
          </button>

          {/* Macros Breakdown */}
          {todayCalories > 0 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimated Macros</p>
              {[
                { label: 'Protein', value: protein, unit: 'g',  color: 'bg-blue-500', pct: 30 },
                { label: 'Carbs',   value: carbs,   unit: 'g',  color: 'bg-amber-500', pct: 45 },
                { label: 'Fat',     value: fat,     unit: 'g',  color: 'bg-rose-500',  pct: 25 },
              ].map(({ label, value, unit, color, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-300 font-mono">{value}{unit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7-Day Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">7-Day Activity History</h3>
          {fetching ? (
            <div className="flex items-center justify-center h-48"><Loader2 size={24} className="animate-spin text-slate-600" /></div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <defs>
                    <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f97316" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '12px' }}
                    formatter={(val, name) => [
                      name === 'steps' ? `${Number(val) * 100} steps` : `${val} kcal`,
                      name === 'steps' ? 'Steps' : 'Calories',
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                  <Bar dataKey="calories" name="Calories" fill="url(#calGrad)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="steps"    name="Steps (×100)" fill="url(#stepGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityNutrition;
