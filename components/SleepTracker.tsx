import React from 'react';
import { Moon, Star, Clock, CloudMoon } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const data = [
    { day: 'M', hours: 6.5 },
    { day: 'T', hours: 7.2 },
    { day: 'W', hours: 5.8 },
    { day: 'T', hours: 8.0 },
    { day: 'F', hours: 7.5 },
    { day: 'S', hours: 9.0 },
    { day: 'S', hours: 8.5 },
];

const SleepTracker: React.FC = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full"></div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                        <Moon size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Sleep Analysis</h3>
                        <p className="text-xs text-slate-500">Last 7 Days</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-slate-100">7h 42m</div>
                    <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">+12% vs last week</span>
                </div>
            </div>

            <div className="h-32 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                    <CloudMoon className="text-purple-400" size={18} />
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Deep Sleep</p>
                        <p className="text-sm font-bold text-slate-200">2h 15m</p>
                    </div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                    <Star className="text-amber-400" size={18} />
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Quality</p>
                        <p className="text-sm font-bold text-slate-200">Excellent</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SleepTracker;
