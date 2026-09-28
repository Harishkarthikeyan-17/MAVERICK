/**
 * components/BMICalculator.tsx
 * Section: Workout & BMI (BMI sub-section)
 * POST /api/bmi/calculate
 * Visual BMI gauge + category badge + advice
 */

import React, { useState } from 'react';
import { Scale, Loader2, AlertTriangle, Info } from 'lucide-react';
import { calculateBMI, type BMIResponse } from '../services/healthApi';

// WHO BMI scale for the visual ruler
const BMI_RANGES = [
  { label: 'Underweight', min: 0,    max: 18.5, color: '#60a5fa', textColor: 'text-blue-400' },
  { label: 'Normal',      min: 18.5, max: 25,   color: '#34d399', textColor: 'text-emerald-400' },
  { label: 'Overweight',  min: 25,   max: 30,   color: '#fbbf24', textColor: 'text-amber-400' },
  { label: 'Obese I',     min: 30,   max: 35,   color: '#f97316', textColor: 'text-orange-400' },
  { label: 'Obese II+',   min: 35,   max: 50,   color: '#ef4444', textColor: 'text-red-400' },
];

function getBMIPosition(bmi: number): number {
  // Map BMI 10–50 onto 0–100%
  return Math.min(100, Math.max(0, ((bmi - 10) / 40) * 100));
}

const BMICalculator: React.FC = () => {
  const [form, setForm] = useState({ height: '', weight: '' });
  const [result, setResult] = useState<BMIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setError(null);
    if (!form.height || !form.weight) {
      setError('Height and weight are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await calculateBMI({
        height: Number(form.height),
        weight: Number(form.weight),
      });
      setResult(res);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Cannot connect to Health API on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Match category to local config
  const matchedRange = result
    ? BMI_RANGES.find((r) => result.bmi >= r.min && result.bmi < r.max) || BMI_RANGES[BMI_RANGES.length - 1]
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Scale className="text-cyan-400" size={22} />
        <h2 className="text-xl font-bold text-slate-100">BMI Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Your Measurements</h3>

          {/* Height */}
          <div>
            <label className="text-xs text-slate-400 font-medium mb-2 block">Height (cm)</label>
            <div className="relative">
              <input
                type="number"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                placeholder="e.g. 175"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 transition-all placeholder:text-slate-600"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">cm</span>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="text-xs text-slate-400 font-medium mb-2 block">Weight (kg)</label>
            <div className="relative">
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                placeholder="e.g. 70"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 transition-all placeholder:text-slate-600"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">kg</span>
            </div>
          </div>

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
            {loading ? <><Loader2 size={16} className="animate-spin" /> Calculating…</> : <><Scale size={16} /> Calculate BMI</>}
          </button>

          {/* BMI Scale legend */}
          <div className="space-y-1.5 pt-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">WHO BMI Classifications</p>
            {BMI_RANGES.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-slate-400">{r.label}</span>
                </div>
                <span className="text-slate-600 font-mono">{r.min}–{r.max === 50 ? '∞' : r.max}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          {result && matchedRange ? (
            <>
              {/* Main Result Card */}
              <div className="bg-slate-900 border rounded-2xl p-6" style={{ borderColor: matchedRange.color + '50' }}>
                <div className="text-center mb-6">
                  <p className="text-slate-400 text-sm mb-1">Your BMI</p>
                  <p className="text-7xl font-black" style={{ color: matchedRange.color }}>
                    {result.bmi}
                  </p>
                  <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full" style={{ backgroundColor: matchedRange.color + '20' }}>
                    <span className={`text-sm font-bold ${matchedRange.textColor}`}>{result.category}</span>
                  </div>
                </div>

                {/* Visual BMI Gauge */}
                <div className="mb-4">
                  <div className="flex h-4 rounded-full overflow-hidden mb-2">
                    {BMI_RANGES.map((r, i) => (
                      <div
                        key={r.label}
                        className="flex-1 transition-all"
                        style={{ backgroundColor: r.color, opacity: 0.7, borderRadius: i === 0 ? '8px 0 0 8px' : i === BMI_RANGES.length - 1 ? '0 8px 8px 0' : '0' }}
                      />
                    ))}
                  </div>
                  {/* Indicator */}
                  <div className="relative h-2 mt-1">
                    <div
                      className="absolute w-3 h-3 rounded-full -top-1 transition-all duration-700"
                      style={{ left: `${getBMIPosition(result.bmi)}%`, backgroundColor: matchedRange.color, transform: 'translateX(-50%)', boxShadow: `0 0 8px ${matchedRange.color}` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600 mt-2 px-1 font-mono">
                    <span>10</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>50+</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500">Height</p>
                    <p className="text-base font-bold text-slate-200">{result.heightCm} cm</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500">Weight</p>
                    <p className="text-base font-bold text-slate-200">{result.weightKg} kg</p>
                  </div>
                </div>
              </div>

              {/* Ideal Range */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <Info size={15} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold mb-1">Ideal Weight Range for Your Height</p>
                    <p className="text-sm font-bold text-cyan-400">{result.idealRange}</p>
                    <p className="text-xs text-slate-500 mt-0.5">(BMI 18.5–24.9)</p>
                  </div>
                </div>
              </div>

              {/* Advice */}
              <div className="bg-slate-900 border rounded-2xl p-4" style={{ borderColor: matchedRange.color + '30' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: matchedRange.color }}>💡 Health Advice</p>
                <p className="text-sm text-slate-300">{result.advice}</p>
              </div>
            </>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center h-full min-h-48 text-center gap-3">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                <Scale size={32} className="text-slate-600" />
              </div>
              <div>
                <p className="text-slate-400 font-medium">No result yet</p>
                <p className="text-slate-600 text-sm mt-1">Enter height & weight to<br />calculate your BMI</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
