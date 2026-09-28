/**
 * components/Mindfulness.tsx
 * Section: Energy & Mindfulness (Mindfulness sub-section)
 * Features: Session timer, streak tracker, mood selector
 * Fully local state — no backend needed
 */

import React, { useState, useEffect, useRef } from 'react';
import { Brain, Play, Pause, RotateCcw, Flame, CheckCircle2 } from 'lucide-react';

const MOODS = [
  { emoji: '😌', label: 'Calm' },
  { emoji: '😤', label: 'Stressed' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😟', label: 'Anxious' },
  { emoji: '💪', label: 'Energized' },
];

const SESSIONS = [
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '20 min', seconds: 1200 },
];

const TIPS = [
  'Breathe in for 4 counts, hold for 4, out for 4.',
  'Scan your body from feet to head slowly.',
  'Visualise a peaceful place you love.',
  'Observe thoughts without judgment — let them pass.',
  'Focus solely on the rhythm of your breath.',
];

const Mindfulness: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState(SESSIONS[1]);
  const [timeLeft, setTimeLeft] = useState(selectedSession.seconds);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(5); // Simulated streak
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rotate tips every 15 seconds
  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 15000);
    return () => clearInterval(t);
  }, []);

  // Countdown
  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && running) {
      setRunning(false);
      setCompleted(true);
      setStreak((s) => s + 1);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft]);

  const handleSelectSession = (s: typeof SESSIONS[0]) => {
    setSelectedSession(s);
    setTimeLeft(s.seconds);
    setRunning(false);
    setCompleted(false);
  };

  const handleReset = () => {
    setRunning(false);
    setTimeLeft(selectedSession.seconds);
    setCompleted(false);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = ((selectedSession.seconds - timeLeft) / selectedSession.seconds) * 100;
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Day Streak', value: streak, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Today\'s Session', value: completed ? '✓ Done' : 'Not yet', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Total Minutes', value: streak * 10 + (completed ? selectedSession.seconds / 60 : 0), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon size={18} className={color} />
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-5">
          {/* Session selector */}
          <div className="flex gap-2">
            {SESSIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSelectSession(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSession.label === s.label
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* SVG Timer Ring */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="80" cy="80" r={radius}
                fill="none"
                stroke={completed ? '#10b981' : '#a855f7'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="text-center z-10">
              {completed ? (
                <>
                  <p className="text-3xl font-black text-emerald-400">🎉</p>
                  <p className="text-xs text-emerald-400 font-bold mt-1">Complete!</p>
                </>
              ) : (
                <>
                  <p className="text-4xl font-black text-slate-100 font-mono">{fmt(timeLeft)}</p>
                  <p className="text-xs text-slate-500 mt-1">{running ? 'Breathe…' : 'Ready'}</p>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-slate-200"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => setRunning((r) => !r)}
              disabled={completed}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg transition-all disabled:opacity-50 ${
                running ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
              }`}
            >
              {running ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
            </button>
          </div>

          {/* Tip */}
          <div className="w-full p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-xs text-purple-200 text-center italic">"{TIPS[tipIndex]}"</p>
          </div>
        </div>

        {/* Mood & Progress */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">How are you feeling?</h4>
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map(({ emoji, label }) => (
                <button
                  key={label}
                  onClick={() => setSelectedMood(label)}
                  className={`py-3 rounded-xl border transition-all text-center ${
                    selectedMood === label
                      ? 'bg-purple-500/20 border-purple-500/40 scale-105'
                      : 'bg-slate-800 border-transparent hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl block">{emoji}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">{label}</span>
                </button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-xs text-purple-300 text-center mt-3 font-medium">Mood logged: {selectedMood} ✓</p>
            )}
          </div>

          {/* Streak calendar (last 7 days visual) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Streak — Last 7 Days
            </h4>
            <div className="flex gap-2 justify-center">
              {['M','T','W','T','F','S','S'].map((d, i) => {
                const done = i < streak % 7;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      done ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {done ? '✓' : d}
                    </div>
                    <span className="text-[9px] text-slate-600">{d}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-orange-400 font-bold mt-3">🔥 {streak} day streak — keep it going!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mindfulness;
