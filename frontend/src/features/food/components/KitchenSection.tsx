import React, { useState, useEffect } from 'react';
import {
  Flame, Droplets, Zap, Target, ChefHat, AlertTriangle,
  ShoppingCart, Plus, ArrowRight, Sparkles, TrendingUp,
  Clock, CheckCircle2, RefreshCw
} from 'lucide-react';
import { generateNutritionInsight } from '../services/aiService';
import type { useFoodPlanner } from '../hooks/useFoodPlanner';

type FoodPlannerStore = ReturnType<typeof useFoodPlanner>;

interface KitchenSectionProps {
  store: FoodPlannerStore;
  onNavigate: (section: string, subTab?: string) => void;
}

// ── Animated Progress Ring ────────────────────────────────────
const ProgressRing: React.FC<{
  value: number; max: number; color: string; size?: number; strokeWidth?: number;
}> = ({ value, max, color, size = 88, strokeWidth = 7 }) => {
  const pct = Math.min(value / max, 1);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

// ── Mini Stat Card ─────────────────────────────────────────────
const StatCard: React.FC<{
  label: string; value: string | number; unit?: string;
  sub?: string; color: string; bgColor: string; icon: React.ReactNode;
}> = ({ label, value, unit, sub, color, bgColor, icon }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-700 transition-all">
    <div className={`${bgColor} p-2.5 rounded-xl flex-shrink-0`}>
      <div className={color}>{icon}</div>
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-xl font-bold text-slate-100 mt-0.5">
        {value}<span className="text-sm text-slate-500 font-normal ml-1">{unit}</span>
      </p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Meal Timeline Card ─────────────────────────────────────────
const MealTimelineCard: React.FC<{
  name: string; type: string; calories: number; protein: number;
  logged: boolean; onLog: () => void;
}> = ({ name, type, calories, protein, logged, onLog }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
    logged
      ? 'bg-slate-900/50 border-slate-800/50 opacity-70'
      : 'bg-slate-900 border-slate-800 hover:border-emerald-500/30'
  }`}>
    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
      type === 'Breakfast' ? 'bg-amber-400' :
      type === 'Lunch' ? 'bg-emerald-400' :
      type === 'Dinner' ? 'bg-blue-400' : 'bg-purple-400'
    }`} />
    <div className="flex-1 min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{type}</span>
      <p className={`text-sm font-semibold truncate ${logged ? 'line-through text-slate-500' : 'text-slate-200'}`}>
        {name}
      </p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-xs text-slate-400"><span className="text-orange-400 font-medium">{calories}</span> kcal</p>
      <p className="text-xs text-slate-500">{protein}g protein</p>
    </div>
    {!logged && (
      <button
        onClick={onLog}
        title="Mark as logged"
        className="p-1.5 text-slate-600 hover:text-emerald-400 transition-colors flex-shrink-0"
      >
        <CheckCircle2 size={18} />
      </button>
    )}
    {logged && <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />}
  </div>
);

