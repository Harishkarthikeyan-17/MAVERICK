import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, X, Pill, Target, BrainCircuit, Wallet, Calendar } from 'lucide-react';

export const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'Focus Debt Alert', message: 'You are 3 hours behind your weekly focus target.', type: 'warning', icon: Target, time: '2h ago' },
    { id: 2, title: 'Streak Milestone', message: 'You hit a 5-day learning streak!', type: 'success', icon: BrainCircuit, time: '5h ago' },
    { id: 3, title: 'AI Recommendation', message: 'New resource suggested for System Design.', type: 'info', icon: Info, time: '1d ago' },
    { id: 4, title: 'Budget Alert', message: 'You have reached 80% of your weekly food budget.', type: 'warning', icon: Wallet, time: '1d ago' },
    { id: 5, title: 'Upcoming Trip', message: 'Check-in for your flight to Tokyo opens in 24 hours.', type: 'info', icon: Calendar, time: '2d ago' },
];

const NotificationCenter: React.FC = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Notification Center</h3>
                        <p className="text-xs text-slate-500">Your Unified Alerts</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors">
                    MARK ALL READ
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {MOCK_NOTIFICATIONS.map((note) => {
                    const Icon = note.icon || Bell;
                    const colorClasses = 
                        note.type === 'info' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                        note.type === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                        note.type === 'success' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                        'text-slate-400 bg-slate-800 border-slate-700';

                    return (
                        <div key={note.id} className="flex gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-800/50 hover:border-slate-700 hover:bg-slate-800/50 transition-all group relative overflow-hidden">
                            <div className={`mt-0.5 p-2 rounded-lg flex shrink-0 items-center justify-center h-8 w-8 ${colorClasses}`}>
                                <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-sm font-bold text-slate-200 truncate">{note.title}</h4>
                                    <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{note.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{note.message}</p>
                            </div>
                            <button className="text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all absolute top-3 right-3 bg-slate-900 p-1 rounded-md">
                                <X size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NotificationCenter;
