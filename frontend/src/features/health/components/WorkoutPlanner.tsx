/**
 * components/WorkoutPlanner.tsx
 * Section: Workout & BMI (Workout sub-section)
 * 7-day grid → POST /api/workout per day
 * Auto-reset → POST /api/workout/reset
 */

import React, { useState, useEffect } from 'react';
import { Dumbbell, CheckCircle2, Circle, RotateCcw, Loader2, AlertTriangle } from 'lucide-react';
import { getWorkoutWeek, updateWorkout, resetWorkoutWeek, type WorkoutDay } from '../services/healthApi';

const WORKOUT_TYPES = ['Rest', 'Cardio', 'Strength', 'Yoga', 'HIIT', 'Sports', 'Cycling', 'Swimming', 'Running'];

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Rest:      { color: 'text-slate-400',   bg: 'bg-slate-700/50',      icon: '😴' },
  Cardio:    { color: 'text-orange-400',  bg: 'bg-orange-500/10',     icon: '🏃' },
  Strength:  { color: 'text-blue-400',    bg: 'bg-blue-500/10',       icon: '💪' },
  Yoga:      { color: 'text-purple-400',  bg: 'bg-purple-500/10',     icon: '🧘' },
  HIIT:      { color: 'text-red-400',     bg: 'bg-red-500/10',        icon: '🔥' },
  Sports:    { color: 'text-emerald-400', bg: 'bg-emerald-500/10',    icon: '⚽' },
  Cycling:   { color: 'text-yellow-400',  bg: 'bg-yellow-500/10',     icon: '🚴' },
  Swimming:  { color: 'text-cyan-400',    bg: 'bg-cyan-500/10',       icon: '🏊' },
  Running:   { color: 'text-pink-400',    bg: 'bg-pink-500/10',       icon: '👟' },
};

const WorkoutPlanner: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [weekStart, setWeekStart] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editDay, setEditDay] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkoutWeek();
      setWorkouts(data.workouts);
      setWeekStart(data.weekStart);
    } catch {
      setError('Cannot reach Health API on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleToggle = async (w: WorkoutDay) => {
    if (w.type === 'Rest') return;
    setTogglingId(w.id);
    try {
      const res = await updateWorkout({ day: w.day, completed: !w.completed });
      setWorkouts((prev) => prev.map((d) => d.day === w.day ? res.workout : d));
    } catch { /* silent */ }
    finally { setTogglingId(null); }
  };

  const handleTypeChange = async (day: string, type: string) => {
    try {
      const res = await updateWorkout({ day, type });
      setWorkouts((prev) => prev.map((d) => d.day === day ? res.workout : d));
    } catch { /* silent */ }
    setEditDay(null);
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const data = await resetWorkoutWeek();
      setWorkouts(data.workouts);
      setWeekStart(data.weekStart);
    } catch {
      setError('Reset failed — check Health API.');
    } finally {
      setResetting(false);
    }
  };

  const completedCount = workouts.filter((w) => w.completed).length;
  const workoutDays    = workouts.filter((w) => w.type !== 'Rest');
  const pct = workoutDays.length > 0 ? Math.round((workouts.filter((w) => w.completed && w.type !== 'Rest').length / workoutDays.length) * 100) : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-40 gap-3 text-slate-400">
      <Loader2 size={22} className="animate-spin" /> Loading workout planner…
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Dumbbell className="text-cyan-400" size={22} /> Weekly Workout Planner
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Week of {weekStart} · {completedCount}/{workouts.length} days tracked
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
        >
          {resetting ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />}
          {resetting ? 'Resetting…' : 'Reset Week'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertTriangle size={15} className="text-red-400 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Weekly Completion Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Weekly Completion</span>
          <span className="font-bold text-cyan-400">{pct}%</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {workouts.map((w) => {
          const cfg = TYPE_CONFIG[w.type] || TYPE_CONFIG.Rest;
          const isToggling = togglingId === w.id;
          return (
            <div
              key={w.id}
              className={`relative bg-slate-900 border rounded-2xl p-3 transition-all ${
                w.completed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Day label */}
              <p className="text-xs font-bold text-slate-400 text-center mb-2">{w.day}</p>

              {/* Type Icon */}
              <div
                className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center mx-auto mb-2 cursor-pointer`}
                onClick={() => setEditDay(editDay === w.day ? null : w.day)}
                title="Click to change type"
              >
                <span className="text-xl">{cfg.icon}</span>
              </div>

              {/* Type label */}
              <p className={`text-[10px] font-bold text-center ${cfg.color} mb-2`}>{w.type}</p>

              {/* Duration */}
              {w.duration > 0 && (
                <p className="text-[9px] text-slate-500 text-center mb-2">{w.duration} min</p>
              )}

              {/* Toggle complete */}
              {w.type !== 'Rest' && (
                <button
                  onClick={() => handleToggle(w)}
                  disabled={isToggling}
                  className="w-full flex items-center justify-center"
                >
                  {isToggling ? (
                    <Loader2 size={14} className="animate-spin text-slate-500" />
                  ) : w.completed ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <Circle size={16} className="text-slate-600 hover:text-slate-400 transition-colors" />
                  )}
                </button>
              )}

              {/* Type selector dropdown */}
              {editDay === w.day && (
                <select
                  className="absolute top-full left-0 mt-1 z-10 w-32 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs p-2 shadow-xl"
                  defaultValue={w.type}
                  onChange={(e) => handleTypeChange(w.day, e.target.value)}
                >
                  {WORKOUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className={`flex items-center gap-1.5 px-3 py-1 ${cfg.bg} rounded-full`}>
            <span className="text-sm">{cfg.icon}</span>
            <span className={`text-[10px] font-bold ${cfg.color}`}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanner;
