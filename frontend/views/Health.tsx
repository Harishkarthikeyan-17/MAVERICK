
import React, { useState, useMemo } from 'react';
import { Thermometer, Brain, Activity, Target, TrendingUp, Plus, Trash2, CheckCircle2, Apple, Dumbbell, Scale, Smile, Bell, BellOff, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import AIInsightBox from '../components/AIInsightBox';
import { analyzeHealth } from '../services/geminiService';
import HealthVitals from '../components/HealthVitals';
import HydrationTracker from '../components/HydrationTracker';
import SleepTracker from '../components/SleepTracker';
import NotificationCenter from '../components/NotificationCenter';
import ActivityMetrics from '../components/ActivityMetrics';
import DailyHealthSummary from '../components/DailyHealthSummary';

interface Goal {
  id: string;
  title: string;
  type: 'fitness' | 'diet' | 'lifestyle';
  period: 'weekly' | 'monthly';
  progress: number;
  target: number;
}

interface Workout {
  id: string;
  day: string;
  type: string;
  duration: number;
  completed: boolean;
}

const INITIAL_GOALS: Goal[] = [
  { id: '1', title: 'Run 20km this week', type: 'fitness', period: 'weekly', progress: 12, target: 20 },
  { id: '2', title: 'Eat 5 servings of vegetables daily', type: 'diet', period: 'weekly', progress: 4, target: 7 },
];

const INITIAL_WORKOUTS: Workout[] = [
  { id: '1', day: 'Mon', type: 'Cardio', duration: 30, completed: true },
  { id: '2', day: 'Tue', type: 'Strength', duration: 45, completed: true },
  { id: '3', day: 'Wed', type: 'Yoga', duration: 30, completed: false },
  { id: '4', day: 'Thu', type: 'Cardio', duration: 30, completed: false },
  { id: '5', day: 'Fri', type: 'Strength', duration: 45, completed: false },
  { id: '6', day: 'Sat', type: 'Sports', duration: 60, completed: false },
  { id: '7', day: 'Sun', type: 'Rest', duration: 0, completed: true },
];

const STRESS_DATA = [
  { date: 'Mon', level: 3 },
  { date: 'Tue', level: 5 },
  { date: 'Wed', level: 4 },
  { date: 'Thu', level: 6 },
  { date: 'Fri', level: 4 },
  { date: 'Sat', level: 2 },
  { date: 'Sun', level: 2 },
];

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];

