import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line
} from 'recharts';
import {
    Target, TrendingUp, Calendar, Zap, BarChart3, Brain,
    Clock, Flame, CheckCircle2, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface ConsistencyAnalyticsProps {
    xp: number;
    level: number;
    streak: number;
    focusSessions: number;
}

const ConsistencyAnalytics: React.FC<ConsistencyAnalyticsProps> = ({
    xp, level, streak, focusSessions
}) => {
    const [activeChart, setActiveChart] = useState<'overview' | 'habits' | 'time' | 'focus'>('overview');

    // Weekly completion and focus data
    const weeklyData = [
        { name: 'Mon', completion: 65, focus: 45, efficiency: 72 },
        { name: 'Tue', completion: 85, focus: 75, efficiency: 88 },
        { name: 'Wed', completion: 90, focus: 80, efficiency: 91 },
        { name: 'Thu', completion: 70, focus: 60, efficiency: 75 },
        { name: 'Fri', completion: 95, focus: 90, efficiency: 96 },
        { name: 'Sat', completion: 40, focus: 30, efficiency: 48 },
        { name: 'Sun', completion: 50, focus: 40, efficiency: 55 },
    ];

    // Monthly habit retention data
    const monthlyHabitData = [
        { name: 'Week 1', rate: 70, habits: 5 },
        { name: 'Week 2', rate: 85, habits: 6 },
        { name: 'Week 3', rate: 82, habits: 6 },
        { name: 'Week 4', rate: 95, habits: 7 },
    ];

    // Focus score trend (hourly)
    const focusTrendData = [
        { hour: '6AM', score: 30 }, { hour: '7AM', score: 55 },
        { hour: '8AM', score: 82 }, { hour: '9AM', score: 95 },
        { hour: '10AM', score: 92 }, { hour: '11AM', score: 88 },
        { hour: '12PM', score: 60 }, { hour: '1PM', score: 50 },
        { hour: '2PM', score: 55 }, { hour: '3PM', score: 48 },
        { hour: '4PM', score: 62 }, { hour: '5PM', score: 70 },
        { hour: '6PM', score: 65 }, { hour: '7PM', score: 55 },
        { hour: '8PM', score: 45 }, { hour: '9PM', score: 35 },
    ];

    // Radar chart data
    const radarData = [
        { metric: 'Productivity', value: 85, fullMark: 100 },
        { metric: 'Consistency', value: 78, fullMark: 100 },
        { metric: 'Time Mgmt', value: 70, fullMark: 100 },
        { metric: 'Task Efficiency', value: 92, fullMark: 100 },
        { metric: 'Focus Quality', value: 82, fullMark: 100 },
        { metric: 'Habit Retention', value: 88, fullMark: 100 },
    ];

    // Donut chart data - time breakdown
    const timeBreakdownData = [
        { name: 'Deep Work', value: 240, color: '#06b6d4' },
        { name: 'Meetings', value: 90, color: '#8b5cf6' },
        { name: 'Admin Tasks', value: 60, color: '#f59e0b' },
        { name: 'Breaks', value: 45, color: '#10b981' },
        { name: 'Distractions', value: 30, color: '#ef4444' },
        { name: 'Planning', value: 35, color: '#ec4899' },
    ];

    const totalMinutes = timeBreakdownData.reduce((sum, d) => sum + d.value, 0);

    // Heatmap data for habit consistency (7 days x 20 weeks)
    const heatmapGrid = useMemo(() => {
        const grid = [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let d = 0; d < 7; d++) {
            const row = [];
            for (let w = 0; w < 20; w++) {
                const seed = (d * 3 + w * 7 + d * w) % 13;
                let intensity = 0;
                if (seed > 10) intensity = 4;
                else if (seed > 7) intensity = 3;
                else if (seed > 4) intensity = 2;
                else if (seed > 1) intensity = 1;
                row.push(intensity);
            }
            grid.push({ day: days[d], values: row });
        }
        return grid;
    }, []);

    const intensityColors = [
        'bg-slate-950 border-slate-850',
        'bg-cyan-500/15',
        'bg-cyan-500/35',
        'bg-cyan-500/60',
        'bg-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.3)]'
    ];

    // Most productive day analysis
    const mostProductiveDay = useMemo(() => {
        return weeklyData.reduce((best, day) =>
            day.completion > best.completion ? day : best
        , weeklyData[0]);
    }, []);

    // Average completion time
    const avgCompletionTime = 34; // minutes

    return (
        <div className="space-y-6 animate-in fade-in duration-700">

            {/* Chart View Selector */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-x-auto scrollbar-hide">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-cyan-400' },
                    { id: 'habits', label: 'Habit Analysis', icon: Flame, color: 'text-purple-400' },
                    { id: 'time', label: 'Time Analytics', icon: Clock, color: 'text-amber-400' },
                    { id: 'focus', label: 'Focus Trends', icon: Target, color: 'text-emerald-400' },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveChart(tab.id as typeof activeChart)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-300 cursor-pointer ${
                                activeChart === tab.id
                                    ? `bg-slate-800 border border-slate-700 ${tab.color} shadow-xl`
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 border border-transparent'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Avg Completion', value: '82%', icon: <CheckCircle2 size={14} />, color: 'text-cyan-400 bg-cyan-500/10', trend: '+5%', up: true },
                    { label: 'Longest Streak', value: `${streak} Days`, icon: <Flame size={14} />, color: 'text-amber-400 bg-amber-500/10', trend: 'Active', up: true },
                    { label: 'Habits Mastered', value: '24', icon: <Calendar size={14} />, color: 'text-emerald-400 bg-emerald-500/10', trend: '+3', up: true },
                    { label: 'Focus Score', value: '78', icon: <Target size={14} />, color: 'text-purple-400 bg-purple-500/10', trend: '+8', up: true },
                    { label: 'Avg Task Time', value: `${avgCompletionTime}m`, icon: <Clock size={14} />, color: 'text-pink-400 bg-pink-500/10', trend: '-4m', up: true },
                    { label: 'Best Day', value: mostProductiveDay.name, icon: <TrendingUp size={14} />, color: 'text-indigo-400 bg-indigo-500/10', trend: `${mostProductiveDay.completion}%`, up: true },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-md relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-1.5 rounded-lg ${stat.color.split(' ')[1]}`}>
                                <span className={stat.color.split(' ')[0]}>{stat.icon}</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                                {stat.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {stat.trend}
                            </span>
                        </div>
                        <div className="text-xl font-black text-slate-100">{stat.value}</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Overview Charts */}
            {activeChart === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Productivity Trend - Area Chart */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
                        <h3 className="text-sm font-black text-slate-100 mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest">
                            <Zap className="text-cyan-400" size={16} /> Weekly Productivity Trend
                        </h3>
                        <div className="h-[260px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorComp2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorFocus2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                    <Area type="monotone" dataKey="completion" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorComp2)" name="Completion %" />
                                    <Area type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus2)" name="Focus Score" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Radar Chart - Multi-metric Performance */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                        <h3 className="text-sm font-black text-slate-100 mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest">
                            <Brain className="text-indigo-400" size={16} /> Performance Radar
                        </h3>
                        <div className="h-[260px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="#1e293b" />
                                    <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={10} tickLine={false} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e293b" fontSize={9} />
                                    <Radar name="Score" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Habit Analysis */}
            {activeChart === 'habits' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Habit Retention Bar */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
                            <h3 className="text-sm font-black text-slate-100 mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest">
                                <Target className="text-purple-400" size={16} /> Monthly Habit Retention
                            </h3>
                            <div className="h-[260px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyHabitData} barSize={30}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
                                        <Bar dataKey="rate" radius={[6, 6, 0, 0]} name="Retention Rate %">
                                            {monthlyHabitData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.rate > 80 ? '#10b981' : entry.rate > 75 ? '#8b5cf6' : '#f59e0b'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Habit Streak Heatmap */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2 uppercase tracking-widest">
                                    <Flame className="text-amber-400" size={16} /> Consistency Heatmap
                                </h3>
                                <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-1 border border-slate-850 rounded-lg">
                                    <span>Less</span>
                                    {intensityColors.map((cls, i) => (
                                        <div key={i} className={`w-2.5 h-2.5 rounded-sm ${cls}`} />
                                    ))}
                                    <span>More</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar pb-2 relative z-10">
                                <div className="flex flex-col gap-1 min-w-[600px]">
                                    {heatmapGrid.map((row) => (
                                        <div key={row.day} className="flex items-center gap-1">
                                            <span className="text-[9px] font-black text-slate-500 font-mono w-7 shrink-0 uppercase tracking-wider">{row.day}</span>
                                            <div className="flex gap-0.5">
                                                {row.values.map((intensity, wIdx) => (
                                                    <div
                                                        key={wIdx}
                                                        className={`w-3 h-3 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer ${intensityColors[intensity]}`}
                                                        title={`Week ${wIdx + 1}, ${row.day}: ${['None', 'Low', 'Medium', 'High', 'Peak'][intensity]}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Time Analytics */}
            {activeChart === 'time' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Time Breakdown Donut */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                            <h3 className="text-sm font-black text-slate-100 mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest">
                                <Clock className="text-amber-400" size={16} /> Daily Time Breakdown
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
                                <div className="h-[220px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={timeBreakdownData}
                                                cx="50%" cy="50%"
                                                innerRadius={60} outerRadius={85}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {timeBreakdownData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total</span>
                                        <span className="text-xl font-black text-slate-200">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {timeBreakdownData.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-950/40 rounded-xl border border-slate-850">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                                <span className="text-xs font-bold text-slate-300">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-right">
                                                <span className="text-xs font-black text-slate-100 font-mono">{item.value}m</span>
                                                <span className="text-[9px] font-bold text-slate-500">{Math.round((item.value / totalMinutes) * 100)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Efficiency Trend Line Chart */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                            <h3 className="text-sm font-black text-slate-100 mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest">
                                <Activity className="text-emerald-400" size={16} /> Task Efficiency Trend
                            </h3>
                            <div className="h-[260px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                        <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} name="Efficiency %" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Focus Trends */}
            {activeChart === 'focus' && (
                <div className="space-y-6">
                    {/* Focus Score Throughout Day */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
                        <h3 className="text-sm font-black text-slate-100 mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest">
                            <Target className="text-emerald-400" size={16} /> Focus Quality Throughout the Day
                        </h3>
                        <div className="h-[280px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={focusTrendData}>
                                    <defs>
                                        <linearGradient id="colorFocusTrend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }} />
                                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFocusTrend)" name="Focus Score" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Focus Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: 'Peak Focus Window', value: '8 AM – 11 AM', desc: 'Your cognitive peak with 92 avg focus score', color: 'text-emerald-400', bg: 'from-emerald-900/10' },
                            { title: 'Low Focus Zone', value: '3 PM – 5 PM', desc: 'Post-lunch dip — schedule breaks here', color: 'text-amber-400', bg: 'from-amber-900/10' },
                            { title: 'Focus Sessions Today', value: `${focusSessions} / 5`, desc: `${5 - focusSessions} more sessions to hit daily goal`, color: 'text-cyan-400', bg: 'from-cyan-900/10' },
                        ].map((insight, i) => (
                            <div key={i} className={`bg-gradient-to-br ${insight.bg} to-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-lg`}>
                                <h4 className={`text-xs font-black uppercase tracking-widest ${insight.color} mb-2`}>{insight.title}</h4>
                                <div className="text-xl font-black text-slate-100 mb-1">{insight.value}</div>
                                <p className="text-xs text-slate-400 font-semibold">{insight.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Performance Insights Panel */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900/20 border border-indigo-500/20 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap size={16} /> AI Performance Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: 'Optimal Focus Time', text: 'You complete 40% more tasks when scheduled between 9AM and 11AM.', color: 'text-emerald-400' },
                        { title: 'Fatigue Warning', text: 'Late-night sessions are reducing your next-day focus score by 15%.', color: 'text-amber-400' },
                        { title: 'Streak Bonus', text: 'Maintaining your meditation habit correlates with higher daily completion.', color: 'text-cyan-400' },
                        { title: 'Consistency Pattern', text: 'Structured morning routines increase your task output by 32%.', color: 'text-purple-400' },
                        { title: 'Break Optimization', text: '5-minute breaks every 45 min improve sustained focus by 18%.', color: 'text-pink-400' },
                        { title: 'Recovery Days', text: 'Light activity days boost next-day productivity scores by 12%.', color: 'text-indigo-400' },
                    ].map((insight, i) => (
                        <div key={i} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 hover:border-indigo-500/20 transition-colors">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <span className={`${insight.color} font-bold block mb-1`}>{insight.title}</span>
                                {insight.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConsistencyAnalytics;
