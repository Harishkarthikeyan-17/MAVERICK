
import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, X, Pill } from 'lucide-react';

const NotificationCenter: React.FC = () => {
    const notifications = [
        { title: 'Medication Reminder', message: 'Take 1x Metformin (500mg)', type: 'medication', time: 'Now' },
        { title: 'System Update', message: 'MAVERIC v2.0 is live.', type: 'info', time: '2m ago' },
        { title: 'High Usage', message: 'Memory usage exceeded 80%', type: 'warning', time: '1h ago' },
        { title: 'Task Completed', message: 'Project proposal submitted', type: 'success', time: '3h ago' },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Notifications</h3>
                        <p className="text-xs text-slate-500">Recent Alerts</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                    CLEAR ALL
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((note, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-all group relative overflow-hidden">

                        <div className={`
              mt-1 w-2 h-2 rounded-full shrink-0
              ${note.type === 'info' ? 'bg-blue-500' :
                                note.type === 'warning' ? 'bg-amber-500' :
                                    note.type === 'medication' ? 'bg-rose-500' : 'bg-green-500'}
            `} />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-slate-200">{note.title}</h4>
                                <span className="text-[10px] text-slate-500 font-medium">{note.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{note.message}</p>

                            {note.type === 'medication' && (
                                <button className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all text-xs font-bold border border-rose-500/20">
                                    <Pill size={14} />
                                    MARK AS TAKEN
                                </button>
                            )}
                        </div>
                        <button className="text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all absolute top-2 right-2">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationCenter;
