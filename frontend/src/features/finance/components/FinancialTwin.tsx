import React, { useState, useMemo } from 'react';
import { TrendingUp, Sliders, Info } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

type Scenario = 'optimistic' | 'realistic' | 'pessimistic';
type Horizon = 1 | 3 | 5 | 10;

interface Props {
  monthlyIncome: number;
  monthlyExpense: number;
  currentSavings: number;
}

const SCENARIO_CONFIG = {
  optimistic:  { returnRate: 0.14, savingsBoost: 1.3, color: '#22c55e', label: '🚀 Optimistic', desc: '14% annual returns, increased savings' },
  realistic:   { returnRate: 0.10, savingsBoost: 1.0, color: '#0ea5e9', label: '📊 Realistic',  desc: '10% annual returns, current savings rate' },
  pessimistic: { returnRate: 0.06, savingsBoost: 0.7, color: '#f59e0b', label: '⚠️ Pessimistic', desc: '6% annual returns, reduced savings' },
};

const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` :
  n >= 100000  ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000    ? `₹${(n / 1000).toFixed(1)}K` :
  `₹${Math.round(n)}`;

const projectNetWorth = (
  months: number,
  monthlyIncome: number,
  monthlyExpense: number,
  currentSavings: number,
  annualReturn: number,
  savingsBoost: number,
  savingsIncrease: number,
  expenseReduction: number,
) => {
  const monthlyReturn = annualReturn / 12;
  const baseMonthlySavings = (monthlyIncome - monthlyExpense) * savingsBoost;
  const adjustedSavings = baseMonthlySavings * (1 + savingsIncrease / 100);
  const adjustedExpense = monthlyExpense * (1 - expenseReduction / 100);
  const netMonthly = monthlyIncome - adjustedExpense + adjustedSavings - baseMonthlySavings;

  let corpus = currentSavings;
  const data = [{ month: 'Now', value: Math.round(corpus), label: 'Now' }];

  for (let m = 1; m <= months; m++) {
    corpus = corpus * (1 + monthlyReturn) + (baseMonthlySavings + netMonthly / months);
    if (m % Math.max(1, Math.floor(months / 12)) === 0 || m === months) {
      const yr = Math.floor(m / 12);
      data.push({
        month: m <= 12 ? `${m}M` : `${yr}Y`,
        value: Math.round(Math.max(0, corpus)),
        label: m <= 12 ? `Month ${m}` : `Year ${yr}`,
      });
    }
  }
  return data;
};

const FinancialTwin: React.FC<Props> = ({ monthlyIncome, monthlyExpense, currentSavings }) => {
  const [scenario, setScenario] = useState<Scenario>('realistic');
  const [horizon, setHorizon] = useState<Horizon>(5);
  const [savingsIncrease, setSavingsIncrease] = useState(0);
  const [expenseReduction, setExpenseReduction] = useState(0);
  const [showWhatIf, setShowWhatIf] = useState(false);

  const cfg = SCENARIO_CONFIG[scenario];

  const chartData = useMemo(() => projectNetWorth(
    horizon * 12,
    monthlyIncome,
    monthlyExpense,
    currentSavings,
    cfg.returnRate,
    cfg.savingsBoost,
    savingsIncrease,
    expenseReduction,
  ), [scenario, horizon, savingsIncrease, expenseReduction, monthlyIncome, monthlyExpense, currentSavings, cfg]);

  const finalValue = chartData[chartData.length - 1]?.value || 0;
  const startValue = chartData[0]?.value || currentSavings;
  const growth = startValue > 0 ? ((finalValue - startValue) / startValue) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-xs text-slate-400 mb-1">{payload[0]?.payload?.label}</p>
          <p className="text-lg font-bold" style={{ color: cfg.color }}>{formatINR(payload[0]?.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-400" />
            Financial Twin
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">AI simulation of your financial future</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {([1, 3, 5, 10] as Horizon[]).map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                horizon === h
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {h}Y
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Toggle */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(SCENARIO_CONFIG) as Scenario[]).map(sc => {
          const c = SCENARIO_CONFIG[sc];
          return (
            <button
              key={sc}
              onClick={() => setScenario(sc)}
              className={`p-3 rounded-xl border text-left transition-all ${
                scenario === sc
                  ? 'border-opacity-60 bg-opacity-10'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
              style={scenario === sc ? { borderColor: c.color + '80', backgroundColor: c.color + '15' } : {}}
            >
              <p className="text-xs font-bold text-slate-200">{c.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">{c.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Projection Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-1">Starting</p>
          <p className="text-lg font-bold text-slate-200">{formatINR(startValue)}</p>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: cfg.color + '15', borderColor: cfg.color + '40' }}>
          <p className="text-xs text-slate-400 mb-1">In {horizon} Year{horizon > 1 ? 's' : ''}</p>
          <p className="text-lg font-bold" style={{ color: cfg.color }}>{formatINR(finalValue)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-1">Growth</p>
          <p className={`text-lg font-bold ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`twin-grad-${scenario}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={cfg.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => formatINR(v)} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={cfg.color}
              strokeWidth={2.5}
              fill={`url(#twin-grad-${scenario})`}
              dot={{ fill: cfg.color, strokeWidth: 0, r: 3 }}
              activeDot={{ r: 6, fill: cfg.color, stroke: 'white', strokeWidth: 2 }}
            />
            <ReferenceLine y={startValue} stroke="#334155" strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* What If Panel */}
      <div className="border border-slate-700/50 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowWhatIf(!showWhatIf)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-purple-400" />
            <span className="text-sm font-bold text-slate-200">What If? Simulator</span>
            <span className="text-xs text-slate-500">— adjust sliders to see impact</span>
          </div>
          <span className={`text-slate-400 text-xs transition-transform duration-200 ${showWhatIf ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showWhatIf && (
          <div className="p-5 space-y-5 bg-slate-900/30">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-300 font-medium">Increase monthly savings by</label>
                <span className="text-purple-400 font-bold">+{savingsIncrease}%</span>
              </div>
              <input
                type="range" min={0} max={50} step={5}
                value={savingsIncrease}
                onChange={e => setSavingsIncrease(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span><span>50%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-300 font-medium">Reduce expenses by</label>
                <span className="text-cyan-400 font-bold">-{expenseReduction}%</span>
              </div>
              <input
                type="range" min={0} max={40} step={5}
                value={expenseReduction}
                onChange={e => setExpenseReduction(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span><span>40%</span>
              </div>
            </div>

            {(savingsIncrease > 0 || expenseReduction > 0) && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-xs text-purple-300 flex items-center gap-1 mb-1">
                  <Info size={12} /> AI Insight
                </p>
                <p className="text-sm text-slate-200">
                  With these changes, your projected corpus in {horizon} year{horizon > 1 ? 's' : ''} would be{' '}
                  <strong style={{ color: cfg.color }}>{formatINR(finalValue)}</strong>.
                  {savingsIncrease > 0 && ` Saving ${savingsIncrease}% more monthly is equivalent to ₹${Math.round((monthlyIncome - monthlyExpense) * savingsIncrease / 100).toLocaleString('en-IN')} extra/month.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialTwin;
