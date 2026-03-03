import React from 'react';
import { PlannerTask } from '../types';
import { Clock, Tag, CheckCircle2, Circle, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface PlannerTaskCardProps {
    task: PlannerTask;
    onToggleComplete: (id: string) => void;
    onEdit?: (task: PlannerTask) => void;
    onDelete: (id: string) => void;
    showConflict?: boolean;
}

const PlannerTaskCard: React.FC<PlannerTaskCardProps> = ({
    task,
    onToggleComplete,
    onEdit,
    onDelete,
    showConflict = false,
}) => {
    const priorityColors = {
        High: 'bg-red-500/10 text-red-400 border-red-500/30',
        Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    };

    const categoryColors = {
        Work: 'bg-blue-500/10 text-blue-300',
        Study: 'bg-purple-500/10 text-purple-300',
        Health: 'bg-green-500/10 text-green-300',
        Personal: 'bg-pink-500/10 text-pink-300',
        Finance: 'bg-yellow-500/10 text-yellow-300',
        Other: 'bg-slate-500/10 text-slate-300',
    };

    return (
        <div
            className={`bg-slate-900 border rounded-xl p-4 transition-all group hover:bg-slate-800/60 ${task.completed ? 'border-slate-800 opacity-60' : 'border-slate-800'
                } ${showConflict ? 'border-red-500/50 bg-red-500/5' : ''}`}
        >
            <div className="flex items-start gap-3">
                {/* Completion Toggle */}
                <button
                    onClick={() => onToggleComplete(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    {task.completed ? (
                        <CheckCircle2 size={20} className="text-cyan-400" />
                    ) : (
                        <Circle size={20} />
                    )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h4
                            className={`font-medium text-slate-200 ${task.completed ? 'line-through text-slate-500' : ''
                                }`}
                        >
                            {task.title}
                        </h4>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(task)}
                                    className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"
                                >
                                    <Edit2 size={14} />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(task.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Time and Duration */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>
                                {task.startTime} - {task.endTime}
                            </span>
                        </div>
                        <span className="text-slate-600">•</span>
                        <span>{task.duration} min</span>
                    </div>

                    {/* Priority and Category Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priorityColors[task.priority]
                                }`}
                        >
                            {task.priority}
                        </span>
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[task.category]
                                }`}
                        >
                            <Tag size={10} className="inline mr-1" />
                            {task.category}
                        </span>
                        {showConflict && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-medium flex items-center gap-1">
                                <AlertCircle size={10} />
                                Time Conflict
                            </span>
                        )}
                    </div>

                    {/* Notes */}
                    {task.notes && (
                        <p className="text-xs text-slate-500 mt-2 italic">{task.notes}</p>
                    )}

                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {task.subtasks.map((subtask, idx) => (
                                <div key={idx} className="text-xs text-slate-500 flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                                    {subtask}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlannerTaskCard;
