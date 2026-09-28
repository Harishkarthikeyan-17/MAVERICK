import React from 'react';
import { BarChart3, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface DailySummary {
    totalPlannedTime: number;
    totalCompletedTime: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    productivityPercentage: number;
}

interface DaySummaryCardProps {
    summary: DailySummary;
}

const DaySummaryCard: React.FC<DaySummaryCardProps> = ({ summary }) => {
    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center">
                    <BarChart3 size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-100">Day Summary</h3>
                    <p className="text-xs text-slate-500">Today's productivity</p>
                </div>
            </div>

            {/* Productivity Circle */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-slate-800"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - summary.productivityPercentage / 100)}`}
                            className="text-cyan-500 transition-all duration-1000"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-100">
                            {summary.productivityPercentage}%
                        </span>
                        <span className="text-xs text-slate-500">Complete</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={14} className="text-cyan-400" />
                        <span className="text-xs text-slate-400">Planned Time</span>
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                        {formatTime(summary.totalPlannedTime)}
                    </p>
                </div>

                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={14} className="text-green-400" />
                        <span className="text-xs text-slate-400">Completed</span>
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                        {formatTime(summary.totalCompletedTime)}
                    </p>
                </div>

                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={14} className="text-purple-400" />
                        <span className="text-xs text-slate-400">Tasks Done</span>
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                        {summary.completedTasks}/{summary.totalTasks}
                    </p>
                </div>

                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={14} className="text-amber-400" />
                        <span className="text-xs text-slate-400">Pending</span>
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                        {summary.pendingTasks}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Task Completion</span>
                    <span>{summary.completedTasks} of {summary.totalTasks}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${summary.productivityPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DaySummaryCard;
