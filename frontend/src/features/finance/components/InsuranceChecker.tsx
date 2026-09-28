import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

interface Policy {
  id: string;
  type: string;
  emoji: string;
  provider: string;
  coverage: number;
  recommended: number;
  premium: number;
  renewalDate: string;
  status: 'adequate' | 'low' | 'critical' | 'missing';
}

const POLICIES: Policy[] = [
  {
    id: '1',
    type: 'Health Insurance',
    emoji: '🏥',
    provider: 'Star Health',
    coverage: 500000,
    recommended: 1000000,
    premium: 2500,
    renewalDate: '2026-08-15',
    status: 'low',
  },
  {
    id: '2',
    type: 'Term Life Insurance',
    emoji: '🛡️',
    provider: 'LIC',
    coverage: 5000000,
    recommended: 10000000,
    premium: 1200,
    renewalDate: '2027-01-20',
    status: 'low',
  },
  {
    id: '3',
    type: 'Vehicle Insurance',
    emoji: '🚗',
    provider: 'HDFC ERGO',
    coverage: 800000,
    recommended: 800000,
    premium: 600,
    renewalDate: '2026-06-10',
    status: 'adequate',
  },
  {
    id: '4',
    type: 'Critical Illness',
    emoji: '💊',
    provider: 'Not covered',
    coverage: 0,
    recommended: 2000000,
    premium: 0,
    renewalDate: '-',
    status: 'missing',
  },
];

const STATUS_CONFIG = {
  adequate: { label: 'Adequate',  color: '#22c55e', bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
  low:      { label: 'Low',       color: '#f59e0b', bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
  critical: { label: 'Critical',  color: '#ef4444', bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
  missing:  { label: 'Not Covered',color: '#ef4444', bg: 'bg-red-500/10',   border: 'border-red-500/20'    },
};

const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` :
  n >= 100000   ? `₹${(n / 100000).toFixed(1)}L` :
  `₹${n.toLocaleString('en-IN')}`;

const daysUntil = (dateStr: string) => {
  if (dateStr === '-') return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const InsuranceChecker: React.FC = () => {
  const [policies] = useState<Policy[]>(POLICIES);
  const [selected, setSelected] = useState<string | null>(null);

  const totalPremium = policies.reduce((s, p) => s + p.premium, 0);
  const coverageScore = Math.round(
    policies.reduce((s, p) => {
      const ratio = p.recommended > 0 ? (p.coverage / p.recommended) : 0;
      return s + Math.min(1, ratio);
    }, 0) / policies.length * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-100">Insurance Coverage Checker</h3>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-1">Coverage Score</p>
          <p className={`text-2xl font-bold ${coverageScore >= 70 ? 'text-green-400' : coverageScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
            {coverageScore}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-1">Monthly Premium</p>
          <p className="text-xl font-bold text-slate-200">₹{totalPremium.toLocaleString('en-IN')}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-1">Gaps Found</p>
          <p className="text-2xl font-bold text-red-400">{policies.filter(p => p.status !== 'adequate').length}</p>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="space-y-3">
        {policies.map(policy => {
          const sc = STATUS_CONFIG[policy.status];
          const days = daysUntil(policy.renewalDate);
          const coveragePct = policy.recommended > 0 ? Math.min(100, Math.round((policy.coverage / policy.recommended) * 100)) : 0;
          const isExpanded = selected === policy.id;

          return (
            <div
              key={policy.id}
              className={`border rounded-2xl overflow-hidden transition-all cursor-pointer ${sc.bg} ${sc.border}`}
              onClick={() => setSelected(isExpanded ? null : policy.id)}
            >
              <div className="flex items-center gap-4 p-4">
                <span className="text-3xl">{policy.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-100">{policy.type}</h4>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ color: sc.color, backgroundColor: sc.color + '20', border: `1px solid ${sc.color}40` }}
                    >
                      {sc.label}
                    </span>
                    {days !== null && days <= 60 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock size={10} /> {days}d to renew
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{policy.provider} · ₹{policy.premium > 0 ? `${policy.premium.toLocaleString('en-IN')}/mo` : 'Not covered'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">Coverage</p>
                  <p className="text-sm font-bold" style={{ color: sc.color }}>
                    {policy.coverage > 0 ? formatINR(policy.coverage) : 'None'}
                  </p>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-700/40">
                  <div className="pt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Coverage vs Recommended</span>
                      <span style={{ color: sc.color }}>{coveragePct}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${coveragePct}%`, backgroundColor: sc.color }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Current: {formatINR(policy.coverage)}</span>
                      <span>Recommended: {formatINR(policy.recommended)}</span>
                    </div>
                  </div>

                  {/* Gap Analysis */}
                  {policy.status !== 'adequate' && (
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-300 mb-1">Gap Analysis</p>
                          <p className="text-xs text-slate-400">
                            {policy.status === 'missing'
                              ? `You have NO ${policy.type} coverage. This is a critical risk. Expected cost: ₹${Math.round(policy.recommended * 0.001).toLocaleString('en-IN')}/month.`
                              : `Your coverage is ${formatINR(policy.recommended - policy.coverage)} below the recommended amount. Consider upgrading or adding a top-up plan.`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {policy.renewalDate !== '-' && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <RefreshCw size={11} />
                        Renewal: {policy.renewalDate}
                        {days !== null && ` (${days > 0 ? `${days} days` : 'Expired'})`}
                      </div>
                    )}
                    {policy.status === 'adequate' && (
                      <div className="flex items-center gap-1.5 text-xs text-green-400">
                        <CheckCircle2 size={11} /> Coverage is adequate
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsuranceChecker;