const Health: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [workouts, setWorkouts] = useState<Workout[]>(INITIAL_WORKOUTS);
  const [stressLevel, setStressLevel] = useState(3);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [newGoal, setNewGoal] = useState({ title: '', type: 'fitness' as 'fitness' | 'diet' | 'lifestyle', period: 'weekly' as 'weekly' | 'monthly', target: 0 });
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const [todayCalories, setTodayCalories] = useState(1750);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/analyze/medical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: symptoms,
          user_id: "user_123" // In a real app, this would be the actual user ID
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAiResponse(data.response || "No response from AI.");
      } else {
        setAiResponse(data.error || data.detail || "Error analyzing symptoms.");
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setAiResponse("Could not connect to the backend server. Please ensure the backend is running at http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const completedWorkouts = workouts.filter(w => w.completed).length;
    const totalWorkouts = workouts.filter(w => w.type !== 'Rest').length;
    const workoutCompletion = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
    const dietAdherence = dailyCalorieGoal > 0 ? Math.min(100, (todayCalories / dailyCalorieGoal) * 100) : 0;
    const avgGoalProgress = goals.length > 0 ? goals.reduce((sum, g) => sum + (g.progress / g.target) * 100, 0) / goals.length : 0;
    const consistencyScore = Math.round((workoutCompletion * 0.4) + (avgGoalProgress * 0.4) + (dietAdherence > 80 && dietAdherence < 120 ? 20 : 10));
    const bmi = weight / ((height / 100) ** 2);
    let bmiStatus = 'Normal';
    if (bmi < 18.5) bmiStatus = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiStatus = 'Overweight';
    else if (bmi >= 30) bmiStatus = 'Obese';
    let stressStatus = 'Low';
    if (stressLevel >= 4 && stressLevel < 7) stressStatus = 'Medium';
    else if (stressLevel >= 7) stressStatus = 'High';
    return { weeklyGoalProgress: Math.round(avgGoalProgress), bmi: bmi.toFixed(1), bmiStatus, stressStatus, consistencyScore, workoutCompletion: Math.round(workoutCompletion), todayCalories, dietAdherence: Math.round(dietAdherence) };
  }, [goals, workouts, height, weight, stressLevel, dailyCalorieGoal, todayCalories]);

  const dailyPieData = [
    { name: 'Workout', value: metrics.workoutCompletion },
    { name: 'Diet', value: metrics.dietAdherence > 100 ? 100 : metrics.dietAdherence },
    { name: 'Rest', value: 80 },
    { name: 'Stress', value: 100 - (stressLevel * 10) },
  ];

  const motivationMessage = useMemo(() => {
    if (metrics.consistencyScore >= 80) return "Outstanding work! You're crushing your goals! 🔥";
    if (metrics.consistencyScore >= 60) return "Great progress! Keep the momentum going! 💪";
    if (metrics.consistencyScore >= 40) return "You're doing well! Small steps lead to big changes! 🌟";
    return "Every journey starts with a single step. You've got this! 🚀";
  }, [metrics.consistencyScore]);

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const goal: Goal = { id: Date.now().toString(), title: newGoal.title, type: newGoal.type, period: newGoal.period, progress: 0, target: newGoal.target };
    setGoals([...goals, goal]);
    setNewGoal({ title: '', type: 'fitness', period: 'weekly', target: 0 });
  };

  const deleteGoal = (id: string) => setGoals(goals.filter(g => g.id !== id));
  const toggleWorkout = (id: string) => setWorkouts(workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-bold text-slate-100">Health Tracker</h2>
        <p className="text-slate-400 mt-1">Track your health, habits, and consistency</p>
      </header>

      {/* Top Health Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Weekly Goal Progress', value: `${metrics.weeklyGoalProgress}%`, icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { label: 'BMI Status', value: metrics.bmiStatus, sub: metrics.bmi, icon: Scale, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Stress Level', value: metrics.stressStatus, icon: Brain, color: metrics.stressStatus === 'Low' ? 'text-green-400' : metrics.stressStatus === 'Medium' ? 'text-yellow-400' : 'text-red-400', bg: metrics.stressStatus === 'Low' ? 'bg-green-400/10' : metrics.stressStatus === 'Medium' ? 'bg-yellow-400/10' : 'bg-red-400/10' },
          { label: 'Consistency Score', value: `${metrics.consistencyScore}/100`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon size={22} />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</h3>
              </div>
              {stat.sub && <span className="text-xs text-slate-400 font-mono">BMI: {stat.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Health Vitals Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-rose-500" size={24} />
            Daily Vitals
          </h3>
          <span className="text-xs text-slate-500 font-mono">UPDATED: JUST NOW</span>
        </div>
        <HealthVitals />
        <ActivityMetrics />
        <DailyHealthSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Symptom Checker */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Thermometer className="text-blue-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">AI Symptom Checker</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Describe how you feel (e.g., "mild headache since morning", "feeling stressed")</p>
            <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700" placeholder="Start typing symptoms here..." />
            <button onClick={handleAnalyze} disabled={loading || !symptoms.trim()} className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">
              {loading ? "Analyzing..." : "Analyze Symptoms"}
              <Brain size={18} />
            </button>
          </div>

          <AIInsightBox title="MAVERIC Health Prediction" insight={aiResponse} loading={loading} hint="Input your symptoms and MAVERIC will provide non-emergency health advice." />

          {/* Compact Trackers Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SleepTracker />
            <HydrationTracker />
          </div>

          {/* Goals Section */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">Weekly & Monthly Goals</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <input type="text" placeholder="Goal title" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500" />
              <select value={newGoal.type} onChange={e => setNewGoal({ ...newGoal, type: e.target.value as any })} className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500">
                <option value="fitness">Fitness</option>
                <option value="diet">Diet</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
              <select value={newGoal.period} onChange={e => setNewGoal({ ...newGoal, period: e.target.value as any })} className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input type="number" placeholder="Target" value={newGoal.target || ''} onChange={e => setNewGoal({ ...newGoal, target: Number(e.target.value) })} className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500" />
              <button onClick={addGoal} className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center transition-colors">
                <Plus size={16} className="mr-2" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {goals.map(goal => {
                const percent = Math.min(100, (goal.progress / goal.target) * 100);
                return (
                  <div key={goal.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:bg-slate-800/60 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-slate-200 font-medium">{goal.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${goal.type === 'fitness' ? 'bg-blue-500/20 text-blue-300' : goal.type === 'diet' ? 'bg-green-500/20 text-green-300' : 'bg-purple-500/20 text-purple-300'}`}>{goal.type}</span>
                          <span className="text-xs text-slate-500">{goal.period}</span>
                        </div>
                        <p className="text-xs text-slate-400">{goal.progress} / {goal.target}</p>
                      </div>
                      <button onClick={() => deleteGoal(goal.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Workout Planner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">Weekly Workout Planner</h3>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Weekly Completion</span>
                <span className="text-cyan-400 font-bold">{metrics.workoutCompletion}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${metrics.workoutCompletion}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {workouts.map(workout => (
                <div key={workout.id} onClick={() => workout.type !== 'Rest' && toggleWorkout(workout.id)} className={`p-3 rounded-xl border cursor-pointer transition-all ${workout.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800/60'}`}>
                  <div className="text-center">
                    <h4 className="text-slate-200 font-medium text-sm">{workout.day}</h4>
                    <p className="text-xs text-slate-400">{workout.type}</p>
                    {workout.completed && <CheckCircle2 size={16} className="text-green-400 mx-auto mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BMI Calculator */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Scale size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">BMI Calculator</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500" />
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Your BMI</p>
                  <h3 className="text-3xl font-bold text-slate-100">{metrics.bmi}</h3>
                </div>
                <div className={`px-4 py-2 rounded-lg ${metrics.bmiStatus === 'Normal' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                  <p className="text-sm font-bold">{metrics.bmiStatus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diet Goals */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Apple size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">Diet Monitoring</h3>
            </div>
            <div className="mb-4">
              <label className="text-xs text-slate-400 mb-2 block">Daily Calorie Goal</label>
              <input type="number" value={dailyCalorieGoal} onChange={e => setDailyCalorieGoal(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Today's Intake</span>
                <span className="text-lg font-bold text-slate-100">{todayCalories} / {dailyCalorieGoal} kcal</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${metrics.dietAdherence > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, metrics.dietAdherence)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <NotificationCenter />

          {/* Daily Summary Pie Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">Daily Summary</h3>
            </div>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dailyPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {dailyPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-xs text-slate-500 block">Score</span>
                  <span className="text-lg font-bold text-slate-200">{metrics.consistencyScore}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dailyPieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-400">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stress Controller */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">Stress Controller</h3>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Current Level</span>
                <span className={`font-bold ${stressLevel <= 3 ? 'text-green-400' : stressLevel <= 6 ? 'text-yellow-400' : 'text-red-400'}`}>{stressLevel}/10</span>
              </div>
              <input type="range" min="1" max="10" value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg mb-4">
              <p className="text-xs text-cyan-200">💡 Try: Deep breathing, 5-min break, light walk</p>
            </div>
            <div className="h-[100px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={STRESS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="level" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Motivation Panel */}
          <div className="bg-slate-900 border border-emerald-500/20 p-6 rounded-2xl bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-4">
              <Smile size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">Motivation</h3>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-sm text-emerald-200 font-medium">{motivationMessage}</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Consistency builds character</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Progress over perfection</span>
              </div>
            </div>
          </div>

          {/* Goal Reminders */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              {remindersEnabled ? <Bell size={20} className="text-cyan-400" /> : <BellOff size={20} className="text-slate-500" />}
              <div>
                <h4 className="text-sm font-bold text-slate-200">Goal Reminders</h4>
                <p className="text-xs text-slate-500">Weekly summary alerts</p>
              </div>
            </div>
            <button onClick={() => setRemindersEnabled(!remindersEnabled)} className={`w-11 h-6 rounded-full transition-colors relative ${remindersEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${remindersEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;
