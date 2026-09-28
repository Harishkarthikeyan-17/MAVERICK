/**
 * components/EnergyLevel.tsx
 * Section: Energy & Mindfulness (Energy sub-section)
 * Inputs: Steps, Sleep, Calories → POST /api/energy/calculate
 * Renders: Circular progress + level badge + energy trend
 */

import React, { useState } from 'react';
import { Zap, Moon, Footprints, Flame, Loader2, AlertTriangle } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateEnergy, type EnergyResponse } from '../services/healthApi';

const LEVEL_CONFIG = {
  Low:      { color: 'text-slate-400',   bg: 'bg-slate-500/10',   bar: '#64748b', glow: '' },
  Moderate: { color: 'text-amber-400',   bg: 'bg-amber-500/10',   bar: '#f59e0b', glow: 'shadow-amber-500/20' },
  High:     { color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    bar: '#06b6d4', glow: 'shadow-cyan-500/20' },
  Peak:     { color: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: '#10b981', glow: 'shadow-emerald-500/20' },
};

const EnergyLevel: React.FC = () => {
  const [form, setForm] = useState({ activitySteps: '', sleepHours: '', caloriesConsumed: '' });
  const [result, setResult] = useState<EnergyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCalculate = async () => {
    setError(null);
    if (!form.activitySteps || !form.sleepHours || !form.caloriesConsumed) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await calculateEnergy({
        activitySteps:    Number(form.activitySteps),
        sleepHours:       Number(form.sleepHours),
        caloriesConsumed: Number(form.caloriesConsumed),
      });
      setResult(res);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Cannot connect to Health API on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const cfg     = result ? LEVEL_CONFIG[result.level] : LEVEL_CONFIG['Low'];
  const radData = result ? [{ name: 'Energy', value: result.score, fill: cfg.bar }] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Zap size={14} className="text-amber-400" /> Energy Inputs
        </h3>

        {[
          { label: 'Daily Steps', field: 'activitySteps', unit: 'steps', icon: Footprints, color: 'text-emerald-400', placeholder: 'e.g. 8000', hint: 'Goal: 10,000 steps/day' },
          { label: 'Sleep Last Night', field: 'sleepHours', unit: 'hrs', icon: Moon, color: 'text-purple-400', placeholder: 'e.g. 7.5', hint: 'Optimal: 7–9 hours' },
          { label: 'Calories Consumed', field: 'caloriesConsumed', unit: 'kcal', icon: Flame, color: 'text-orange-400', placeholder: 'e.g. 1800', hint: 'Target: ~2000 kcal/day' },
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
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all placeholder:text-slate-600"
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
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Calculating…</> : <><Zap size={16} /> Calculate Energy</>}
        </button>
      </div>

      {/* Result Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
        {result ? (
          <>
            {/* Circular Gauge */}
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="65%" outerRadius="90%"
                  startAngle={90} endAngle={-270}
                  data={radData}
                  barSize={16}
                >
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#1e293b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val) => [`${val}%`, 'Energy Score']}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${cfg.color}`}>{result.score}</span>
                <span className="text-xs text-slate-500 font-mono">/100</span>
              </div>
            </div>

            {/* Level Badge */}
            <div className={`px-6 py-2 ${cfg.bg} rounded-full`}>
              <span className={`text-lg font-black ${cfg.color} tracking-wide`}>{result.level.toUpperCase()} ENERGY</span>
            </div>

            {/* Breakdown */}
            <div className="w-full grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Steps', value: form.activitySteps, unit: 'steps', max: 10000 },
                { label: 'Sleep', value: form.sleepHours, unit: 'hrs', max: 8 },
                { label: 'Calories', value: form.caloriesConsumed, unit: 'kcal', max: 2000 },
              ].map(({ label, value, unit, max }) => {
                const pct = Math.min(100, Math.round((Number(value) / max) * 100));
                return (
                  <div key={label} className="bg-slate-800 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-200">{value} <span className="text-[10px] text-slate-500">{unit}</span></p>
                    <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: cfg.bar }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message */}
            <div className={`w-full p-3 ${cfg.bg} rounded-xl`}>
              <p className="text-sm text-slate-200 text-center">{result.message}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
              <Zap size={36} className="text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 font-medium">No data yet</p>
              <p className="text-slate-600 text-sm mt-1">Fill in your daily stats and<br />calculate your energy score</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyLevel;
