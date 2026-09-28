import React, { useState } from 'react';
import { Building2, TrendingUp, Calculator } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` :
  n >= 100000   ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000     ? `₹${(n / 1000).toFixed(0)}K` :
  `₹${n}`;

const RealEstate: React.FC = () => {
  const [propertyValue, setPropertyValue]     = useState(5000000);
  const [downPaymentPct, setDownPaymentPct]   = useState(20);
  const [loanRate, setLoanRate]               = useState(8.5);
  const [tenure, setTenure]                   = useState(20);
  const [monthlyRent, setMonthlyRent]         = useState(18000);
  const [appreciation, setAppreciation]       = useState(7);

  const downPayment = propertyValue * downPaymentPct / 100;
  const loanAmount  = propertyValue - downPayment;
  const r = loanRate / 100 / 12;
  const n = tenure * 12;
  const emi = r > 0 ? Math.round(loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)) : 0;
  const totalInterest = emi * n - loanAmount;
  const totalCost = downPayment + emi * n;

  // Rent vs Buy breakeven analysis
  const chartData = Array.from({ length: tenure + 1 }, (_, yr) => {
    const rentTotal = monthlyRent * 12 * yr * (1 + 0.05) ** yr; // rent grows 5%/yr
    const propertyValue_ = propertyValue * (1 + appreciation / 100) ** yr;
    const ownershipCost = downPayment + emi * 12 * yr;
    const netOwnership = ownershipCost - (propertyValue_ - propertyValue); // cost minus appreciation gain
    return {
      year: `Yr ${yr}`,
      'Renting Cost': Math.round(rentTotal),
      'Owning Cost (Net)': Math.round(netOwnership),
    };
  });

  const breakEvenYr = chartData.findIndex(d => d['Owning Cost (Net)'] < d['Renting Cost']);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>{p.name}: {formatINR(p.value)}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 size={20} className="text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-100">Real Estate Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300">Property Details</h4>
          {[
            { label: 'Property Value',        value: propertyValue, min: 1000000, max: 50000000, step: 100000, unit: '₹', setter: setPropertyValue },
            { label: 'Down Payment',          value: downPaymentPct, min: 10, max: 50, step: 5, unit: '%', setter: setDownPaymentPct },
            { label: 'Loan Interest Rate',    value: loanRate, min: 6, max: 15, step: 0.1, unit: '%', setter: setLoanRate },
            { label: 'Loan Tenure',           value: tenure, min: 5, max: 30, step: 1, unit: 'yrs', setter: setTenure },
            { label: 'Current Monthly Rent',  value: monthlyRent, min: 5000, max: 100000, step: 1000, unit: '₹', setter: setMonthlyRent },
            { label: 'Property Appreciation', value: appreciation, min: 3, max: 15, step: 0.5, unit: '%', setter: setAppreciation },
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
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300">Analysis</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'EMI',           value: `₹${emi.toLocaleString('en-IN')}`, color: 'text-cyan-400'   },
              { label: 'Down Payment',  value: formatINR(downPayment),            color: 'text-purple-400' },
              { label: 'Loan Amount',   value: formatINR(loanAmount),             color: 'text-slate-200'  },
              { label: 'Total Interest',value: formatINR(totalInterest),          color: 'text-red-400'    },
              { label: 'Total Cost',    value: formatINR(totalCost),              color: 'text-amber-400'  },
              { label: 'Break-even',    value: breakEvenYr > 0 ? `Year ${breakEvenYr}` : '?', color: 'text-green-400' },
            ].map(s => (
              <div key={s.label} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {breakEvenYr > 0 && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-sm text-green-200">
                🏠 Buying becomes cheaper than renting after{' '}
                <strong>Year {breakEvenYr}</strong> considering property appreciation of {appreciation}%/yr.
              </p>
            </div>
          )}

          {/* Property value appreciation */}
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-sm font-bold text-slate-300">Property Appreciation</span>
            </div>
            <div className="space-y-2">
              {[5, 10, 20].map(yr => {
                const val = propertyValue * (1 + appreciation / 100) ** yr;
                return (
                  <div key={yr} className="flex justify-between text-sm">
                    <span className="text-slate-400">{yr} years</span>
                    <span className="font-bold text-green-400">{formatINR(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Rent vs Buy Chart */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Calculator size={14} className="text-purple-400" />
          Rent vs Buy — Cumulative Cost Over Time
        </h4>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={4} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => formatINR(v)} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="Renting Cost" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Owning Cost (Net)" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RealEstate;
