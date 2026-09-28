import React, { useState } from 'react';
import { Target, Plus, Trash2, PartyPopper, CheckCircle2 } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

const DEFAULT_GOALS: Goal[] = [
  { id: '1', name: 'Emergency Fund',   emoji: '🛡️', target: 300000, current: 180000, deadline: '2026-09', color: '#22c55e' },
  { id: '2', name: 'Vacation to Bali', emoji: '🌴', target: 80000,  current: 45000,  deadline: '2026-08', color: '#0ea5e9' },
  { id: '3', name: 'New Laptop',       emoji: '💻', target: 120000, current: 120000, deadline: '2026-04', color: '#a855f7' },
  { id: '4', name: 'Wedding Fund',     emoji: '💍', target: 500000, current: 180000, deadline: '2028-03', color: '#ec4899' },
  { id: '5', name: 'Dream Home',       emoji: '🏠', target: 5000000,current: 450000, deadline: '2035',    color: '#f59e0b' },
  { id: '6', name: 'Child Education',  emoji: '🎓', target: 2500000,current: 320000, deadline: '2038',    color: '#06b6d4' },
];

const PRESET_GOALS = [
  { name: 'House', emoji: '🏠' }, { name: 'Education', emoji: '🎓' },
  { name: 'Vacation', emoji: '✈️' }, { name: 'Vehicle', emoji: '🚗' },
  { name: 'Wedding', emoji: '💍' }, { name: 'Custom', emoji: '⭐' },
];

const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` :
  n >= 100000   ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000     ? `₹${(n / 1000).toFixed(1)}K` :
  `₹${n}`;

const GoalsTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [confettiGoalId, setConfettiGoalId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', emoji: '⭐', target: '', current: '', deadline: '', color: '#0ea5e9' });

  const addGoal = () => {
    if (!form.name || !form.target) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: form.name,
      emoji: form.emoji,
      target: Number(form.target),
      current: Number(form.current) || 0,
      deadline: form.deadline,
      color: form.color,
    };
    const pct = (newGoal.current / newGoal.target) * 100;
    if (pct >= 100) setConfettiGoalId(newGoal.id);
    setGoals(prev => [newGoal, ...prev]);
    setShowForm(false);
    setForm({ name: '', emoji: '⭐', target: '', current: '', deadline: '', color: '#0ea5e9' });
  };

  const updateGoal = (id: string, delta: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newCurrent = Math.min(g.target, Math.max(0, g.current + delta));
      if (newCurrent >= g.target) setConfettiGoalId(id);
      return { ...g, current: newCurrent };
    }));
  };

  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  const monthsToGoal = (g: Goal) => {
    const remaining = g.target - g.current;
    const monthly = Math.round(remaining / 12);
    return { remaining, monthly };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Target size={20} className="text-cyan-400" /> Goals Tracker
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">{goals.length} active goals · {goals.filter(g => g.current >= g.target).length} completed</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-medium transition-all"
        >
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {/* Preset quick-add */}
      {!showForm && (
        <div className="flex flex-wrap gap-2">
          {PRESET_GOALS.map(p => (
            <button
              key={p.name}
              onClick={() => { setForm(f => ({ ...f, name: p.name, emoji: p.emoji })); setShowForm(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-cyan-500/30 hover:text-cyan-300 transition-all"
            >
              <span>{p.emoji}</span> {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="p-5 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-slate-200">New Goal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Goal Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Emergency Fund"
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Emoji</label>
              <input
                value={form.emoji}
                onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
                maxLength={2}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Target Amount (₹)</label>
              <input
                type="number"
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                placeholder="100000"
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Current Saved (₹)</label>
              <input
                type="number"
                value={form.current}
                onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
                placeholder="0"
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Target Date</label>
              <input
                type="month"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Color</label>
              <input
                type="color"
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-full h-10 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addGoal} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl py-2.5 text-sm font-medium transition-all">
              Create Goal
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl py-2.5 text-sm transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const isComplete = pct >= 100;
          const { remaining, monthly } = monthsToGoal(goal);

          return (
            <div
              key={goal.id}
              className="relative p-5 rounded-2xl border overflow-hidden transition-all hover:scale-[1.01] group"
              style={{ borderColor: goal.color + '40', backgroundColor: goal.color + '08' }}
            >
              {/* Confetti animation */}
              {confettiGoalId === goal.id && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="text-5xl animate-bounce">🎉</div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{goal.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{goal.name}</h4>
                    {goal.deadline && (
                      <p className="text-xs text-slate-500 mt-0.5">Target: {goal.deadline}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isComplete && <CheckCircle2 size={16} style={{ color: goal.color }} />}
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400">{formatINR(goal.current)} saved</span>
                  <span className="font-bold" style={{ color: goal.color }}>{pct}%</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: goal.color, boxShadow: `0 0 8px ${goal.color}60` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹0</span>
                  <span>{formatINR(goal.target)}</span>
                </div>
              </div>

              {/* Stats */}
              {!isComplete ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Monthly needed</p>
                    <p className="text-sm font-bold text-slate-200">₹{monthly.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateGoal(goal.id, 1000)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                      style={{ backgroundColor: goal.color + '20', color: goal.color, border: `1px solid ${goal.color}40` }}
                    >
                      +₹1K
                    </button>
                    <button
                      onClick={() => updateGoal(goal.id, 5000)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                      style={{ backgroundColor: goal.color + '20', color: goal.color, border: `1px solid ${goal.color}40` }}
                    >
                      +₹5K
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PartyPopper size={16} style={{ color: goal.color }} />
                  <span className="text-sm font-bold" style={{ color: goal.color }}>Goal Achieved! 🎉</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsTracker;
