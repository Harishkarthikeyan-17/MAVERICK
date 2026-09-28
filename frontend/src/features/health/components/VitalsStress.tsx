/**
 * components/VitalsStress.tsx
 * Section: Vitals & Stress
 * Inputs: Heart Rate, Blood Pressure, HRV
 * Calculates stress via POST /api/health/stress
 * Renders: color-coded score card + trend area chart + watch sync button
 */

import React, { useState } from 'react';
import { Heart, Activity, Waves, Watch, Loader2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateStress, syncWatchData, type StressResponse } from '../services/healthApi';

// Simulated 7-day stress trend (updated with live result)
const INITIAL_TREND = [
  { day: 'Mon', score: 35 },
  { day: 'Tue', score: 55 },
  { day: 'Wed', score: 42 },
  { day: 'Thu', score: 68 },
  { day: 'Fri', score: 50 },
  { day: 'Sat', score: 28 },
  { day: 'Sun', score: 30 },
];

const LEVEL_CONFIG = {
  LOW:      { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', bar: 'bg-emerald-500', label: 'Low Stress' },
  MODERATE: { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   bar: 'bg-amber-500',   label: 'Moderate Stress' },
  HIGH:     { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     bar: 'bg-red-500',     label: 'High Stress' },
};

const VitalsStress: React.FC = () => {
  const [form, setForm] = useState({ heartRate: '', bloodPressure: '', hrv: '' });
  const [result, setResult] = useState<StressResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [trend, setTrend]   = useState(INITIAL_TREND);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCalculate = async () => {
    setError(null);
    if (!form.heartRate || !form.bloodPressure || !form.hrv) {
      setError('Please fill in all three fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await calculateStress({
        heartRate:      Number(form.heartRate),
        bloodPressure:  Number(form.bloodPressure),
        hrv:            Number(form.hrv),
      });
      setResult(res);
      // Append today's reading to the trend chart
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      setTrend((t) => {
        const updated = [...t];
        const idx = updated.findIndex((d) => d.day === today);
        if (idx !== -1) updated[idx] = { ...updated[idx], score: res.score };
        else updated.push({ day: today, score: res.score });
        return updated;
      });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Could not connect to the Health API. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchSync = async () => {
    setSyncing(true);
    try {
      // Simulate realistic smartwatch data
      await syncWatchData({
        heartRate:     Math.floor(60 + Math.random() * 30),
        bloodPressure: Math.floor(110 + Math.random() * 20),
        hrv:           Math.floor(40 + Math.random() * 40),
        steps:         Math.floor(3000 + Math.random() * 5000),
      });
      // Pre-fill the form with the synced values
      setForm({
        heartRate:     String(Math.floor(60 + Math.random() * 30)),
        bloodPressure: String(Math.floor(110 + Math.random() * 20)),
        hrv:           String(Math.floor(40 + Math.random() * 40)),
      });
    } catch {
      setError('Smartwatch sync failed. Check API connection.');
    } finally {
      setSyncing(false);
    }
  };

  const cfg = result ? LEVEL_CONFIG[result.level] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Heart className="text-rose-400" size={22} /> Vitals & Stress Analysis
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">Enter your vital signs to get a real-time stress score</p>
        </div>
        <button
          onClick={handleWatchSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all text-sm font-medium disabled:opacity-50"
        >
          {syncing ? <Loader2 size={15} className="animate-spin" /> : <Watch size={15} />}
          {syncing ? 'Syncing…' : 'Sync Watch'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Vital Signs Input</h3>

          {[
            { label: 'Heart Rate', field: 'heartRate', unit: 'bpm', icon: Heart, color: 'text-rose-400', placeholder: 'e.g. 72', hint: 'Normal: 60–100 bpm' },
            { label: 'Blood Pressure (Systolic)', field: 'bloodPressure', unit: 'mmHg', icon: Activity, color: 'text-cyan-400', placeholder: 'e.g. 120', hint: 'Normal: < 120 mmHg' },
            { label: 'Heart Rate Variability (HRV)', field: 'hrv', unit: 'ms', icon: Waves, color: 'text-purple-400', placeholder: 'e.g. 60', hint: 'Higher is better: 60–100' },
          ].map(({ label, field, unit, icon: Icon, color, placeholder, hint }) => (
            <div key={field}>
              <label className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2">
                <Icon size={13} className={color} /> {label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form[field as keyof typeof form]}
                  onChange={handleChange(field)}
                  placeholder={placeholder}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 transition-all placeholder:text-slate-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">{unit}</span>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">{hint}</p>
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertTriangle size={15} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <><TrendingUp size={16} /> Calculate Stress Score</>}
          </button>
        </div>

        {/* Result Card */}
        <div className="space-y-4">
          {result && cfg ? (
            <div className={`bg-slate-900 border ${cfg.border} rounded-2xl p-6 space-y-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center`}>
                  <CheckCircle2 size={20} className={cfg.color} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Stress Level</p>
                  <h3 className={`text-xl font-bold ${cfg.color}`}>{cfg.label}</h3>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-slate-500">Score</p>
                  <p className={`text-3xl font-black ${cfg.color}`}>{result.score}</p>
                </div>
              </div>

              {/* Score Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 — Low</span><span>50 — Moderate</span><span>100 — High</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cfg.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              <div className={`p-3 ${cfg.bg} border ${cfg.border} rounded-xl`}>
                <p className="text-sm text-slate-200">💡 {result.tip}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Heart Rate', value: `${form.heartRate} bpm` },
                  { label: 'Blood Pressure', value: `${form.bloodPressure} mmHg` },
                  { label: 'HRV', value: `${form.hrv} ms` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800 rounded-xl p-2">
                    <p className="text-[10px] text-slate-500">{label}</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center h-48 text-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                <Heart size={24} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">Enter your vitals and click<br /><strong className="text-slate-400">Calculate Stress Score</strong></p>
            </div>
          )}

          {/* 7-Day Trend Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">7-Day Stress Trend</p>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#06b6d4" fill="url(#stressGrad)" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsStress;
