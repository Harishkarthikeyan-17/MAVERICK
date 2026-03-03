import React from 'react';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';
import { TaskCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MonthlySummary {
    totalProductiveHours: number;
    totalTasksCompleted: number;
    totalTasksPlanned: number;
    completionRate: number;
    categoryFrequency: Record<TaskCategory, number>;
    consistencyScore: number;
    mostProductiveDay: string;
}

interface MonthlySummaryCardProps {
    summary: MonthlySummary;
}

const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({ summary }) => {
    const categoryData = Object.entries(summary.categoryFrequency)
        .filter(([_, count]: [string, number]) => count > 0)
        .map(([category, count]) => ({
            category,
            count,
        }));

    const formatDate = (dateStr: string) => {
        if (dateStr === 'N/A') return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center">
                    <Calendar size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-100">Monthly Summary</h3>
                    <p className="text-xs text-slate-500">Performance analytics</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={14} className="text-cyan-400" />
                        <span className="text-xs text-slate-400">Productive Hours</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">
                        {summary.totalProductiveHours.toFixed(1)}h
                    </p>
                </div>

                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={14} className="text-green-400" />
                        <span className="text-xs text-slate-400">Completion Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">
                        {summary.completionRate}%
                    </p>
                </div>

                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Award size={14} className="text-purple-400" />
                        <span className="text-xs text-slate-400">Consistency</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">
                        {summary.consistencyScore}/100
                    </p>
                </div>

                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-amber-400" />
                        <span className="text-xs text-slate-400">Best Day</span>
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                        {formatDate(summary.mostProductiveDay)}
                    </p>
                </div>
            </div>

            {/* Tasks Overview */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 mb-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-400">Tasks Completed</span>
                    <span className="text-sm font-bold text-slate-100">
                        {summary.totalTasksCompleted} / {summary.totalTasksPlanned}
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                        style={{
                            width: `${summary.totalTasksPlanned > 0 ? (summary.totalTasksCompleted / summary.totalTasksPlanned) * 100 : 0}%`
                        }}
                    />
                </div>
            </div>

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-3">Category Breakdown</h4>
                    <div className="h-[150px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <XAxis
                                    dataKey="category"
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #1e293b',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Most Frequent Categories */}
            <div className="mt-4 flex flex-wrap gap-2">
                {categoryData.slice(0, 3).map(({ category, count }) => (
                    <div
                        key={category}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg"
                    >
                        <span className="text-xs text-slate-300 font-medium">{category}</span>
                        <span className="text-xs text-slate-500 ml-2">×{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlySummaryCard;
