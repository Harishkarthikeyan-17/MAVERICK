import React from 'react';
import { Heart, Activity, Scale, Wind } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { time: '10:00', heartRate: 72 },
    { time: '11:00', heartRate: 78 },
    { time: '12:00', heartRate: 75 },
    { time: '13:00', heartRate: 82 },
    { time: '14:00', heartRate: 70 },
    { time: '15:00', heartRate: 76 },
];

const HealthVitals: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Heart Rate */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Heart size={48} className="text-rose-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                        <Heart size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Heart Rate</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-slate-100">76</h3>
                    <span className="text-xs text-slate-500 mb-1">bpm</span>
                </div>
                <div className="h-10 w-full opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Blood Pressure */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={48} className="text-cyan-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                        <Activity size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Blood Pressure</span>
                </div>
                <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold text-slate-100">120/80</h3>
                    <span className="text-xs text-slate-500 mb-1">mmHg</span>
                </div>
                <p className="text-[10px] text-green-400 mt-2 font-medium">Normotensive</p>
            </div>

            {/* Weight */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Scale size={48} className="text-amber-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                        <Scale size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Weight</span>
                </div>
                <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold text-slate-100">72.5</h3>
                    <span className="text-xs text-slate-500 mb-1">kg</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
            </div>

            {/* SpO2 */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wind size={48} className="text-sky-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                        <Wind size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">SpO2</span>
                </div>
                <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold text-slate-100">98%</h3>
                    <span className="text-xs text-slate-500 mb-1">Normal</span>
                </div>
                <p className="text-[10px] text-sky-400 mt-2 font-medium">Optimal Levels</p>
            </div>
        </div>
    );
};

export default HealthVitals;
