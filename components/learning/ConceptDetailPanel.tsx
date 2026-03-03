import React, { useState } from 'react';
import {
    X,
    ExternalLink,
    Paperclip,
    BrainCircuit,
    HelpCircle,
    BookOpen,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    MessageSquare,
    BarChart3
} from 'lucide-react';
import { LearningSubtopic, LearningTask } from '../../types';

interface ConceptDetailPanelProps {
    subtopic: LearningSubtopic | null;
    tasks: LearningTask[];
    onClose: () => void;
    onUpdateSubtopic: (subtopic: LearningSubtopic) => void;
    onToggleTask: (taskId: string) => void;
    onAddTask: (subtopicId: string, title: string) => void;
}

const ConceptDetailPanel: React.FC<ConceptDetailPanelProps> = ({
    subtopic,
    tasks,
    onClose,
    onUpdateSubtopic,
    onToggleTask,
    onAddTask
}) => {
    const [newNote, setNewNote] = useState('');
    const [reflection, setReflection] = useState({ understood: '', confused: '' });

    if (!subtopic) return null;

    const relevantTasks = tasks.filter(t => t.subtopicId === subtopic.id);
    const completionPercentage = relevantTasks.length > 0
        ? Math.round((relevantTasks.filter(t => t.completed).length / relevantTasks.length) * 100)
        : 0;

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-100">{subtopic.title}</h2>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Concept Detail Panel</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Progress & Difficulty */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Completion</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-black text-cyan-400">{completionPercentage}%</span>
                            <span className="text-xs text-slate-500 mb-1">Target 100%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Difficulty</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${subtopic.difficulty === 'Expert' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                subtopic.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                            {subtopic.difficulty}
                        </span>
                        <div className="mt-3 flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${(subtopic.difficulty === 'Beginner' && i === 1) ? 'bg-green-500' :
                                        (subtopic.difficulty === 'Intermediate' && i <= 2) ? 'bg-amber-500' :
                                            (subtopic.difficulty === 'Expert') ? 'bg-red-500' : 'bg-slate-800'
                                    }`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Time Tracking */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4 text-slate-100">
                        <Clock size={16} className="text-cyan-400" />
                        <h3 className="font-bold text-sm">Time Allocation</h3>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-400 font-medium">Estimated Time</span>
                        <span className="text-slate-200">{subtopic.estimatedTime}m</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-4">
                        <span className="text-slate-400 font-medium">Actual Spent</span>
                        <span className={`font-bold ${subtopic.actualTime > subtopic.estimatedTime ? 'text-red-400' : 'text-green-400'}`}>
                            {subtopic.actualTime}m
                        </span>
                    </div>
                    {subtopic.actualTime > subtopic.estimatedTime && (
                        <div className="flex items-center gap-2 p-2 bg-red-400/5 border border-red-400/10 rounded-lg">
                            <AlertCircle size={14} className="text-red-400" />
                            <p className="text-[10px] text-red-300">Exceeded estimates by {subtopic.actualTime - subtopic.estimatedTime} mins.</p>
                        </div>
                    )}
                </div>

                {/* Tasks Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Concept Tasks</h3>
                        <button
                            onClick={() => onAddTask(subtopic.id, 'New Task')}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {relevantTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => onToggleTask(task.id)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${task.completed
                                        ? 'bg-slate-900/30 border-slate-800 text-slate-500'
                                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-slate-700 group-hover:border-cyan-500/50'
                                        }`}>
                                        {task.completed && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <span className={`text-sm ${task.completed ? 'line-through' : 'font-medium'}`}>{task.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reflection Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="text-purple-400" size={18} />
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Concept Reflection</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5 ml-1">What did I understand?</label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 h-20 resize-none"
                                placeholder="Key takeaways..."
                                value={reflection.understood}
                                onChange={(e) => setReflection(prev => ({ ...prev, understood: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5 ml-1">Where am I confused?</label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 h-20 resize-none"
                                placeholder="Missing links or doubts..."
                                value={reflection.confused}
                                onChange={(e) => setReflection(prev => ({ ...prev, confused: e.target.value }))}
                            />
                        </div>
                    </div>
                </section>

                {/* Resources & Links */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <ExternalLink className="text-blue-400" size={18} />
                            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Resources</h3>
                        </div>
                        <button className="p-1.5 text-slate-500 hover:text-cyan-400 rounded-lg">
                            <Paperclip size={16} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {[
                            { title: 'Documentation link', type: 'Link' },
                            { title: 'Course video', type: 'Video' }
                        ].map((res, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer group">
                                <span className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors">{res.title}</span>
                                <span className="text-[10px] text-slate-600 font-bold uppercase">{res.type}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Revision Scheduler */}
                <section className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="text-purple-400" size={18} />
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Revision Scheduler</h3>
                    </div>
                    <div className="flex gap-2 justify-between">
                        {[1, 3, 7, 14, 30].map(days => (
                            <button
                                key={days}
                                className="flex-1 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-500 hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-400 transition-all"
                            >
                                {days}d
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-4 text-center">Spaced repetition schedule (1, 3, 7, 14, 30 days)</p>
                </section>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <button
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                    onClick={() => {
                        if (subtopic) onUpdateSubtopic({ ...subtopic, status: 'Completed' });
                        onClose();
                    }}
                >
                    <CheckCircle2 size={18} />
                    <span>Mark as Completed</span>
                </button>
            </div>
        </div>
    );
};

export default ConceptDetailPanel;
