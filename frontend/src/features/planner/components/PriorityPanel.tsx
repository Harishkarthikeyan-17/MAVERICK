import React from 'react';
import { PlannerTask, TaskPriority } from '../../../core/types';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import PlannerTaskCard from './PlannerTaskCard';

interface PriorityPanelProps {
    priority: TaskPriority;
    tasks: PlannerTask[];
    onToggleComplete: (id: string) => void;
    onEdit?: (task: PlannerTask) => void;
    onDelete: (id: string) => void;
}

const PriorityPanel: React.FC<PriorityPanelProps> = ({
    priority,
    tasks,
    onToggleComplete,
    onEdit,
    onDelete,
}) => {
    const priorityConfig = {
        High: {
            icon: AlertCircle,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
        },
        Medium: {
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
        },
        Low: {
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
        },
    };

    const config = priorityConfig[priority];
    const Icon = config.icon;
    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 ${config.bg} ${config.color} rounded-lg flex items-center justify-center`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100">{priority} Priority</h3>
                        <p className="text-xs text-slate-500">
                            {completedCount}/{tasks.length} completed
                        </p>
                    </div>
                </div>
                <div className={`px-2.5 py-1 rounded-lg ${config.bg} border ${config.border}`}>
                    <span className={`text-xs font-bold ${config.color}`}>{tasks.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            {tasks.length > 0 && (
                <div className="mb-4">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${config.bg.replace('/10', '')} rounded-full transition-all duration-500`}
                            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Tasks List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <p className="text-sm">No {priority.toLowerCase()} priority tasks</p>
                        <p className="text-xs mt-1">Tasks will appear here</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <PlannerTaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={onToggleComplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default PriorityPanel;