// ── Quick Action Button ────────────────────────────────────────
const QuickAction: React.FC<{
  label: string; icon: React.ReactNode; color: string; bg: string; onClick: () => void;
}> = ({ label, icon, color, bg, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group"
  >
    <div className={`${bg} ${color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-xs font-medium text-slate-300 text-center leading-tight">{label}</span>
  </button>
);

// ── Main Component ─────────────────────────────────────────────
const KitchenSection: React.FC<KitchenSectionProps> = ({ store, onNavigate }) => {
  const {
    dailyStats, dailyGoals, todayMeals, logMeal,
    pantryAlerts, waterIntake, addWater,
    nutritionHistory,
  } = store;

  const [aiInsight, setAiInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(true);
  const [insightStreamed, setInsightStreamed] = useState('');

  // Fetch AI insight on mount
  useEffect(() => {
    let cancelled = false;
    setInsightLoading(true);
    setInsightStreamed('');

    generateNutritionInsight({
      calories: dailyStats.calories,
      protein: dailyStats.protein,
      carbs: dailyStats.carbs,
      fat: dailyStats.fat,
      fiber: 18,
      waterIntake,
      mealsLogged: dailyStats.mealsLogged,
    }).then(insight => {
      if (cancelled) return;
      setAiInsight(insight);
      setInsightLoading(false);
      // Stream text character by character
      let i = 0;
      const words = insight.split(' ');
      const interval = setInterval(() => {
        if (cancelled || i >= words.length) { clearInterval(interval); return; }
        setInsightStreamed(prev => prev + (i > 0 ? ' ' : '') + words[i]);
        i++;
      }, 50);
    });

    return () => { cancelled = true; };
  }, []);

  const calPct = Math.round((dailyStats.calories / dailyGoals.calories) * 100);
  const protPct = Math.round((dailyStats.protein / dailyGoals.protein) * 100);
  const waterPct = Math.round((waterIntake / dailyGoals.water) * 100);

  const totalAlerts = pantryAlerts.expiring.length + pantryAlerts.lowStock.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Hero: Calorie Command Center */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          {/* Calorie Ring */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative">
              <ProgressRing value={dailyStats.calories} max={dailyGoals.calories} color="#10b981" size={120} strokeWidth={10} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-black text-slate-100">{dailyStats.calories}</p>
                <p className="text-[10px] text-slate-500 font-medium">/ {dailyGoals.calories}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calories Today</span>
          </div>

          {/* Macro Progress Bars */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Flame size={18} className="text-emerald-400" />
                Today's Nutrition
              </h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                calPct >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                calPct >= 60 ? 'bg-amber-500/10 text-amber-400' :
                'bg-slate-800 text-slate-400'
              }`}>
                {calPct}% of goal
              </span>
            </div>

            {[
              { label: 'Protein', value: dailyStats.protein, max: dailyGoals.protein, unit: 'g', color: 'bg-blue-500', textColor: 'text-blue-400' },
              { label: 'Carbs', value: dailyStats.carbs, max: dailyGoals.carbs, unit: 'g', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
              { label: 'Fat', value: dailyStats.fat, max: dailyGoals.fat, unit: 'g', color: 'bg-amber-500', textColor: 'text-amber-400' },
            ].map(macro => (
              <div key={macro.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">{macro.label}</span>
                  <span className={macro.textColor + ' font-bold'}>{macro.value}{macro.unit} <span className="text-slate-600 font-normal">/ {macro.max}{macro.unit}</span></span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${macro.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min((macro.value / macro.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Water + Stats */}
          <div className="flex flex-row lg:flex-col gap-4 lg:gap-3 flex-shrink-0">
            <div className="flex flex-col items-center bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 min-w-[100px]">
              <div className="relative mb-2">
                <ProgressRing value={waterIntake} max={dailyGoals.water} color="#60a5fa" size={60} strokeWidth={6} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Droplets size={18} className="text-blue-400" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-200">{waterIntake}/{dailyGoals.water}</p>
              <p className="text-[10px] text-slate-500">glasses</p>
              <button
                onClick={addWater}
                className="mt-2 w-full py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-bold rounded-lg transition-colors"
              >
                + Glass
              </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 min-w-[100px] flex flex-col items-center justify-center">
              <p className="text-2xl font-black text-slate-100">{dailyStats.mealsLogged}<span className="text-sm text-slate-500">/{dailyStats.totalMeals}</span></p>
              <p className="text-[10px] text-slate-500 mt-1">Meals Logged</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Meal Timeline + Quick Actions */}
        <div className="lg:col-span-2 space-y-6">

          {/* Meal Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" />
                Today's Meals
              </h3>
              <button
                onClick={() => onNavigate('cook')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                + Generate Plan <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-800/50 p-4 space-y-2">
              {todayMeals.map(meal => (
                <MealTimelineCard
                  key={meal.id}
                  name={meal.name}
                  type={meal.mealType}
                  calories={meal.calories}
                  protein={meal.protein}
                  logged={meal.logged}
                  onLog={() => logMeal(meal.id)}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickAction
                label="Generate Today's Plan"
                icon={<Zap size={20} />}
                color="text-emerald-400"
                bg="bg-emerald-500/10"
                onClick={() => onNavigate('cook')}
              />
              <QuickAction
                label="Cook From Ingredients"
                icon={<ChefHat size={20} />}
                color="text-violet-400"
                bg="bg-violet-500/10"
                onClick={() => onNavigate('cook', 'ingredients')}
              />
              <QuickAction
                label="View Grocery List"
                icon={<ShoppingCart size={20} />}
                color="text-cyan-400"
                bg="bg-cyan-500/10"
                onClick={() => onNavigate('pantry', 'groceries')}
              />
              <QuickAction
                label="Log New Meal"
                icon={<Plus size={20} />}
                color="text-amber-400"
                bg="bg-amber-500/10"
                onClick={() => onNavigate('insights', 'nutrition')}
              />
            </div>
          </div>

          {/* Weekly Trend Sparkline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-blue-400" />
                7-Day Calorie Trend
              </h3>
              <button
                onClick={() => onNavigate('insights', 'nutrition')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Full Analytics <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {nutritionHistory.map((day, i) => {
                const pct = day.calories / 2400;
                const isToday = i === nutritionHistory.length - 1;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-700 ${
                        isToday ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      style={{ height: `${pct * 100}%` }}
                    />
                    <span className={`text-[9px] font-medium ${isToday ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insight + Alerts */}
        <div className="space-y-5">

          {/* AI Nutrition Insight */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles size={80} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Sparkles size={12} className="text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Insight</span>
              {insightLoading && <RefreshCw size={12} className="text-slate-500 animate-spin" />}
            </div>

            {insightLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded animate-pulse w-full" />
                <div className="h-3 bg-slate-800 rounded animate-pulse w-4/5" />
                <div className="h-3 bg-slate-800 rounded animate-pulse w-3/5" />
              </div>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">
                {insightStreamed || aiInsight}
                {insightStreamed.length < aiInsight.length && (
                  <span className="inline-block w-0.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />
                )}
              </p>
            )}

            <button
              onClick={() => onNavigate('insights', 'health')}
              className="mt-4 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              View Full Analysis <ArrowRight size={12} />
            </button>
          </div>

          {/* Pantry Alerts */}
          {totalAlerts > 0 && (
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
                <AlertTriangle size={14} />
                Pantry Alerts
              </h3>
              <div className="space-y-2">
                {pantryAlerts.expiring.map(item => (
                  <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 border-l-2 border-l-red-500 rounded-xl">
                    <p className="text-sm text-slate-200 font-medium">{item.name}</p>
                    <p className="text-xs text-red-400 mt-0.5">
                      Expires {item.expiryDays === 1 ? 'tomorrow' : `in ${item.expiryDays} days`}
                    </p>
                    <button
                      onClick={() => onNavigate('cook', 'ingredients')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 mt-1.5 font-medium"
                    >
                      Use in recipe →
                    </button>
                  </div>
                ))}
                {pantryAlerts.lowStock.map(item => (
                  <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 border-l-2 border-l-amber-500 rounded-xl">
                    <p className="text-sm text-slate-200 font-medium">{item.name}</p>
                    <p className="text-xs text-amber-400 mt-0.5">Low stock — {item.qty}</p>
                    <button
                      onClick={() => onNavigate('pantry', 'groceries')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 mt-1.5 font-medium"
                    >
                      Add to grocery →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Protein"
              value={dailyStats.protein}
              unit={`/ ${dailyGoals.protein}g`}
              sub={`${protPct}% of goal`}
              color="text-blue-400"
              bgColor="bg-blue-500/10"
              icon={<Target size={18} />}
            />
            <StatCard
              label="Hydration"
              value={waterIntake}
              unit={`/ ${dailyGoals.water} glasses`}
              sub={`${waterPct}% complete`}
              color="text-cyan-400"
              bgColor="bg-cyan-500/10"
              icon={<Droplets size={18} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenSection;
