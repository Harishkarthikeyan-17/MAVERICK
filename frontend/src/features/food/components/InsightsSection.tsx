import React, { useState, useCallback, useEffect } from 'react';
import {
  BarChart3, Calendar, Brain, TrendingUp, TrendingDown,
  Flame, Dumbbell, Wheat, Droplets, ShieldAlert, Star,
  Users, UserPlus, AlertCircle, Settings, HeartPulse, Leaf,
  Loader2, Zap, Plus, Check, X, Target, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { generateWeeklyMealPlan } from '../services/aiService';
import type { useFoodPlanner } from '../hooks/useFoodPlanner';

type FoodPlannerStore = ReturnType<typeof useFoodPlanner>;

interface InsightsSectionProps {
  store: FoodPlannerStore;
  initialTab?: 'nutrition' | 'planning' | 'health';
}

// ─── Custom Tooltip ────────────────────────────────────────────
const ChartTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({
  active, payload, label
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 font-bold">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-slate-100 font-bold">{p.value}{p.unit}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Micronutrient Bar ─────────────────────────────────────────
const MicroBar: React.FC<{
  name: string; value: number; unit?: string;
  color: string; status: 'good' | 'low' | 'deficient';
}> = ({ name, value, unit = '%', color, status }) => {
  const statusConfig = {
    good: { textColor: 'text-emerald-400', label: 'Optimal' },
    low: { textColor: 'text-amber-400', label: 'Low' },
    deficient: { textColor: 'text-red-400', label: 'Deficient' },
  };
  const sc = statusConfig[status];

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-slate-300 font-medium">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{value}{unit}</span>
          <span className={`text-[10px] font-black uppercase tracking-wider ${sc.textColor}`}>{sc.label}</span>
        </div>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(value, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
};

// ─── Weekly Plan Grid ──────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MealCell: React.FC<{
  value: string; onClick: () => void;
}> = ({ value, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-2 py-2 rounded-lg text-xs transition-all border min-h-[52px] ${
      value
        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/40 hover:text-white'
        : 'border-dashed border-slate-800 text-slate-700 hover:border-slate-600 hover:text-slate-500'
    }`}
  >
    {value || <span className="flex items-center gap-1"><Plus size={10} /> Add</span>}
  </button>
);

// ─── Family Member Card ────────────────────────────────────────
interface FamilyMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  diet: string;
  allergies: string[];
  goals: string[];
  color: string;
}

const defaultMembers: FamilyMember[] = [
  { id: '1', name: 'You', initials: 'ME', role: 'Primary', diet: 'No restrictions', allergies: [], goals: ['High Protein', 'Muscle Gain'], color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
  { id: '2', name: 'Sarah', initials: 'S', role: 'Partner', diet: 'Vegetarian', allergies: ['Peanuts'], goals: ['Balanced', 'Weight Loss'], color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
  { id: '3', name: 'Leo', initials: 'L', role: 'Child', diet: 'No restrictions', allergies: [], goals: ['Kid-Friendly'], color: 'bg-purple-500/20 border-purple-500/30 text-purple-300' },
];

// ─── Main InsightsSection ──────────────────────────────────────
const InsightsSection: React.FC<InsightsSectionProps> = ({
  store, initialTab = 'nutrition'
}) => {
  const { nutritionHistory, dailyGoals, dailyStats } = store;

  const [activeTab, setActiveTab] = useState<'nutrition' | 'planning' | 'health'>(initialTab);
  const [selectedGoal, setSelectedGoal] = useState('Balanced');
  const [weeklyPlan, setWeeklyPlan] = useState<string[][]>([]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [familyMembers] = useState<FamilyMember[]>(defaultMembers);
  const [healthSummary, setHealthSummary] = useState('');
  const [healthLoading, setHealthLoading] = useState(true);

  React.useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  // Health AI summary on mount
  useEffect(() => {
    let cancelled = false;
    const text = `Your protein intake improved by 18% this month, hitting your goals 24 out of 30 days. Meal planning consistency has significantly reduced your grocery spending, saving approximately $140 compared to last month. Vitamin D and Omega-3 remain your primary gaps — consider a fortified breakfast option or a short supplement cycle.`;
    let i = 0;
    const words = text.split(' ');
    const interval = setInterval(() => {
      if (cancelled || i >= words.length) { clearInterval(interval); setHealthLoading(false); return; }
      setHealthSummary(prev => prev + (i > 0 ? ' ' : '') + words[i]);
      i++;
    }, 50);
    return () => { cancelled = true; };
  }, []);

  const handleGeneratePlan = useCallback(async () => {
    setGeneratingPlan(true);
    try {
      const plan = await generateWeeklyMealPlan({
        goal: selectedGoal, dietPreference: 'None',
        calories: dailyGoals.calories, familySize: familyMembers.length,
      });
      setWeeklyPlan(plan);
    } finally {
      setGeneratingPlan(false);
    }
  }, [selectedGoal, dailyGoals, familyMembers.length]);

  // Chart data
  const macroTrendData = nutritionHistory.map(d => ({
    day: d.date,
    Protein: d.protein,
    Carbs: d.carbs,
    Fat: d.fat,
    Calories: d.calories,
  }));

  const adherenceData = nutritionHistory.map(d => ({
    day: d.date,
    score: Math.round((d.calories / dailyGoals.calories) * 100),
  }));

  const radarData = [
    { metric: 'Variety', value: 78 },
    { metric: 'Timing', value: 85 },
    { metric: 'Portions', value: 72 },
    { metric: 'Nutrition', value: 88 },
    { metric: 'Consistency', value: 80 },
    { metric: 'Hydration', value: 65 },
  ];

  const micronutrients = [
    { name: 'Vitamin C', value: 112, color: '#10b981', status: 'good' as const },
    { name: 'Calcium', value: 87, color: '#10b981', status: 'good' as const },
    { name: 'Iron', value: 44, color: '#f59e0b', status: 'low' as const },
    { name: 'Omega-3', value: 38, color: '#f59e0b', status: 'low' as const },
    { name: 'Vitamin D', value: 28, color: '#ef4444', status: 'deficient' as const },
    { name: 'Fiber', value: 60, color: '#f59e0b', status: 'low' as const },
  ];

  const tabs = [
    { id: 'nutrition' as const, label: 'Nutrition', icon: <Activity size={15} /> },
    { id: 'planning' as const, label: 'Meal Planning', icon: <Calendar size={15} /> },
    { id: 'health' as const, label: 'Health Intel', icon: <Brain size={15} /> },
  ];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sub-Tab Navigator */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              activeTab === tab.id
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── NUTRITION TAB ──────────────────────────────────────── */}
      {activeTab === 'nutrition' && (
        <div className="space-y-5">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Calories', value: `${dailyStats.calories}`, unit: `/${dailyGoals.calories}`, color: 'text-orange-400', icon: <Flame size={16} /> },
              { label: 'Protein', value: `${dailyStats.protein}g`, unit: `/${dailyGoals.protein}g`, color: 'text-blue-400', icon: <Dumbbell size={16} /> },
              { label: 'Carbs', value: `${dailyStats.carbs}g`, unit: `/${dailyGoals.carbs}g`, color: 'text-emerald-400', icon: <Wheat size={16} /> },
              { label: 'Fat', value: `${dailyStats.fat}g`, unit: `/${dailyGoals.fat}g`, color: 'text-amber-400', icon: <Droplets size={16} /> },
              { label: 'Avg Weekly', value: '2082', unit: 'kcal/day', color: 'text-violet-400', icon: <TrendingUp size={16} /> },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-slate-100 mt-0.5">
                  {stat.value}
                  <span className="text-xs text-slate-500 font-normal ml-1">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Macro Trend Area Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-5 text-sm">
                <BarChart3 size={16} className="text-blue-400" />
                7-Day Macro Trend
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={macroTrendData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <defs>
                      {[
                        { id: 'protein', color: '#60a5fa' },
                        { id: 'carbs', color: '#34d399' },
                        { id: 'fat', color: '#fbbf24' },
                      ].map(({ id, color }) => (
                        <linearGradient key={id} id={`grad${id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="Protein" name="Protein" unit="g" stroke="#60a5fa" strokeWidth={2} fill="url(#gradprotein)" />
                    <Area type="monotone" dataKey="Carbs" name="Carbs" unit="g" stroke="#34d399" strokeWidth={2} fill="url(#gradcarbs)" />
                    <Area type="monotone" dataKey="Fat" name="Fat" unit="g" stroke="#fbbf24" strokeWidth={2} fill="url(#gradfat)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Micronutrients */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-5 text-sm">
                <Target size={16} className="text-purple-400" />
                Micronutrient Status
              </h3>
              <div className="space-y-3.5">
                {micronutrients.map(m => (
                  <MicroBar key={m.name} {...m} />
                ))}
              </div>
            </div>
          </div>

          {/* Deficiency Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-4 text-sm">
              <ShieldAlert size={16} className="text-amber-400" />
              Deficiency Alerts
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { nutrient: 'Vitamin D', level: '28% of RDA', target: '100%', impact: 'Immune function, bone health, mood regulation', food: 'Fatty fish, eggs, fortified dairy' },
                { nutrient: 'Iron', level: '44% of RDA', target: '100%', impact: 'Energy levels, cognitive function, oxygen transport', food: 'Spinach, lentils, lean red meat' },
                { nutrient: 'Omega-3', level: '38% of RDA', target: '100%', impact: 'Brain health, inflammation, heart protection', food: 'Salmon, walnuts, flaxseed' },
                { nutrient: 'Fiber', level: '60% of RDA', target: '100%', impact: 'Gut health, blood sugar, satiety', food: 'Legumes, oats, vegetables' },
              ].map((d, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-bold text-slate-200">{d.nutrient}</p>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                      parseFloat(d.level) < 40 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {d.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{d.impact}</p>
                  <p className="text-xs text-emerald-400 font-medium">Eat: {d.food}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MEAL PLANNING TAB ───────────────────────────────────── */}
      {activeTab === 'planning' && (
        <div className="space-y-5">
          {/* Goal Selector + Generate */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-slate-100 text-sm mb-1 flex items-center gap-2">
                <Calendar size={16} className="text-emerald-400" />
                AI Weekly Meal Plan
              </h3>
              <p className="text-xs text-slate-500">Generate a personalised 7-day plan based on your health goal.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Muscle Gain', 'Fat Loss', 'Balanced', 'Diabetic'].map(goal => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`px-3 py-1.5 text-xs rounded-xl border transition-all font-bold ${
                    selectedGoal === goal
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <button
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex-shrink-0"
            >
              {generatingPlan ? <><Loader2 size={16} className="animate-spin" />Generating...</> : <><Zap size={16} />Generate Plan</>}
            </button>
          </div>

          {/* Weekly Grid */}
          {weeklyPlan.length > 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800">
                      <th className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500 w-24">Meal</th>
                      {DAYS.map(day => (
                        <th key={day} className="py-3 px-2 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MEAL_TYPES.map((mealType, mealIdx) => (
                      <tr key={mealType} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="py-2.5 px-4">
                          <span className={`text-xs font-black uppercase tracking-wider ${
                            mealType === 'Breakfast' ? 'text-amber-400' :
                            mealType === 'Lunch' ? 'text-emerald-400' :
                            mealType === 'Dinner' ? 'text-blue-400' : 'text-purple-400'
                          }`}>{mealType}</span>
                        </td>
                        {DAYS.map((day, dayIdx) => (
                          <td key={day} className="py-1.5 px-1.5">
                            <MealCell
                              value={weeklyPlan[dayIdx]?.[mealIdx] || ''}
                              onClick={() => {}}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Calendar size={40} className="mx-auto mb-4 text-slate-700" />
              <h3 className="font-bold text-slate-400 mb-2">No Meal Plan Yet</h3>
              <p className="text-sm text-slate-600">Select a goal above and click Generate Plan to build your AI-powered weekly schedule.</p>
            </div>
          )}

          {/* Family Planner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                Family Profiles
              </h3>
              <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 rounded-lg">
                <UserPlus size={12} /> Add Member
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {familyMembers.map(member => (
                <div key={member.id} className={`relative p-4 rounded-2xl border ${member.color}`}>
                  {member.role === 'Primary' && (
                    <span className="absolute top-3 right-3 text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Primary
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-sm font-black text-slate-300">
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.diet}</p>
                    </div>
                  </div>
                  {member.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {member.allergies.map(a => (
                        <span key={a} className="text-[10px] px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded flex items-center gap-1">
                          <AlertCircle size={8} /> {a}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {member.goals.map(g => (
                      <span key={g} className="text-[10px] px-1.5 py-0.5 bg-slate-950/60 border border-slate-700 text-slate-400 rounded">{g}</span>
                    ))}
                  </div>
                  <button className="absolute bottom-3 right-3 text-slate-600 hover:text-slate-300 transition-colors">
                    <Settings size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {}}
              className="mt-4 w-full py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Zap size={16} className="text-emerald-400" />
              Generate Family Meal Plan (All Restrictions Applied)
            </button>
          </div>
        </div>
      )}

      {/* ── HEALTH INTEL TAB ───────────────────────────────────── */}
      {activeTab === 'health' && (
        <div className="space-y-5">
          {/* AI Monthly Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Brain size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Star size={14} className="text-emerald-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">AI Monthly Summary</span>
              </div>
              {healthLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-3 bg-slate-800 rounded animate-pulse" style={{ width: `${[100, 85, 65][i]}%` }} />
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 text-base leading-relaxed max-w-3xl">
                  {healthSummary}
                  {healthSummary.split(' ').length < 55 && (
                    <span className="inline-block w-0.5 h-4 bg-emerald-400 ml-0.5 animate-pulse" />
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Meal Adherence Line Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" />
                  Meal Adherence (7-Day)
                </h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  Avg {Math.round(adherenceData.reduce((s, d) => s + d.score, 0) / adherenceData.length)}%
                </span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={adherenceData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={[0, 110]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone" dataKey="score" name="Adherence" unit="%"
                      stroke="#3b82f6" strokeWidth={3}
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Eating Pattern Radar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 mb-5">
                <HeartPulse size={16} className="text-violet-400" />
                Eating Pattern Analysis
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                    <Radar
                      name="Score" dataKey="value" stroke="#8b5cf6" strokeWidth={2}
                      fill="#8b5cf6" fillOpacity={0.2}
                    />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 mb-4">
              <Brain size={16} className="text-violet-400" />
              AI Food Habit Recommendations
            </h3>
            <div className="space-y-3">
              {[
                { type: 'good', text: 'Protein timing is excellent — well distributed across meals optimises muscle protein synthesis throughout the day.' },
                { type: 'good', text: 'Meal consistency is strong — you have logged meals for 6 out of 7 days this week, building a solid habit foundation.' },
                { type: 'warn', text: 'Hydration dips on Saturdays — consider setting a water reminder for your weekend routine.' },
                { type: 'warn', text: 'Dinner calorie load is higher than ideal. Shifting some calories to lunch can improve sleep quality and digestion.' },
                { type: 'alert', text: 'Vitamin D and Omega-3 are consistently below 50% of RDA. A 2-week targeted food intervention or supplement is recommended.' },
              ].map((rec, i) => (
                <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                  rec.type === 'good' ? 'bg-emerald-500/5 border-emerald-500/10' :
                  rec.type === 'warn' ? 'bg-amber-500/5 border-amber-500/10' :
                  'bg-red-500/5 border-red-500/10'
                }`}>
                  <div className={`flex-shrink-0 mt-0.5 ${
                    rec.type === 'good' ? 'text-emerald-500' :
                    rec.type === 'warn' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {rec.type === 'good' ? <Check size={14} /> :
                     rec.type === 'warn' ? <AlertCircle size={14} /> : <ShieldAlert size={14} />}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
