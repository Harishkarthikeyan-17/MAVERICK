import React, { useMemo } from 'react';
import { Zap, TrendingUp, AlertTriangle, Calendar, Target } from 'lucide-react';
import StressMeter from './StressMeter';

interface Financials {
  income: number;
  expense: number;
  savings: number;
  savingsRatio: number;
  totalScore: number;
  scoreLabel: string;
}

interface Goal {
  name: string;
  target: number;
  current: number;
  deadline: string;
}

interface Bill {
  date: string;
  amount: number;
  category: string;
  type: string;
}

interface Props {
  financials: Financials;
  upcomingBills: Bill[];
  goals: Goal[];
}

const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` :
  n >= 100000  ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000    ? `₹${(n / 1000).toFixed(1)}K` :
  `₹${n}`;

const DashboardHero: React.FC<Props> = ({ financials, upcomingBills, goals }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Financial stress score (0=stable, 100=critical)
  const stressScore = useMemo(() => {
    let score = 0;
    // Low savings ratio adds stress
    if (financials.savingsRatio < 10 && financials.income > 0) score += 40;
    else if (financials.savingsRatio < 20 && financials.income > 0) score += 20;
    // Expenses > income
    if (financials.expense > financials.income && financials.income > 0) score += 35;
    // Low health score
    if (financials.totalScore < 40) score += 25;
    else if (financials.totalScore < 60) score += 10;
    return Math.min(100, score);
  }, [financials]);

  const aiSummaries = useMemo(() => {
    const summaries = [];
    if (financials.savingsRatio > 25) {
      summaries.push({ icon: '🎯', text: `Your savings rate of ${financials.savingsRatio.toFixed(0)}% is excellent — top 20% of earners.`, color: 'text-green-300', bg: 'bg-green-500/10 border-green-500/20' });
    } else if (financials.savingsRatio < 10 && financials.income > 0) {
      summaries.push({ icon: '⚠️', text: `Savings rate at ${financials.savingsRatio.toFixed(0)}% — target 20% for financial security.`, color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20' });
    }
    if (financials.expense > financials.income && financials.income > 0) {
      summaries.push({ icon: '🔴', text: 'Expenses exceeded income this period. Immediate review recommended.', color: 'text-red-300', bg: 'bg-red-500/10 border-red-500/20' });
    } else {
      summaries.push({ icon: '💡', text: 'You spent more on weekends. Consider reviewing discretionary spending.', color: 'text-cyan-300', bg: 'bg-cyan-500/10 border-cyan-500/20' });
    }
    summaries.push({ icon: '📈', text: `Emergency fund covers ~${Math.max(0, Math.round(financials.savings / Math.max(1, financials.expense / 30)))} days at current burn rate.`, color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/20' });
    return summaries.slice(0, 3);
  }, [financials]);

  const nextBills = upcomingBills.slice(0, 3);
  const topGoals = goals.slice(0, 2);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 mb-0">
      {/* Hero top */}
      <div className="p-6 pb-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Greeting + AI summaries */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">👋</span>
              <h2 className="text-2xl font-bold text-slate-100">{greeting}, there!</h2>
            </div>
            <p className="text-slate-400 text-sm mb-5">Here's your financial pulse for today</p>

            <div className="space-y-2">
              {aiSummaries.map((s, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${s.bg}`}>
                  <span className="text-base shrink-0 mt-0.5">{s.icon}</span>
                  <p className={s.color}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Stress Meter */}
          <div className="flex flex-col items-center justify-center gap-2 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Financial Stress</span>
            </div>
            <StressMeter score={stressScore} />
            <p className="text-xs text-slate-500 text-center max-w-[160px] mt-1">
              Based on savings ratio, expense trends & health score
            </p>
          </div>

          {/* Right: Quick Stats */}
          <div className="flex flex-col gap-3 min-w-[180px]">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-green-400" />
                <span className="text-xs text-slate-400">Net Balance</span>
              </div>
              <p className={`text-xl font-bold ${financials.savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatINR(Math.abs(financials.savings))}
              </p>
              <p className="text-xs text-slate-500 mt-1">Savings ratio: {financials.savingsRatio.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Target size={14} className="text-cyan-400" />
                <span className="text-xs text-slate-400">Health Score</span>
              </div>
              <p className="text-xl font-bold text-cyan-400">{financials.totalScore}<span className="text-sm text-slate-500">/100</span></p>
              <p className="text-xs text-slate-500 mt-1">{financials.scoreLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip: Upcoming bills + Goals */}
      <div className="border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
        {/* Upcoming bills */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={13} className="text-amber-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Bills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {nextBills.length === 0 && <p className="text-xs text-slate-500">No upcoming bills</p>}
            {nextBills.map((b, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700/50 text-xs">
                <span className="text-amber-400 font-bold">₹{b.amount.toLocaleString('en-IN')}</span>
                <span className="text-slate-400">{b.category}</span>
                <span className="text-slate-600">{b.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goal snapshots */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={13} className="text-purple-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goal Progress</span>
          </div>
          <div className="space-y-2">
            {topGoals.length === 0 && <p className="text-xs text-slate-500">No goals set</p>}
            {topGoals.map((g, i) => {
              const pct = Math.round((g.current / g.target) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{g.name}</span>
                    <span className="text-cyan-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
