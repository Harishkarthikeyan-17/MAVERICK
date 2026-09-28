import React from 'react';
import { Activity, Flame, Zap, Brain, Battery } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const data = [
    { time: '10:00', val: 40 },
    { time: '11:00', val: 65 },
    { time: '12:00', val: 50 },
    { time: '13:00', val: 80 },
    { time: '14:00', val: 60 },
    { time: '15:00', val: 75 },
];

const ActivityMetrics: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Overall Status */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={48} className="text-yellow-400" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
                        <Zap size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Overall Status</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-100">Peak</h3>
                </div>
                <p className="text-[10px] text-yellow-400 font-medium">Readiness: 92%</p>
                <div className="h-8 w-full opacity-50 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <Area type="monotone" dataKey="val" stroke="#facc15" fill="#facc15" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Activity Status */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={48} className="text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <Activity size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Activity</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-100">Active</h3>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium">Within Target</p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-4 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
            </div>

            {/* Calories Burnt */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame size={48} className="text-orange-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                        <Flame size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Calories</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-100">480</h3>
                    <span className="text-xs text-slate-500 mb-0.5">kcal</span>
                </div>
                <p className="text-[10px] text-orange-400 font-medium">+15% vs yest.</p>
            </div>

            {/* Mental Battery */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Battery size={48} className="text-cyan-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                        <Battery size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Energy</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-100">85%</h3>
                </div>
                <p className="text-[10px] text-cyan-400 font-medium">High Levels</p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-4 overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
            </div>

            {/* Mindfulness */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Brain size={48} className="text-purple-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Brain size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Mindfulness</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-100">15</h3>
                    <span className="text-xs text-slate-500 mb-0.5">min</span>
                </div>
                <p className="text-[10px] text-purple-400 font-medium">Session Complete</p>
            </div>

        </div>
    );
};

export default ActivityMetrics;
