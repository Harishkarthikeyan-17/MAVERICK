import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    TrendingUp,
    Zap,
    PieChart as PieIcon,
    Calendar,
    Flame,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { LearningAnalytics as LearningAnalyticsData } from '../../types';

interface LearningAnalyticsProps {
    analytics: LearningAnalyticsData;
}

const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({ analytics }) => {
    const COLORS = ['#0ea5e9', '#22c55e', '#a855f7', '#f59e0b', '#ef4444'];

    // Mock data for heatmap if not provided
    const days = Array.from({ length: 28 }, (_, i) => ({
        date: `2024-03-${i + 1}`,
        count: Math.floor(Math.random() * 5)
    }));

    const getHeatmapColor = (count: number) => {
        if (count === 0) return 'bg-slate-800/50';
        if (count === 1) return 'bg-cyan-900/40';
        if (count === 2) return 'bg-cyan-700/60';
        if (count === 3) return 'bg-cyan-500/80';
        return 'bg-cyan-400';
    };

    const getEfficiencyColor = (level: string) => {
        switch (level) {
            case 'Peak': return 'text-cyan-400';
            case 'High': return 'text-green-400';
            case 'Moderate': return 'text-amber-400';
            case 'Low': return 'text-red-400';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Learning Progress Graph */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-cyan-400" size={18} />
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Learning Progress</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400 font-bold flex items-center gap-0.5">
                            <ArrowUpRight size={14} /> +12%
                        </span>
                    </div>
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.completionTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#0ea5e9' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="percentage"
                                stroke="#0ea5e9"
                                strokeWidth={2}
                                dot={{ r: 3, fill: '#0ea5e9' }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Efficiency Meter */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Zap className="text-amber-400" size={18} />
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</h3>
                </div>

                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64" cy="64" r="58"
                            stroke="currentColor" strokeWidth="8"
                            fill="transparent"
                            className="text-slate-800"
                        />
                        <circle
                            cx="64" cy="64" r="58"
                            stroke="currentColor" strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (analytics.efficiency.score / 100) * 364.4}
                            strokeLinecap="round"
                            className={getEfficiencyColor(analytics.efficiency.level)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-100">{analytics.efficiency.score}%</span>
                        <span className={`text-[10px] font-bold uppercase ${getEfficiencyColor(analytics.efficiency.level)}`}>
                            {analytics.efficiency.level}
                        </span>
                    </div>
                </div>

                <p className="text-[10px] text-slate-500 mt-4 text-center leading-tight">
                    Based on task completion vs. planned time accuracy.
                </p>
            </div>

            {/* Consistency Tracker */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-purple-400" size={18} />
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Consistency</h3>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                        <Flame size={14} fill="currentColor" />
                        <span className="text-xs font-bold">{analytics.streak} Day Streak</span>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={`w-full aspect-square rounded-sm ${getHeatmapColor(day.count)} transition-all hover:scale-110 cursor-help`}
                            title={`${day.date}: ${day.count} activities`}
                        />
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">Less</span>
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map(v => (
                                <div key={v} className={`w-2.5 h-2.5 rounded-sm ${getHeatmapColor(v)}`} />
                            ))}
                        </div>
                        <span className="text-[10px] text-slate-500">More</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Last 28 Days</span>
                </div>
            </div>

            {/* Skill Distribution Chart */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6">
                    <PieIcon className="text-green-400" size={18} />
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Skill Distribution</h3>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="h-[180px] w-full lg:w-1/2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.skillDistribution}
                                    cx="50%" cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics.skillDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3">
                        {analytics.skillDistribution.map((skill, i) => (
                            <div key={skill.name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-200">{skill.name}</span>
                                    <span className="text-[10px] text-slate-500">{skill.value}h Spent</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Time Allocation Mini View */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Weekly Time Allocation</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span className="text-[10px] text-slate-500 uppercase">Actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-700" />
                            <span className="text-[10px] text-slate-500 uppercase">Planned</span>
                        </div>
                    </div>
                </div>
                <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Mon', actual: 4, planned: 5 },
                            { name: 'Tue', actual: 5, planned: 4 },
                            { name: 'Wed', actual: 3, planned: 5 },
                            { name: 'Thu', actual: 6, planned: 5 },
                            { name: 'Fri', actual: 4, planned: 4 },
                            { name: 'Sat', actual: 2, planned: 3 },
                            { name: 'Sun', actual: 1, planned: 2 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            />
                            <Bar dataKey="actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="planned" fill="#334155" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default LearningAnalytics;
