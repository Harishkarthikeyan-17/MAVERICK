
import React from 'react';
import { Target, TrendingUp, Plus } from 'lucide-react';

const GoalWidget: React.FC = () => {
    const goals = [
        { title: 'Read 20 Books', current: 12, target: 20, color: 'bg-emerald-500' },
        { title: 'Save $5k', current: 3500, target: 5000, color: 'bg-blue-500' },
        { title: 'Run 100km', current: 45, target: 100, color: 'bg-amber-500' },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Goals</h3>
                        <p className="text-xs text-slate-500">Track Progress</p>
                    </div>
                </div>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all">
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-6">
                {goals.map((goal, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="font-medium text-slate-300">{goal.title}</span>
                            <span className="text-slate-500 font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${goal.color} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${(goal.current / goal.target) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-slate-800 border-dashed hover:border-solid">
                VIEW ALL GOALS
            </button>
        </div>
    );
};

export default GoalWidget;
