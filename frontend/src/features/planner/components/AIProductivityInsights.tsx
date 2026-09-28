import React, { useState, useMemo } from 'react';
import {
    Brain, Zap, TrendingUp, AlertTriangle, ChevronDown, ChevronUp,
    Sparkles, Activity, Shield, Target, Clock, BarChart3,
    Flame, Battery, BatteryCharging, Eye, Lightbulb, ArrowUpRight,
    ArrowDownRight, Minus, Calendar, Coffee, Moon, Sun
} from 'lucide-react';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface AIProductivityInsightsProps {
    xp: number;
    level: number;
    streak: number;
    focusSessions: number;
    completionPercentage: number;
    productivityScore: number;
}

interface InsightCard {
    id: string;
    title: string;
    description: string;
    impact: 'positive' | 'warning' | 'critical' | 'info';
    category: string;
    icon: React.ReactNode;
    details: string;
    actionLabel?: string;
    metric?: string;
    trend?: 'up' | 'down' | 'stable';
}

const AIProductivityInsights: React.FC<AIProductivityInsightsProps> = ({
    xp, level, streak, focusSessions, completionPercentage, productivityScore
}) => {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'insights' | 'forecast' | 'review'>('insights');

    // Burnout risk calculation
    const burnoutRisk = useMemo(() => {
        const hoursWorked = 7.5;
        const breaksTaken = 2;
        const daysStreak = streak;
        let risk = 0;
        if (hoursWorked > 8) risk += 30;
        else if (hoursWorked > 6) risk += 15;
        if (breaksTaken < 2) risk += 20;
        if (daysStreak > 10) risk += 15;
        if (focusSessions > 6) risk += 20;
        return Math.min(100, Math.max(5, risk));
    }, [streak, focusSessions]);

    // Task overload score
    const taskOverload = useMemo(() => {
        const planned = 8;
        const completed = Math.round(planned * completionPercentage / 100);
        const ratio = completed / planned;
        if (ratio < 0.4) return { level: 'critical', score: 85, message: 'Severe overload — reduce daily tasks' };
        if (ratio < 0.6) return { level: 'warning', score: 60, message: 'Moderate overload — consider rescheduling' };
        if (ratio < 0.8) return { level: 'info', score: 35, message: 'Slight pressure — manageable workload' };
        return { level: 'positive', score: 15, message: 'Optimal workload — great balance' };
    }, [completionPercentage]);

    // Forecasting data
    const forecastData = [
        { day: 'Mon', predicted: 78, actual: 82 },
        { day: 'Tue', predicted: 85, actual: 80 },
        { day: 'Wed', predicted: 82, actual: 88 },
        { day: 'Thu', predicted: 75, actual: 72 },
        { day: 'Fri', predicted: 90, actual: 92 },
        { day: 'Sat', predicted: 55, actual: 50 },
        { day: 'Sun', predicted: 60, actual: null },
    ];

    // Radar chart data for weekly performance review
    const radarData = [
        { metric: 'Focus', score: 85, fullMark: 100 },
        { metric: 'Consistency', score: 78, fullMark: 100 },
        { metric: 'Efficiency', score: 92, fullMark: 100 },
        { metric: 'Time Mgmt', score: 70, fullMark: 100 },
        { metric: 'Habit Retention', score: 88, fullMark: 100 },
        { metric: 'Energy', score: 65, fullMark: 100 },
    ];

    // Weekly performance summary
    const weeklyReview = {
        totalTasksCompleted: 42,
        totalFocusHours: 28.5,
        avgProductivity: 82,
        bestDay: 'Friday',
        worstDay: 'Saturday',
        improvementAreas: ['Break frequency', 'Evening wind-down routine'],
        achievements: ['5-day focus streak', 'Zero distractions Tuesday', '100% morning routine completion']
    };

    // AI Insight Cards
    const insightCards: InsightCard[] = [
        {
            id: '1',
            title: 'Peak Performance Window Detected',
            description: 'Your cognitive performance peaks between 8:00 AM – 11:30 AM consistently across the last 14 days.',
            impact: 'positive',
            category: 'Scheduling',
            icon: <Sun size={18} />,
            details: 'Analysis of 42 completed tasks shows 68% of your high-priority completions happen in this window. We recommend scheduling your most challenging work during this period for maximum throughput.',
            actionLabel: 'Optimize Schedule',
            metric: '+32%',
            trend: 'up'
        },
        {
            id: '2',
            title: 'Burnout Risk Assessment',
            description: `Current burnout risk level: ${burnoutRisk}%. ${burnoutRisk > 50 ? 'Elevated risk detected.' : 'Within safe operating range.'}`,
            impact: burnoutRisk > 60 ? 'critical' : burnoutRisk > 40 ? 'warning' : 'info',
            category: 'Wellness',
            icon: <Battery size={18} />,
            details: `Your sustained ${streak}-day streak and ${focusSessions} daily focus sessions indicate ${burnoutRisk > 50 ? 'potential cognitive fatigue accumulation. Consider implementing strategic recovery days to maintain long-term performance.' : 'a healthy balance between productivity and recovery. Continue monitoring.'}`,
            actionLabel: 'View Recovery Plan',
            metric: `${burnoutRisk}%`,
            trend: burnoutRisk > 50 ? 'up' : 'stable'
        },
        {
            id: '3',
            title: 'Task Completion Pattern Analysis',
            description: 'You complete 40% more tasks on days where you start with a structured morning routine.',
            impact: 'positive',
            category: 'Habits',
            icon: <TrendingUp size={18} />,
            details: 'Structured days (with morning planning, defined time blocks, and scheduled breaks) consistently outperform unstructured days. Your task completion rate on structured days averages 87% vs 52% on unstructured days.',
            metric: '+40%',
            trend: 'up'
        },
        {
            id: '4',
            title: 'Late-Night Work Impact Warning',
            description: 'Working past 10:30 PM has decreased your next-day focus score by an average of 22%.',
            impact: 'warning',
            category: 'Sleep',
            icon: <Moon size={18} />,
            details: 'Over the last 21 days, 6 instances of late-night work sessions were detected. On the following days, your morning focus score dropped significantly, and task completion rates fell by 18%. Consider setting a hard cutoff time to protect sleep quality.',
            actionLabel: 'Set Wind-Down Timer',
            metric: '-22%',
            trend: 'down'
        },
        {
            id: '5',
            title: 'Multitasking Efficiency Penalty',
            description: 'Context switching between tasks reduces your completion efficiency by 35%.',
            impact: 'warning',
            category: 'Focus',
            icon: <Activity size={18} />,
            details: 'When you work on tasks sequentially (single-tasking), your average completion time is 23 minutes. When you alternate between 2+ tasks, the average jumps to 38 minutes per task. Deep focus blocks are recommended.',
            actionLabel: 'Enable Deep Work Mode',
            metric: '-35%',
            trend: 'down'
        },
        {
            id: '6',
            title: 'Post-Workout Productivity Surge',
            description: 'Your productivity scores increase by 28% in the 3 hours following exercise sessions.',
            impact: 'positive',
            category: 'Health',
            icon: <Flame size={18} />,
            details: 'Data shows a strong correlation between physical activity and subsequent cognitive performance. On days with morning exercise, your overall daily productivity averages 89 compared to 72 on sedentary days.',
            metric: '+28%',
            trend: 'up'
        },
        {
            id: '7',
            title: 'Break Optimization Opportunity',
            description: 'Short 5-minute breaks every 45 minutes improve your sustained focus quality by 18%.',
            impact: 'info',
            category: 'Wellness',
            icon: <Coffee size={18} />,
            details: 'Your focus quality metrics show degradation after 45 minutes of continuous work. Implementing micro-breaks at this interval has been shown to maintain peak cognitive performance throughout the day.',
            actionLabel: 'Configure Break Reminders',
            metric: '+18%',
            trend: 'up'
        },
        {
            id: '8',
            title: 'Task Overload Status',
            description: taskOverload.message,
            impact: taskOverload.level as InsightCard['impact'],
            category: 'Workload',
            icon: <AlertTriangle size={18} />,
            details: `Your current workload score is ${taskOverload.score}/100. ${taskOverload.score > 50 ? 'Consider delegating or deferring lower-priority tasks to maintain quality on critical deliverables.' : 'Your workload is well-balanced. You have capacity for additional tasks if needed.'}`,
            metric: `${taskOverload.score}`,
            trend: taskOverload.score > 50 ? 'up' : 'stable'
        }
    ];

    const impactColors = {
        positive: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]' },
        warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]' },
        critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.15)]' },
        info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.15)]' }
    };

    // Burnout progress ring
    const burnoutRadius = 40;
    const burnoutCircumference = 2 * Math.PI * burnoutRadius;
    const burnoutStrokeOffset = burnoutCircumference * (1 - burnoutRisk / 100);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* View Selector */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-x-auto scrollbar-hide">
                {[
                    { id: 'insights', label: 'AI Insights', icon: Brain },
                    { id: 'forecast', label: 'Productivity Forecast', icon: TrendingUp },
                    { id: 'review', label: 'Weekly Review', icon: BarChart3 }
                ].map(view => {
                    const Icon = view.icon;
                    return (
                        <button
                            key={view.id}
                            onClick={() => setActiveView(view.id as typeof activeView)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-300 cursor-pointer ${
                                activeView === view.id
                                    ? 'bg-slate-800 border border-slate-700 text-cyan-400 shadow-xl'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 border border-transparent'
                            }`}
                        >
                            <Icon size={18} />
                            <span>{view.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Health Metrics Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Burnout Risk Gauge */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                        <Shield size={14} className={burnoutRisk > 50 ? 'text-red-400 animate-pulse' : 'text-emerald-400'} />
                        Burnout Risk Monitor
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="relative w-[100px] h-[100px] flex items-center justify-center shrink-0">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r={burnoutRadius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-950" />
                                <circle cx="50" cy="50" r={burnoutRadius} stroke="currentColor" strokeWidth="6" fill="transparent"
                                    strokeDasharray={burnoutCircumference} strokeDashoffset={burnoutStrokeOffset} strokeLinecap="round"
                                    className={`transition-all duration-1000 ${burnoutRisk > 60 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : burnoutRisk > 40 ? 'text-amber-500' : 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}
                                />
                            </svg>
                            <div className="text-center z-10">
                                <div className={`text-2xl font-black ${burnoutRisk > 60 ? 'text-red-400' : burnoutRisk > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{burnoutRisk}%</div>
                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Risk</div>
                            </div>
                        </div>
                        <div>
                            <div className={`text-sm font-black ${burnoutRisk > 60 ? 'text-red-400' : burnoutRisk > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {burnoutRisk > 60 ? '🚨 Elevated Risk' : burnoutRisk > 40 ? '⚠️ Moderate' : '✅ Healthy'}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                                {burnoutRisk > 50 ? 'Schedule a recovery day soon.' : 'Sustainable pace detected.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Task Overload Meter */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                        <AlertTriangle size={14} className="text-amber-400" /> Task Overload Index
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-end justify-between">
                            <span className={`text-3xl font-black ${taskOverload.score > 60 ? 'text-red-400' : taskOverload.score > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {taskOverload.score}
                            </span>
                            <span className="text-xs font-black text-slate-500 uppercase">/ 100</span>
                        </div>
                        <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${taskOverload.score > 60 ? 'bg-gradient-to-r from-red-600 to-red-400' : taskOverload.score > 35 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                                style={{ width: `${taskOverload.score}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 font-bold">{taskOverload.message}</p>
                    </div>
                </div>

                {/* AI Fatigue Estimation */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                        <BatteryCharging size={14} className="text-indigo-400" /> Energy Forecast
                    </h3>
                    <div className="space-y-2.5">
                        {[
                            { time: '8AM – 11AM', energy: 95, label: 'Peak Zone', color: 'bg-emerald-500' },
                            { time: '11AM – 1PM', energy: 80, label: 'High Focus', color: 'bg-cyan-500' },
                            { time: '1PM – 3PM', energy: 55, label: 'Post-Lunch Dip', color: 'bg-amber-500' },
                            { time: '3PM – 5PM', energy: 45, label: 'Recovery Needed', color: 'bg-orange-500' },
                            { time: '5PM – 8PM', energy: 70, label: 'Second Wind', color: 'bg-purple-500' },
                        ].map((block, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] font-mono font-black text-slate-500 w-24 shrink-0">{block.time}</span>
                                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                                    <div className={`h-full rounded-full ${block.color} transition-all duration-700`} style={{ width: `${block.energy}%` }} />
                                </div>
                                <span className="text-[9px] font-black text-slate-500 w-8 text-right">{block.energy}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dynamic Content Based on Active View */}
            {activeView === 'insights' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                            <Brain className="text-cyan-400" size={22} /> AI Cognitive Analysis
                        </h2>
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest font-black animate-pulse">
                            {insightCards.length} Active Insights
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {insightCards.map(card => {
                            const colors = impactColors[card.impact];
                            const isExpanded = expandedCard === card.id;
                            return (
                                <div
                                    key={card.id}
                                    className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] ${colors.glow}`}
                                >
                                    <button
                                        onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                                        className="w-full p-5 text-left cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text} shrink-0 border ${colors.border}`}>
                                                    {card.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-sm font-black text-slate-100 truncate">{card.title}</h4>
                                                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                            {card.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1.5 font-semibold leading-relaxed line-clamp-2">{card.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {card.metric && (
                                                    <div className="flex items-center gap-1">
                                                        {card.trend === 'up' && <ArrowUpRight size={14} className="text-emerald-400" />}
                                                        {card.trend === 'down' && <ArrowDownRight size={14} className="text-red-400" />}
                                                        {card.trend === 'stable' && <Minus size={14} className="text-slate-400" />}
                                                        <span className={`text-sm font-black ${card.trend === 'up' ? 'text-emerald-400' : card.trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
                                                            {card.metric}
                                                        </span>
                                                    </div>
                                                )}
                                                {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                                            </div>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                                            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 mt-1">
                                                <p className="text-xs text-slate-300 leading-relaxed font-semibold">{card.details}</p>
                                                {card.actionLabel && (
                                                    <button className={`mt-3 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border} hover:scale-105 transition-all cursor-pointer`}>
                                                        {card.actionLabel}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeView === 'forecast' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                            <TrendingUp className="text-emerald-400" size={22} /> Productivity Forecast Engine
                        </h2>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest font-black">
                            ML-Powered Predictions
                        </span>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                        <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Eye size={16} className="text-emerald-400" /> Predicted vs Actual Performance
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                    <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted" />
                                    <Area type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Score" connectNulls={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <div className="w-8 h-0.5 border-t-2 border-dashed border-emerald-500" />
                                <span>AI Predicted</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <div className="w-8 h-0.5 bg-cyan-500 rounded" />
                                <span>Actual Performance</span>
                            </div>
                        </div>
                    </div>

                    {/* Forecast accuracy and next-day prediction */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <Target size={14} className="text-cyan-400" /> Forecast Accuracy
                            </h4>
                            <div className="text-4xl font-black text-cyan-400">93.2%</div>
                            <p className="text-xs text-slate-500 font-bold mt-2">Model accuracy over the last 30 days</p>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400">
                                <ArrowUpRight size={14} />
                                <span>+2.1% improvement from last week</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900/60 to-indigo-900/20 backdrop-blur-xl border border-indigo-500/20 p-6 rounded-2xl shadow-lg">
                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                                <Sparkles size={14} className="animate-pulse" /> Tomorrow's Prediction
                            </h4>
                            <div className="text-4xl font-black text-white">85<span className="text-lg text-slate-400">/100</span></div>
                            <p className="text-xs text-slate-400 font-bold mt-2">High productivity day predicted</p>
                            <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-850">
                                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                                    💡 <span className="text-indigo-400 font-bold">Recommendation:</span> Schedule your hardest tasks between 9-11 AM. Avoid meetings before noon.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'review' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                            <BarChart3 className="text-purple-400" size={22} /> Weekly AI Performance Review
                        </h2>
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 uppercase tracking-widest font-black">
                            Week 21 Report
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Radar Chart */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={16} className="text-purple-400" /> Performance Radar
                            </h3>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                        <PolarGrid stroke="#1e293b" />
                                        <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={11} tickLine={false} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e293b" fontSize={10} />
                                        <Radar name="Performance" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Tasks Done</div>
                                    <div className="text-2xl font-black text-slate-100 mt-2">{weeklyReview.totalTasksCompleted}</div>
                                </div>
                                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Focus Hours</div>
                                    <div className="text-2xl font-black text-slate-100 mt-2">{weeklyReview.totalFocusHours}h</div>
                                </div>
                                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Best Day</div>
                                    <div className="text-lg font-black text-emerald-400 mt-2">{weeklyReview.bestDay} 🏆</div>
                                </div>
                                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg Score</div>
                                    <div className="text-2xl font-black text-cyan-400 mt-2">{weeklyReview.avgProductivity}%</div>
                                </div>
                            </div>

                            {/* Achievements */}
                            <div className="bg-gradient-to-br from-slate-900/60 to-emerald-900/10 border border-emerald-500/20 p-5 rounded-2xl shadow-lg">
                                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                                    <Sparkles size={14} /> Weekly Achievements
                                </h4>
                                <div className="space-y-2">
                                    {weeklyReview.achievements.map((achievement, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-950/40 rounded-xl border border-slate-850 text-xs font-bold text-slate-200">
                                            <span className="text-emerald-400">🏅</span> {achievement}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Improvement Areas */}
                            <div className="bg-gradient-to-br from-slate-900/60 to-amber-900/10 border border-amber-500/20 p-5 rounded-2xl shadow-lg">
                                <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                                    <Lightbulb size={14} /> Focus Areas for Next Week
                                </h4>
                                <div className="space-y-2">
                                    {weeklyReview.improvementAreas.map((area, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-950/40 rounded-xl border border-slate-850 text-xs font-bold text-slate-200">
                                            <span className="text-amber-400">🎯</span> {area}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIProductivityInsights;
