import React, { useState } from 'react';
import { Heart, TrendingUp, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Mood = 'happy' | 'neutral' | 'stressed' | 'sad' | 'celebratory';

const MOODS: { id: Mood; emoji: string; label: string; color: string }[] = [
  { id: 'happy',       emoji: '😄', label: 'Happy',       color: '#22c55e' },
  { id: 'neutral',     emoji: '😐', label: 'Neutral',     color: '#64748b' },
  { id: 'stressed',    emoji: '😤', label: 'Stressed',    color: '#ef4444' },
  { id: 'sad',         emoji: '😢', label: 'Sad',         color: '#6366f1' },
  { id: 'celebratory', emoji: '🥳', label: 'Celebratory', color: '#f59e0b' },
];

interface MoodedTransaction {
  id: string;
  category: string;
  amount: number;
  mood: Mood;
  date: string;
}

const SAMPLE_MOOD_DATA: MoodedTransaction[] = [
  { id: '1', category: 'Shopping',     amount: 3200, mood: 'stressed',    date: '2026-01-05' },
  { id: '2', category: 'Food',         amount: 850,  mood: 'happy',       date: '2026-01-08' },
  { id: '3', category: 'Shopping',     amount: 1800, mood: 'sad',         date: '2026-01-12' },
  { id: '4', category: 'Entertainment',amount: 2100, mood: 'celebratory', date: '2026-01-14' },
  { id: '5', category: 'Food',         amount: 1200, mood: 'stressed',    date: '2026-01-18' },
  { id: '6', category: 'Shopping',     amount: 4500, mood: 'stressed',    date: '2026-01-22' },
  { id: '7', category: 'Entertainment',amount: 800,  mood: 'happy',       date: '2026-01-25' },
  { id: '8', category: 'Health',       amount: 600,  mood: 'neutral',     date: '2026-01-28' },
];

interface Props {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
}

const EmotionalSpending: React.FC<Props> = ({ selectedMood, onMoodSelect }) => {
  const [data] = useState<MoodedTransaction[]>(SAMPLE_MOOD_DATA);

  // Aggregate by mood
  const moodTotals = MOODS.map(m => ({
    mood: m.label,
    emoji: m.emoji,
    amount: data.filter(t => t.mood === m.id).reduce((s, t) => s + t.amount, 0),
    count: data.filter(t => t.mood === m.id).length,
    color: m.color,
  }));

  const stressedSpend = data.filter(t => t.mood === 'stressed').reduce((s, t) => s + t.amount, 0);
  const happySpend = data.filter(t => t.mood === 'happy').reduce((s, t) => s + t.amount, 0);
  const topStressCategory = (() => {
    const cats: Record<string, number> = {};
    data.filter(t => t.mood === 'stressed').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Shopping';
  })();

  const insights = [
    stressedSpend > happySpend
      ? `😤 You spend ${Math.round(((stressedSpend - happySpend) / Math.max(1, happySpend)) * 100)}% more when stressed. Your top stress-spend category is **${topStressCategory}**.`
      : `😄 You spend more when happy! Your celebratory spending is a natural reward pattern.`,
    `🛍️ Impulse purchases spike on weekends and when you're stressed or celebratory — consider a 24hr pause rule before big purchases.`,
    `💡 Track your mood before every purchase to build emotional spending awareness over time.`,
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-sm font-bold text-slate-200">{payload[0]?.payload?.emoji} {payload[0]?.payload?.mood}</p>
          <p className="text-xs text-slate-400 mt-0.5">₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">{payload[0]?.payload?.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Mood Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-pink-400" />
          <h4 className="text-sm font-bold text-slate-300">How are you feeling right now?</h4>
          <span className="text-xs text-slate-500">(affects next transaction)</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {MOODS.map(m => (
            <button
              key={m.id}
              onClick={() => onMoodSelect(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                selectedMood === m.id
                  ? 'border-opacity-60 scale-105'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}
              style={selectedMood === m.id ? { borderColor: m.color + '80', backgroundColor: m.color + '15', color: m.color } : {}}
            >
              <span className="text-lg">{m.emoji}</span>
              <span>{m.label}</span>
              {selectedMood === m.id && <CheckCircle2 size={14} />}
            </button>
          ))}
        </div>
        {selectedMood && (
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Sparkles size={11} className="text-cyan-400" />
            Mood tagged. Add a transaction above to link it with your current emotional state.
          </p>
        )}
      </div>

      {/* Chart */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-purple-400" />
          Spending by Mood
        </h4>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodTotals} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="emoji" stroke="#64748b" fontSize={16} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {moodTotals.map((entry, i) => (
                  <rect key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood breakdown chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {moodTotals.map(m => (
          <div key={m.mood} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <span className="text-xl">{m.emoji}</span>
            <p className="text-xs text-slate-400 mt-1">{m.mood}</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5">₹{(m.amount / 1000).toFixed(1)}K</p>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-400" />
          AI Emotional Insights
        </h4>
        {insights.map((insight, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-sm text-slate-300 leading-relaxed">
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionalSpending;
