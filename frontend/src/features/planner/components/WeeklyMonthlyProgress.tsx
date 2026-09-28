import React, { useState, useMemo } from 'react';
import {
    Calendar, TrendingUp, Award, Trophy, Star, Flame, Zap, Target,
    Crown, Medal, Shield, Sparkles, ChevronLeft, ChevronRight,
    Lock, CheckCircle2, Clock, BarChart3, ArrowUpRight
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';

interface WeeklyMonthlyProgressProps {
    xp: number;
    level: number;
    streak: number;
    focusSessions: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
    xpReward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
    progress: number;
    maxProgress: number;
}

const WeeklyMonthlyProgress: React.FC<WeeklyMonthlyProgressProps> = ({
    xp, level, streak, focusSessions
}) => {
    const [activeTimeframe, setActiveTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
    const [activeSubTab, setActiveSubTab] = useState<'progress' | 'badges' | 'challenges' | 'milestones'>('progress');
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

    // Weekly data
    const weeklyData = [
        { day: 'Mon', tasks: 8, focus: 4.5, productivity: 82 },
        { day: 'Tue', tasks: 12, focus: 6.0, productivity: 91 },
        { day: 'Wed', tasks: 10, focus: 5.5, productivity: 88 },
        { day: 'Thu', tasks: 7, focus: 3.5, productivity: 72 },
        { day: 'Fri', tasks: 14, focus: 7.0, productivity: 95 },
        { day: 'Sat', tasks: 5, focus: 2.0, productivity: 55 },
        { day: 'Sun', tasks: 6, focus: 2.5, productivity: 60 },
    ];

    // Monthly data
    const monthlyData = [
        { week: 'W1', tasks: 42, focus: 22, productivity: 78 },
        { week: 'W2', tasks: 55, focus: 28, productivity: 85 },
        { week: 'W3', tasks: 48, focus: 25, productivity: 82 },
        { week: 'W4', tasks: 62, focus: 32, productivity: 92 },
    ];

    // Yearly data
    const yearlyData = [
        { month: 'Jan', productivity: 65 }, { month: 'Feb', productivity: 72 },
        { month: 'Mar', productivity: 78 }, { month: 'Apr', productivity: 82 },
        { month: 'May', productivity: 88 }, { month: 'Jun', productivity: 85 },
        { month: 'Jul', productivity: 80 }, { month: 'Aug', productivity: 90 },
        { month: 'Sep', productivity: 87 }, { month: 'Oct', productivity: 92 },
        { month: 'Nov', productivity: 88 }, { month: 'Dec', productivity: 95 },
    ];

    // Calendar heatmap data generation
    const calendarHeatmap = useMemo(() => {
        const firstDay = new Date(calendarYear, calendarMonth, 1);
        const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
        const startPad = firstDay.getDay();
        const totalDays = lastDay.getDate();
        const days: { day: number | null; intensity: number }[] = [];

        for (let i = 0; i < startPad; i++) days.push({ day: null, intensity: 0 });
        for (let d = 1; d <= totalDays; d++) {
            const seed = (d * 7 + calendarMonth * 3) % 13;
            const intensity = seed > 10 ? 4 : seed > 7 ? 3 : seed > 4 ? 2 : seed > 1 ? 1 : 0;
            days.push({ day: d, intensity });
        }
        return days;
    }, [calendarMonth, calendarYear]);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Achievements
    const achievements: Achievement[] = [
        { id: 'a1', title: 'First Steps', description: 'Complete your first task', icon: <CheckCircle2 size={20} />, unlocked: true, progress: 1, maxProgress: 1, xpReward: 50, rarity: 'common' },
        { id: 'a2', title: 'Focus Warrior', description: 'Complete 10 focus sessions', icon: <Target size={20} />, unlocked: true, progress: 10, maxProgress: 10, xpReward: 200, rarity: 'common' },
        { id: 'a3', title: 'Streak Master', description: 'Maintain a 7-day streak', icon: <Flame size={20} />, unlocked: true, progress: 7, maxProgress: 7, xpReward: 300, rarity: 'rare' },
        { id: 'a4', title: 'Deep Diver', description: 'Log 50 hours of deep work', icon: <Shield size={20} />, unlocked: true, progress: 50, maxProgress: 50, xpReward: 500, rarity: 'rare' },
        { id: 'a5', title: 'Consistency King', description: 'Complete all daily tasks for 14 consecutive days', icon: <Crown size={20} />, unlocked: streak >= 14, progress: Math.min(streak, 14), maxProgress: 14, xpReward: 750, rarity: 'epic' },
        { id: 'a6', title: 'Night Owl No More', description: 'No tasks completed past 11 PM for 30 days', icon: <Star size={20} />, unlocked: false, progress: 18, maxProgress: 30, xpReward: 500, rarity: 'epic' },
        { id: 'a7', title: 'Productivity Legend', description: 'Reach Level 10', icon: <Trophy size={20} />, unlocked: level >= 10, progress: level, maxProgress: 10, xpReward: 1500, rarity: 'legendary' },
        { id: 'a8', title: 'Zero Distraction Day', description: 'Complete 5 days with zero distractions', icon: <Zap size={20} />, unlocked: false, progress: 2, maxProgress: 5, xpReward: 400, rarity: 'rare' },
        { id: 'a9', title: 'Marathon Runner', description: 'Maintain a 30-day streak', icon: <Medal size={20} />, unlocked: streak >= 30, progress: Math.min(streak, 30), maxProgress: 30, xpReward: 1000, rarity: 'epic' },
        { id: 'a10', title: 'Habit Architect', description: 'Create and maintain 10 recurring habits', icon: <Sparkles size={20} />, unlocked: false, progress: 6, maxProgress: 10, xpReward: 600, rarity: 'rare' },
    ];

    // Daily Challenges
    const dailyChallenges: DailyChallenge[] = [
        { id: 'c1', title: 'Complete 5 tasks before noon', description: 'Speed runner challenge', xpReward: 100, completed: false, progress: 3, maxProgress: 5 },
        { id: 'c2', title: 'Log 2 focus sessions', description: 'Deep work practice', xpReward: 75, completed: focusSessions >= 2, progress: Math.min(focusSessions, 2), maxProgress: 2 },
        { id: 'c3', title: 'Zero distractions for 1 hour', description: 'Distraction-free zone', xpReward: 50, completed: false, progress: 42, maxProgress: 60 },
        { id: 'c4', title: 'Complete a habit streak day', description: 'Keep your streak alive', xpReward: 25, completed: true, progress: 1, maxProgress: 1 },
    ];

    const rarityColors = {
        common: { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', glow: '' },
        rare: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-[0_0_8px_rgba(6,182,212,0.2)]' },
        epic: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', glow: 'shadow-[0_0_12px_rgba(139,92,246,0.2)]' },
        legendary: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
    };

    // Productivity milestones
    const milestones = [
        { level: 1, title: 'Productivity Acolyte', xpRequired: 0, unlocked: true },
        { level: 3, title: 'Flow Ninja', xpRequired: 1200, unlocked: level >= 3 },
        { level: 5, title: 'Discipline Warden', xpRequired: 3000, unlocked: level >= 5 },
        { level: 7, title: 'Focus Commander', xpRequired: 6000, unlocked: level >= 7 },
        { level: 10, title: 'Cognitive Mastermind', xpRequired: 12000, unlocked: level >= 10 },
        { level: 15, title: 'Productivity Overlord', xpRequired: 25000, unlocked: level >= 15 },
        { level: 20, title: 'Time Lord', xpRequired: 50000, unlocked: level >= 20 },
    ];

    const intensityColors = [
        'bg-slate-950 border-slate-850',
        'bg-emerald-500/15 border-emerald-500/10',
        'bg-emerald-500/35 border-emerald-500/20',
        'bg-emerald-500/60 border-emerald-500/30',
        'bg-emerald-500 border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.3)]'
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Timeframe and Sub-tab Selector */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Timeframe */}
                <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-x-auto scrollbar-hide">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(tf => (
                        <button
                            key={tf}
                            onClick={() => setActiveTimeframe(tf)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                                activeTimeframe === tf
                                    ? 'bg-slate-800 border border-slate-700 text-cyan-400 shadow-xl'
                                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                            }`}
                        >
                            {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Sub tabs */}
                <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'progress', label: 'Progress', icon: TrendingUp },
                        { id: 'badges', label: 'Achievements', icon: Award },
                        { id: 'challenges', label: 'Challenges', icon: Target },
                        { id: 'milestones', label: 'Milestones', icon: Trophy },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                                    activeSubTab === tab.id
                                        ? 'bg-slate-800 border border-slate-700 text-purple-400 shadow-xl'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                            >
                                <Icon size={14} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Progress View */}
            {activeSubTab === 'progress' && (
                <div className="space-y-6">
                    {/* Top Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Tasks', value: activeTimeframe === 'weekly' ? '62' : activeTimeframe === 'monthly' ? '207' : activeTimeframe === 'yearly' ? '2,148' : '12', icon: <CheckCircle2 size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'Focus Hours', value: activeTimeframe === 'weekly' ? '31.0h' : activeTimeframe === 'monthly' ? '107h' : activeTimeframe === 'yearly' ? '1,284h' : '6.5h', icon: <Clock size={16} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                            { label: 'Avg Score', value: activeTimeframe === 'weekly' ? '82%' : activeTimeframe === 'monthly' ? '84%' : activeTimeframe === 'yearly' ? '81%' : '88%', icon: <BarChart3 size={16} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { label: 'Streak', value: `${streak} Days`, icon: <Flame size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                    <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                                </div>
                                <div className="text-2xl font-black text-slate-100 mt-3">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Main Chart */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp size={16} className="text-cyan-400" /> Productivity Trend
                            </h3>
                            <div className="h-[260px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {activeTimeframe === 'yearly' ? (
                                        <LineChart data={yearlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                            <Line type="monotone" dataKey="productivity" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} name="Productivity %" />
                                        </LineChart>
                                    ) : (
                                        <AreaChart data={activeTimeframe === 'monthly' ? monthlyData : weeklyData}>
                                            <defs>
                                                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey={activeTimeframe === 'monthly' ? 'week' : 'day'} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                            <Area type="monotone" dataKey="productivity" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" name="Productivity %" />
                                        </AreaChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Task Completion Bar Chart */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <BarChart3 size={16} className="text-purple-400" /> Task Volume
                            </h3>
                            <div className="h-[260px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={activeTimeframe === 'monthly' ? monthlyData : weeklyData} barSize={activeTimeframe === 'monthly' ? 40 : 28}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey={activeTimeframe === 'monthly' ? 'week' : 'day'} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
                                        <Bar dataKey="tasks" name="Tasks Completed" radius={[6, 6, 0, 0]}>
                                            {(activeTimeframe === 'monthly' ? monthlyData : weeklyData).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.tasks > 10 ? '#10b981' : entry.tasks > 6 ? '#8b5cf6' : '#f59e0b'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Heatmap */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={16} className="text-emerald-400" /> Activity Calendar
                            </h3>
                            <div className="flex items-center gap-3">
                                <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); } else { setCalendarMonth(m => m - 1); } }} className="p-1.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors">
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="text-sm font-black text-slate-200 min-w-[120px] text-center">{monthNames[calendarMonth]} {calendarYear}</span>
                                <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); } else { setCalendarMonth(m => m + 1); } }} className="p-1.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-[10px] font-black text-slate-500 text-center uppercase tracking-wider py-1">{d}</div>
                            ))}
                            {calendarHeatmap.map((cell, idx) => (
                                <div
                                    key={idx}
                                    className={`aspect-square rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all duration-300 cursor-pointer hover:scale-110 ${
                                        cell.day === null ? 'border-transparent' : intensityColors[cell.intensity]
                                    } ${cell.day === new Date().getDate() && calendarMonth === new Date().getMonth() ? 'ring-2 ring-cyan-500/40' : ''}`}
                                    title={cell.day ? `Day ${cell.day}: ${['No activity', 'Low', 'Medium', 'High', 'Peak'][cell.intensity]}` : ''}
                                >
                                    <span className={`${cell.intensity >= 3 ? 'text-white' : 'text-slate-500'}`}>
                                        {cell.day}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-1.5 mt-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <span>Less</span>
                            {intensityColors.map((cls, i) => (
                                <div key={i} className={`w-3.5 h-3.5 rounded border ${cls}`} />
                            ))}
                            <span>More</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Achievements View */}
            {activeSubTab === 'badges' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                            <Award className="text-amber-400" size={22} /> Achievement Showcase
                        </h2>
                        <span className="text-xs font-bold text-slate-400">
                            {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map(achievement => {
                            const colors = rarityColors[achievement.rarity];
                            const progressPercent = Math.round((achievement.progress / achievement.maxProgress) * 100);

                            return (
                                <div
                                    key={achievement.id}
                                    className={`${colors.bg} border ${colors.border} rounded-2xl p-5 transition-all duration-300 ${colors.glow} ${!achievement.unlocked ? 'opacity-60' : 'hover:scale-[1.01]'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} border ${colors.border} shrink-0 relative`}>
                                            {achievement.icon}
                                            {!achievement.unlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 rounded-xl">
                                                    <Lock size={14} className="text-slate-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-sm font-black text-slate-100">{achievement.title}</h4>
                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                    {achievement.rarity}
                                                </span>
                                                {achievement.unlocked && (
                                                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        ✓ Unlocked
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 font-semibold mt-1">{achievement.description}</p>

                                            <div className="mt-3 flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                                                    <div className={`h-full rounded-full transition-all duration-700 ${achievement.unlocked ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-slate-700 to-slate-600'}`}
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500">{achievement.progress}/{achievement.maxProgress}</span>
                                            </div>

                                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                                                <Sparkles size={10} /> +{achievement.xpReward} XP
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Daily Challenges View */}
            {activeSubTab === 'challenges' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                            <Target className="text-red-400" size={22} /> Daily Challenges
                        </h2>
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest font-black flex items-center gap-1">
                            <Clock size={12} /> Resets in 8h 42m
                        </span>
                    </div>

                    {/* Total XP Available */}
                    <div className="bg-gradient-to-r from-slate-900/60 to-amber-900/10 border border-amber-500/20 p-5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                                <Zap size={24} className="text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-100">Daily XP Available</h3>
                                <p className="text-xs text-slate-400 font-semibold">Complete all challenges for bonus XP</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-amber-400">{dailyChallenges.reduce((sum, c) => sum + c.xpReward, 0)} XP</div>
                            <div className="text-[10px] font-bold text-slate-500">{dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length} Completed</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {dailyChallenges.map(challenge => {
                            const progressPercent = Math.round((challenge.progress / challenge.maxProgress) * 100);
                            return (
                                <div
                                    key={challenge.id}
                                    className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-5 shadow-lg transition-all duration-300 ${
                                        challenge.completed
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-slate-800 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                                challenge.completed
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-slate-950 text-slate-400 border-slate-850'
                                            }`}>
                                                {challenge.completed ? <CheckCircle2 size={20} /> : <Target size={20} />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className={`text-sm font-black ${challenge.completed ? 'text-emerald-400 line-through' : 'text-slate-100'}`}>
                                                    {challenge.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 font-semibold mt-0.5">{challenge.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                                                <Sparkles size={12} /> +{challenge.xpReward} XP
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${challenge.completed ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 font-mono">{challenge.progress}/{challenge.maxProgress}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Milestones View */}
            {activeSubTab === 'milestones' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                            <Trophy className="text-amber-400" size={22} /> Productivity Milestones
                        </h2>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between text-xs font-black text-slate-400 mb-3">
                            <span className="uppercase tracking-widest">Level {level} Progress</span>
                            <span className="text-cyan-400">{xp} / {level * 600} XP</span>
                        </div>
                        <div className="h-3 bg-slate-950 border border-slate-850 rounded-full p-0.5 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all duration-700"
                                style={{ width: `${Math.min(100, Math.round((xp / (level * 600)) * 100))}%` }}
                            />
                        </div>
                    </div>

                    {/* Milestone Timeline */}
                    <div className="relative pl-8 space-y-6">
                        {/* Vertical line */}
                        <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-slate-800" />

                        {milestones.map((milestone, idx) => (
                            <div key={idx} className="relative">
                                {/* Node */}
                                <div className={`absolute left-[-22px] top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                                    milestone.unlocked
                                        ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                                        : 'bg-slate-950 border-slate-700'
                                }`}>
                                    {milestone.unlocked && <CheckCircle2 size={10} className="text-white" />}
                                </div>

                                <div className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-5 shadow-lg transition-all duration-300 ${
                                    milestone.unlocked
                                        ? 'border-slate-800 hover:border-cyan-500/30'
                                        : 'border-slate-850 opacity-60'
                                }`}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                                milestone.unlocked
                                                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                                    : 'bg-slate-950 text-slate-600 border-slate-850'
                                            }`}>
                                                <Crown size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-black text-slate-100">{milestone.title}</h4>
                                                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                                        milestone.unlocked ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-950 text-slate-600 border border-slate-850'
                                                    }`}>
                                                        Level {milestone.level}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                                    {milestone.unlocked ? '✅ Milestone achieved' : `Requires ${milestone.xpRequired.toLocaleString()} total XP`}
                                                </p>
                                            </div>
                                        </div>
                                        {milestone.unlocked && (
                                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                                                <ArrowUpRight size={14} /> Unlocked
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyMonthlyProgress;
