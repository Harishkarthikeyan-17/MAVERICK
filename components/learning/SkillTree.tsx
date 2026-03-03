import React, { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Plus,
    MoreVertical,
    Trash2,
    Edit2,
    Clock,
    AlertCircle,
    Network,
    Target
} from 'lucide-react';
import { LearningSkill, LearningCategory, LearningSubtopic, LearningTask } from '../../types';

interface SkillTreeProps {
    skills: LearningSkill[];
    categories: LearningCategory[];
    subtopics: LearningSubtopic[];
    tasks: LearningTask[];
    onAddSkill: () => void;
    onEditSkill: (skill: LearningSkill) => void;
    onDeleteSkill: (id: string) => void;
    onAddCategory: (skillId: string) => void;
    onAddSubtopic: (categoryId: string) => void;
    onAddTask: (subtopicId: string) => void;
    onToggleTask: (taskId: string) => void;
    onSelectSubtopic: (subtopic: LearningSubtopic) => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({
    skills,
    categories,
    subtopics,
    tasks,
    onAddSkill,
    onEditSkill,
    onDeleteSkill,
    onAddCategory,
    onAddSubtopic,
    onAddTask,
    onToggleTask,
    onSelectSubtopic
}) => {
    const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const toggleSkill = (id: string) => {
        setExpandedSkills(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-green-400 bg-green-400/10';
            case 'In Progress': return 'text-cyan-400 bg-cyan-400/10';
            default: return 'text-slate-500 bg-slate-800/50';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Network className="text-cyan-400" size={20} />
                    <h3 className="text-lg font-bold text-slate-100">Learning Roadmap</h3>
                </div>
                <button
                    onClick={onAddSkill}
                    className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all"
                >
                    <Plus size={16} />
                    <span>Add Skill</span>
                </button>
            </div>

            <div className="space-y-4">
                {skills.map(skill => (
                    <div key={skill.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                        {/* Skill Header */}
                        <div
                            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors ${expandedSkills[skill.id] ? 'bg-slate-800/30' : ''}`}
                            onClick={() => toggleSkill(skill.id)}
                        >
                            <div className="flex items-center gap-3">
                                {expandedSkills[skill.id] ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                                <div>
                                    <h4 className="font-bold text-slate-100">{skill.name}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityColor(skill.priority)} font-bold uppercase tracking-tighter`}>
                                            {skill.priority}
                                        </span>
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Clock size={10} /> {skill.dailyTime}m daily / {skill.weeklyGoal}h weekly
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onAddCategory(skill.id); }}
                                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all"
                                    title="Add Category"
                                >
                                    <Plus size={16} />
                                </button>
                                <div className="h-4 w-px bg-slate-800 mx-1" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEditSkill(skill); }}
                                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteSkill(skill.id); }}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Categories */}
                        {expandedSkills[skill.id] && (
                            <div className="px-4 pb-4 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-300">
                                {categories.filter(c => c.skillId === skill.id).map(category => (
                                    <div key={category.id} className="ml-4 border-l-2 border-slate-800 pl-4 space-y-2">
                                        <div
                                            className="flex items-center justify-between py-2 group cursor-pointer"
                                            onClick={() => toggleCategory(category.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {expandedCategories[category.id] ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                                                <span className="text-sm font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors uppercase tracking-wider">{category.name}</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAddSubtopic(category.id); }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-cyan-400 transition-all"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Subtopics */}
                                        {expandedCategories[category.id] && (
                                            <div className="space-y-2 ml-4 animate-in slide-in-from-left-2 duration-200">
                                                {subtopics.filter(s => s.categoryId === category.id).map(subtopic => (
                                                    <div
                                                        key={subtopic.id}
                                                        className="bg-slate-800/30 border border-slate-700/50 p-3 rounded-xl hover:border-cyan-500/30 transition-all cursor-pointer group"
                                                        onClick={() => onSelectSubtopic(subtopic)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full ${subtopic.status === 'Completed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : subtopic.status === 'In Progress' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-600'}`} />
                                                                <span className="text-sm font-medium text-slate-200">{subtopic.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getStatusColor(subtopic.status)} font-bold uppercase`}>
                                                                    {subtopic.status}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onAddTask(subtopic.id); }}
                                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-cyan-400 transition-all"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Tasks Mini View */}
                                                        <div className="mt-3 space-y-1.5">
                                                            {tasks.filter(t => t.subtopicId === subtopic.id).map(task => (
                                                                <div
                                                                    key={task.id}
                                                                    className="flex items-center gap-2 group/task"
                                                                    onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                                                                >
                                                                    <div className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center ${task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 group-hover/task:border-cyan-500/50'}`}>
                                                                        {task.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                                    </div>
                                                                    <span className={`text-xs ${task.completed ? 'text-slate-500 line-through' : 'text-slate-400'}`}>{task.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {categories.filter(c => c.skillId === skill.id).length === 0 && (
                                    <div className="text-center py-4 border-2 border-dashed border-slate-800 rounded-xl">
                                        <p className="text-xs text-slate-600">No categories added yet</p>
                                        <button
                                            onClick={() => onAddCategory(skill.id)}
                                            className="mt-2 text-xs text-cyan-500 font-bold hover:underline"
                                        >
                                            + Add your first category
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {skills.length === 0 && (
                <div className="text-center py-12 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600 border border-slate-700">
                        <Target size={32} />
                    </div>
                    <h4 className="text-slate-300 font-bold">No Skills Tracked</h4>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Start by adding a skill you want to master and build your learning roadmap.</p>
                    <button
                        onClick={onAddSkill}
                        className="mt-6 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                    >
                        Add New Skill
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkillTree;
