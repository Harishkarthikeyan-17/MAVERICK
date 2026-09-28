/**
 * components/Goals.tsx
 * Section: Goals
 * Full CRUD + smartwatch simulation + progress bars
 * Synced to GET/POST/PUT/DELETE /api/goals
 */

import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Watch, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  getGoals, createGoal, updateGoal, deleteGoal, watchUpdateGoal, type Goal,
} from '../services/healthApi';

const CATEGORY_COLORS = {
  fitness:   { pill: 'bg-blue-500/20 text-blue-300 border-blue-500/30',   bar: 'bg-blue-500',   icon: '🏃' },
  diet:      { pill: 'bg-green-500/20 text-green-300 border-green-500/30', bar: 'bg-green-500',   icon: '🥗' },
  lifestyle: { pill: 'bg-purple-500/20 text-purple-300 border-purple-500/30', bar: 'bg-purple-500', icon: '🧘' },
};

const PERIOD_LABELS = { weekly: 'This Week', monthly: 'This Month' };

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchingId, setWatchingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New goal form
  const [form, setForm] = useState({
    title: '', category: 'fitness' as Goal['category'],
    targetValue: '', currentValue: '', unit: '', period: 'weekly' as Goal['period'],
  });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGoals();
      setGoals(data);
    } catch {
      setError('Cannot connect to Health API on port 5000. Make sure backend-health is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    setFormError(null);
    if (!form.title || !form.targetValue || !form.unit) {
      setFormError('Title, target value, and unit are required.');
      return;
    }
    setCreating(true);
    try {
      const created = await createGoal({
        title: form.title,
        category: form.category,
        targetValue: Number(form.targetValue),
        currentValue: Number(form.currentValue) || 0,
        unit: form.unit,
        period: form.period,
      });
      setGoals((g) => [...g, created]);
      setForm({ title: '', category: 'fitness', targetValue: '', currentValue: '', unit: '', period: 'weekly' });
      setShowForm(false);
    } catch (e: any) {
      setFormError(e?.response?.data?.error || 'Failed to create goal.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGoal(id);
      setGoals((g) => g.filter((goal) => goal.id !== id));
    } catch { /* silent */ }
    finally { setDeletingId(null); }
  };

  const handleWatchUpdate = async (id: string) => {
    setWatchingId(id);
    try {
      const goal   = goals.find((g) => g.id === id)!;
      const remaining = goal.targetValue - goal.currentValue;
      const inc    = Math.min(remaining, Math.ceil(goal.targetValue * 0.1));
      const updated = await watchUpdateGoal(id, inc);
      setGoals((g) => g.map((goal) => goal.id === id ? updated : goal));
    } catch { /* silent */ }
    finally { setWatchingId(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
      <Loader2 size={22} className="animate-spin" /> Loading goals…
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="text-cyan-400" size={22} /> Health Goals
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">Track weekly & monthly targets with smartwatch sync</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetch} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-all">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all text-sm font-bold"
          >
            <Plus size={16} /> Add Goal
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* New Goal Form */}
      {showForm && (
        <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-cyan-400">New Goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              type="text" placeholder="Goal title (e.g. Run 20km)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="col-span-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 placeholder:text-slate-600 transition-all"
            />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as any }))}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all">
              <option value="fitness">🏃 Fitness</option>
              <option value="diet">🥗 Diet</option>
              <option value="lifestyle">🧘 Lifestyle</option>
            </select>
            <select value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value as any }))}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all">
              <option value="weekly">📅 Weekly</option>
              <option value="monthly">🗓 Monthly</option>
            </select>
            <input type="text" placeholder="Unit (km, days, min…)"
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 placeholder:text-slate-600 transition-all"
            />
            <input type="number" placeholder="Target value"
              value={form.targetValue}
              onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 placeholder:text-slate-600 transition-all"
            />
            <input type="number" placeholder="Current progress (optional)"
              value={form.currentValue}
              onChange={(e) => setForm((f) => ({ ...f, currentValue: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 placeholder:text-slate-600 transition-all"
            />
          </div>
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={creating}
              className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50">
              {creating ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Plus size={14} /> Save Goal</>}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-sm transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 && !error ? (
        <div className="text-center py-12 text-slate-500">
          <Target size={40} className="mx-auto mb-3 text-slate-700" />
          <p className="font-medium">No goals yet</p>
          <p className="text-sm mt-1">Click "Add Goal" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const cfg = CATEGORY_COLORS[goal.category];
            const isComplete = goal.progress >= 100;
            return (
              <div key={goal.id} className={`bg-slate-900 border rounded-2xl p-5 transition-all group ${isComplete ? 'border-emerald-500/30' : 'border-slate-800'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-base">{cfg.icon}</span>
                      <h4 className={`font-semibold text-sm ${isComplete ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                        {goal.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${cfg.pill}`}>{goal.category}</span>
                      <span className="text-[10px] text-slate-500">{PERIOD_LABELS[goal.period]}</span>
                      {isComplete && <span className="text-[10px] text-emerald-400 font-bold">✓ COMPLETE</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleWatchUpdate(goal.id)}
                      disabled={watchingId === goal.id || isComplete}
                      title="Simulate smartwatch update"
                      className="p-1.5 bg-slate-800 hover:bg-cyan-500/20 text-slate-500 hover:text-cyan-400 rounded-lg transition-all disabled:opacity-30"
                    >
                      {watchingId === goal.id ? <Loader2 size={13} className="animate-spin" /> : <Watch size={13} />}
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      disabled={deletingId === goal.id}
                      className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                    >
                      {deletingId === goal.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    <span className={`font-bold ${isComplete ? 'text-emerald-400' : 'text-slate-300'}`}>{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-emerald-500' : cfg.bar}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;
