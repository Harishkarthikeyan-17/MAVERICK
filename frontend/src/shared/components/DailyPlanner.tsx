
import React from 'react';
import { Clock, MoreVertical, Calendar } from 'lucide-react';

const DailyPlanner: React.FC = () => {
    const schedule = [
        { time: '09:00 AM', title: 'Team Standup', type: 'work', duration: '30m' },
        { time: '10:00 AM', title: 'Deep Work: Project X', type: 'focus', duration: '2h' },
        { time: '12:30 PM', title: 'Lunch Break', type: 'break', duration: '1h' },
        { time: '02:00 PM', title: 'Client Meeting', type: 'meeting', duration: '1h' },
        { time: '04:00 PM', title: 'Code Review', type: 'work', duration: '1h' },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Daily Planner</h3>
                        <p className="text-xs text-slate-500">Today's Schedule</p>
                    </div>
                </div>
                <button className="p-2 text-slate-500 hover:text-slate-200 transition-colors">
                    <MoreVertical size={18} />
                </button>
            </div>

            <div className="relative space-y-0 relative pl-4 border-l border-slate-800 ml-2">
                {schedule.map((item, index) => (
                    <div key={index} className="relative pl-6 pb-8 last:pb-0 group">
                        <span className={`
              absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-slate-950 
              ${item.type === 'focus' ? 'bg-purple-500' :
                                item.type === 'meeting' ? 'bg-red-500' :
                                    item.type === 'break' ? 'bg-green-500' : 'bg-cyan-500'}
              group-hover:scale-125 transition-transform duration-300
            `} />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 group-hover:bg-slate-800/30 p-2 -ml-2 rounded-lg transition-colors">
                            <div>
                                <span className="text-xs font-bold text-slate-500 mb-1 block">{item.time}</span>
                                <h4 className="text-sm font-medium text-slate-200">{item.title}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock size={12} />
                                <span>{item.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyPlanner;
