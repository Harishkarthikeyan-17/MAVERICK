import React, { useState, useMemo } from 'react';
import { Landmark, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` :
  n >= 100000   ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000     ? `₹${(n / 1000).toFixed(1)}K` :
  `₹${Math.round(n)}`;

const RetirementPlanner: React.FC = () => {
  const [currentAge, setCurrentAge]         = useState(30);
  const [retirementAge, setRetirementAge]   = useState(60);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContrib, setMonthlyContrib] = useState(10000);
  const [inflation, setInflation]           = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(10);

  const { corpus, readiness, chartData, monthlyNeeded, shortfall } = useMemo(() => {
    const years = retirementAge - currentAge;
    if (years <= 0) return { corpus: 0, readiness: 0, chartData: [], monthlyNeeded: 0, shortfall: 0 };

    const r = expectedReturn / 100 / 12;
    const n = years * 12;

    // FV of current savings
    const fvSavings = currentSavings * Math.pow(1 + r, n);
    // FV of monthly contributions (annuity)
    const fvContrib = r > 0 ? monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) : monthlyContrib * n;
    const totalCorpus = fvSavings + fvContrib;

    // Monthly expense at retirement (inflation adjusted, need for 25yrs)
    const monthlyExpenseNow = 50000;
    const inflatedExpense = monthlyExpenseNow * Math.pow(1 + inflation / 100, years);
    const corpusNeeded = inflatedExpense * 12 * 25; // 25yr retirement

    const readiness = Math.min(100, Math.round((totalCorpus / corpusNeeded) * 100));
    const shortfall = Math.max(0, corpusNeeded - totalCorpus);
    const monthlyNeeded = shortfall > 0 && n > 0 && r > 0
      ? shortfall * r / (Math.pow(1 + r, n) - 1)
      : 0;

    // Chart data (yearly)
    const chartData = [];
    let cv = currentSavings;
    for (let y = 0; y <= years; y++) {
      chartData.push({
        year: `Age ${currentAge + y}`,
        corpus: Math.round(cv),
        target: Math.round(corpusNeeded * (y / years)),
      });
      cv = cv * (1 + expectedReturn / 100) + monthlyContrib * 12;
    }

    return { corpus: totalCorpus, readiness, chartData, monthlyNeeded, shortfall };
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, inflation, expectedReturn]);

  const readinessColor = readiness >= 80 ? '#22c55e' : readiness >= 50 ? '#f59e0b' : '#ef4444';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>
              {p.name === 'corpus' ? 'Projected' : 'Target'}: {formatINR(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <Landmark size={20} className="text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-100">Retirement Planner</h3>
      </div>
      <p className="text-sm text-slate-400 -mt-4">Plan your retirement corpus with inflation-adjusted projections</p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Current Age', value: currentAge, min: 18, max: 70, step: 1, unit: 'yrs', setter: setCurrentAge },
          { label: 'Retirement Age', value: retirementAge, min: 40, max: 80, step: 1, unit: 'yrs', setter: setRetirementAge },
          { label: 'Monthly Contribution', value: monthlyContrib, min: 1000, max: 200000, step: 1000, unit: '₹', setter: setMonthlyContrib },
          { label: 'Current Savings', value: currentSavings, min: 0, max: 10000000, step: 10000, unit: '₹', setter: setCurrentSavings },
          { label: 'Expected Returns', value: expectedReturn, min: 4, max: 20, step: 0.5, unit: '%', setter: setExpectedReturn },
          { label: 'Inflation Rate', value: inflation, min: 3, max: 12, step: 0.5, unit: '%', setter: setInflation },
        ].map(({ label, value, min, max, step, unit, setter }) => (
          <div key={label} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <label className="text-slate-400 font-medium">{label}</label>
              <span className="text-cyan-400 font-bold">
                {unit === '₹' ? formatINR(value) : `${value}${unit}`}
              </span>
            </div>
            <input
              type="range" min={min} max={max} step={step} value={value}
              onChange={e => setter(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-1">Years to Retire</p>
          <p className="text-2xl font-bold text-slate-100">{Math.max(0, retirementAge - currentAge)}</p>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: '#22c55e15', borderColor: '#22c55e40' }}>
          <p className="text-xs text-slate-400 mb-1">Projected Corpus</p>
          <p className="text-xl font-bold text-green-400">{formatINR(corpus)}</p>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: readinessColor + '15', borderColor: readinessColor + '40' }}>
          <p className="text-xs text-slate-400 mb-1">Readiness Score</p>
          <p className="text-2xl font-bold" style={{ color: readinessColor }}>{readiness}%</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-1">Extra Monthly Needed</p>
          <p className="text-lg font-bold text-amber-400">{monthlyNeeded > 0 ? formatINR(monthlyNeeded) : '✅ On Track'}</p>
        </div>
      </div>

      {shortfall > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-200">
            You have a projected shortfall of <strong>{formatINR(shortfall)}</strong>. 
            To bridge this gap, consider increasing your monthly contribution by{' '}
            <strong>₹{Math.round(monthlyNeeded).toLocaleString('en-IN')}</strong> or increasing your investment return through diversified mutual funds.
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ret-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={Math.max(0, Math.floor(chartData.length / 6) - 1)} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => formatINR(v)} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="corpus" name="corpus" stroke="#22c55e" strokeWidth={2.5} fill="url(#ret-grad)" dot={false} />
            <Area type="monotone" dataKey="target" name="target" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RetirementPlanner;
