import React, { useState, useMemo } from 'react';
import { Plus, Repeat, ListTodo, CalendarClock, Trash2, Clock, MapPin, Play, Mic, Headphones, Volume2, Sparkles, CheckCircle2, Circle, ChevronDown, ChevronUp, AlertCircle, Eye, EyeOff, Archive, Pause, PlayCircle } from 'lucide-react';
import { PlannerTask, RecurringTask, TaskCategory, TaskPriority } from '../../../core/types';

interface TaskManagerProps {
    dailyTasks: PlannerTask[];
    recurringTasks: RecurringTask[];
    onAddTask: () => void;
    onAddRecurring: () => void;
    onToggleComplete: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onDeleteRecurring: (id: string) => void;
    onSnoozeTask: (id: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
    dailyTasks,
    recurringTasks,
    onAddTask,
    onAddRecurring,
    onToggleComplete,
    onDeleteTask,
    onDeleteRecurring,
    onSnoozeTask
}) => {
    const [viewMode, setViewMode] = useState<'daily' | 'recurring'>('daily');
    const [voiceActive, setVoiceActive] = useState(false);
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [voiceMessage, setVoiceMessage] = useState('Standby for voice telemetry...');

    // Habit skip/pause states
    const [pausedHabits, setPausedHabits] = useState<Record<string, boolean>>({});
    const [archivedHabits, setArchivedHabits] = useState<Record<string, boolean>>({});

    // Voice Simulation Action
    const handleVoiceTrigger = () => {
        if (voiceActive) {
            setVoiceActive(false);
            setVoiceMessage('Telemetry standdown.');
        } else {
            setVoiceActive(true);
            setVoiceMessage('Listening for neural scheduling prompts...');
            setTimeout(() => {
                setVoiceMessage('Parsing: "Plan a gym session tomorrow at 6PM"');
                setTimeout(() => {
                    setVoiceMessage('Successfully added "Gym session" (6:00 PM - 7:00 PM) to blueprint!');
                    setVoiceActive(false);
                    onToggleComplete(dailyTasks[0]?.id); // Simulate a check for fun
                }, 1500);
            }, 2000);
        }
    };

    // Category Color map
    const categoryColors: Record<TaskCategory, string> = {
        Work: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        Study: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        Health: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        Personal: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        Finance: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        Other: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    };

    // GitHub Heatmap Generation Math (7 days x 15 weeks)
    const heatmapGrid = useMemo(() => {
        const grid = [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        for (let d = 0; d < 7; d++) {
            const row = [];
            for (let w = 0; w < 15; w++) {
                // Generate a pseudo-random intensity (0 to 3) representing completion levels
                const seed = (d * 3 + w * 7) % 11;
                let intensity = 0;
                if (seed > 8) intensity = 3; // deep green
                else if (seed > 5) intensity = 2; // medium green
                else if (seed > 2) intensity = 1; // light green
                row.push(intensity);
            }
            grid.push({ day: days[d], values: row });
        }
        return grid;
    }, []);

    const renderDailyTask = (task: PlannerTask) => {
        const isExpanded = expandedTaskId === task.id;
        const subtasksTotal = task.subtasks?.length || 0;
        const subtasksCompleted = 0; // Simple simulation

        return (
            <div 
                key={task.id} 
                className={`group flex flex-col p-4 bg-slate-900/60 backdrop-blur-md border rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    task.completed 
                        ? 'border-slate-950 bg-slate-950/20 opacity-55' 
                        : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                }`}
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <button
                            onClick={() => onToggleComplete(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                task.completed 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-slate-655 hover:border-cyan-400'
                            }`}
                        >
                            {task.completed && <CheckCircle2 size={14} />}
                        </button>
                        
                        <div className="min-w-0">
                            <h4 className={`text-sm font-black tracking-wide truncate pr-6 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                {task.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-[10px] text-slate-500 font-black uppercase tracking-wider">
                                <span className="text-cyan-400 font-mono">{task.startTime} - {task.endTime}</span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-sm ${
                                    task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 
                                    'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                    {task.priority}
                                </span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-sm border ${categoryColors[task.category]}`}>
                                    {task.category}
                                </span>
                                {task.location && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 normal-case text-slate-400">
                                            <MapPin size={10} className="text-indigo-400" /> {task.location}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Swipe Actions panel */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Subtask toggler */}
                        {subtasksTotal > 0 && (
                            <button
                                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                                className="p-2 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-850 cursor-pointer"
                                title="Blueprint Checklist Drawer"
                            >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                        )}

                        {/* Emulated swipe snooze */}
                        {!task.completed && (
                            <button
                                onClick={() => onSnoozeTask(task.id)}
                                className="p-2 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg border border-slate-850 cursor-pointer hidden sm:block"
                                title="Snooze Blueprint +2h"
                            >
                                <Clock size={14} />
                            </button>
                        )}

                        {/* Delete */}
                        <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-2 bg-slate-950/40 hover:bg-slate-800/60 text-slate-500 hover:text-red-400 rounded-lg border border-slate-850 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Erase Blueprint"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Expanded Drawer Checklist */}
                {isExpanded && task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-850 space-y-3.5 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                            <span>Blueprint Checklist Progress</span>
                            <span className="text-cyan-400">0 / {task.subtasks.length} Completed</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-850/80">
                            {task.subtasks.map((st, i) => (
                                <button 
                                    key={i}
                                    onClick={() => alert("✨ Checked subtask item!")}
                                    className="flex items-center gap-2.5 p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-left text-xs font-semibold text-slate-350 cursor-pointer"
                                >
                                    <Circle size={12} className="text-slate-600 shrink-0" />
                                    <span className="truncate">{st}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderRecurringTask = (task: RecurringTask) => {
        const isPaused = pausedHabits[task.id];
        const isArchived = archivedHabits[task.id];
        
        if (isArchived) return null;

        return (
            <div 
                key={task.id} 
                className={`group flex items-center justify-between p-4 bg-slate-900/60 backdrop-blur-md border rounded-2xl hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-300 ${
                    isPaused 
                        ? 'border-slate-950 opacity-45 bg-slate-950/20' 
                        : 'border-slate-800 hover:border-purple-500/50'
                }`}
            >
                <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${
                        isPaused
                            ? 'bg-slate-950 border-slate-900 text-slate-600'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                        <Repeat size={20} className={!isPaused ? 'animate-spin duration-[10000ms]' : ''} />
                    </div>
                    
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-black tracking-wide truncate ${isPaused && 'line-through text-slate-500'}`}>
                                {task.title}
                            </h4>
                            {isPaused && <span className="text-[8px] font-black uppercase bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-slate-500">PAUSED</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-black uppercase tracking-wider">
                            <span className="text-purple-400 font-extrabold">{task.pattern}</span>
                            <span>•</span>
                            <span className="font-mono">{task.startTime} - {task.endTime}</span>
                            <span>•</span>
                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-slate-400">{task.category}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">Flame streak: 5 🔥</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    
                    {/* Consistency indicator Flame ring */}
                    <div className="text-right hidden md:block border-l border-slate-800/40 pl-4 py-1">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Weekly Consistency</div>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                <div 
                                    key={day} 
                                    className={`w-2 h-4 rounded-sm transition-all ${
                                        isPaused 
                                            ? 'bg-slate-900' 
                                            : Math.random() > 0.25 
                                                ? 'bg-purple-500 shadow-[0_0_6px_rgba(139,92,246,0.3)] hover:scale-110 cursor-pointer' 
                                                : 'bg-slate-800'
                                    }`} 
                                    title={Math.random() > 0.25 ? 'Completed' : 'Missed'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800/40">
                        {/* Pause Toggle */}
                        <button
                            onClick={() => setPausedHabits(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
                            className="p-2 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg border border-slate-850 cursor-pointer"
                            title={isPaused ? 'Resume Habit' : 'Pause Habit'}
                        >
                            {isPaused ? <PlayCircle size={14} /> : <Pause size={14} />}
                        </button>

                        {/* Archive */}
                        <button
                            onClick={() => setArchivedHabits(prev => ({ ...prev, [task.id]: true }))}
                            className="p-2 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg border border-slate-850 cursor-pointer"
                            title="Archive Habit"
                        >
                            <Archive size={14} />
                        </button>

                        {/* Delete Habit */}
                        <button
                            onClick={() => onDeleteRecurring(task.id)}
                            className="p-2 bg-slate-950/40 hover:bg-slate-800/60 text-slate-655 hover:text-red-400 rounded-lg border border-slate-850 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Erase Routine"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* 1. Header Navigation and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 backdrop-blur-md p-3 border border-slate-800/60 rounded-2xl shadow-md">
                <div className="flex bg-slate-950 p-1.5 rounded-xl w-full sm:w-auto border border-slate-850">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            viewMode === 'daily' 
                                ? 'bg-slate-800 border border-slate-700 text-cyan-400 shadow-md scale-102 font-bold' 
                                : 'text-slate-500 hover:text-slate-350'
                        }`}
                    >
                        <ListTodo size={14} />
                        Daily agenda blueprints
                    </button>
                    <button
                        onClick={() => setViewMode('recurring')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            viewMode === 'recurring' 
                                ? 'bg-slate-800 border border-slate-700 text-purple-400 shadow-md scale-102 font-bold' 
                                : 'text-slate-500 hover:text-slate-350'
                        }`}
                    >
                        <CalendarClock size={14} />
                        Recursive habits & routines
                    </button>
                </div>

                <button
                    onClick={viewMode === 'daily' ? onAddTask : onAddRecurring}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white transition-all shadow-md cursor-pointer hover:scale-102
                        ${viewMode === 'daily' ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-cyan-500/20' : 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-500/20'}`}
                >
                    <Plus size={15} />
                    {viewMode === 'daily' ? 'Compile blueprint' : 'Add Habit pattern'}
                </button>
            </div>

            {/* 2. Interactive Heatmap Calendar (Habits View Mode Only) */}
            {viewMode === 'recurring' && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
                    
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-400" /> Habit consistency heatmap calendar
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-semibold">15-week timeline view of operator completion telemetry.</p>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-wider bg-slate-950 px-2.5 py-1.5 border border-slate-850 rounded-lg">
                            <span>Less</span>
                            <div className="w-2.5 h-2.5 bg-slate-950 border border-slate-800 rounded-sm" />
                            <div className="w-2.5 h-2.5 bg-emerald-500/20 rounded-sm" />
                            <div className="w-2.5 h-2.5 bg-emerald-500/50 rounded-sm" />
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                            <span>More</span>
                        </div>
                    </div>

                    {/* GitHub contribution style grid */}
                    <div className="overflow-x-auto custom-scrollbar pb-2">
                        <div className="flex flex-col gap-1 min-w-[500px]">
                            {heatmapGrid.map((row) => (
                                <div key={row.day} className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-black text-slate-500 font-mono w-8 shrink-0 select-none uppercase tracking-wider">{row.day}</span>
                                    <div className="flex gap-1">
                                        {row.values.map((intensity, wIdx) => (
                                            <div
                                                key={wIdx}
                                                className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:scale-115 hover:shadow-[0_0_8px_rgba(16,185,129,0.4)] cursor-pointer ${
                                                    intensity === 3 ? 'bg-emerald-500' :
                                                    intensity === 2 ? 'bg-emerald-500/60' :
                                                    intensity === 1 ? 'bg-emerald-500/20 border border-emerald-500/10' :
                                                    'bg-slate-950 border border-slate-850'
                                                }`}
                                                title={`Week ${wIdx + 1}, ${row.day}: ${
                                                    intensity === 3 ? 'Peak compliance (100%)' :
                                                    intensity === 2 ? 'High consistency (75%)' :
                                                    intensity === 1 ? 'Initiated (25%)' : 'No logs recorded'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Immersive Soundwave Voice Input Bar (Daily View Mode Only) */}
            {viewMode === 'daily' && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] blur-3xl pointer-events-none" />
                    
                    <div className="flex gap-3.5 items-center">
                        <button
                            onClick={handleVoiceTrigger}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center text-white cursor-pointer transition-all shadow-md shrink-0 hover:scale-105 active:scale-95 ${
                                voiceActive
                                    ? 'bg-red-500 border-red-400 shadow-red-500/30 animate-pulse'
                                    : 'bg-cyan-500 border-cyan-400 shadow-cyan-500/20'
                            }`}
                        >
                            <Mic size={20} className={voiceActive ? 'animate-bounce' : ''} />
                        </button>
                        
                        <div>
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                <Sparkles size={13} className="text-cyan-400" /> Neural Speech Planner
                            </h4>
                            <p className="text-xs text-slate-300 mt-1 font-bold leading-normal font-mono">{voiceMessage}</p>
                        </div>
                    </div>

                    {/* Soundwave animation helper */}
                    {voiceActive && (
                        <div className="flex gap-1.5 items-end h-8 border-l border-slate-850 pl-5 pr-2 select-none">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(bar => (
                                <div
                                    key={bar}
                                    className="w-1 bg-gradient-to-t from-cyan-600 to-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                                    style={{
                                        height: `${20 + Math.random() * 80}%`,
                                        animationDuration: `${300 + Math.random() * 700}ms`
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 4. Active List Blueprints Grid */}
            <div className="space-y-3">
                {viewMode === 'daily' ? (
                    dailyTasks.length > 0 ? (
                        dailyTasks.map(renderDailyTask)
                    ) : (
                        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed p-6 shadow-inner flex flex-col items-center justify-center">
                            <ListTodo size={40} className="text-slate-600 mb-4" />
                            <h3 className="text-slate-350 font-black tracking-wide">Daily Blueprint Cleared</h3>
                            <p className="text-xs text-slate-500 mt-1.5 max-w-xs font-semibold leading-relaxed">
                                No scheduling items remain. Take a breath, or write a new blueprint above!
                            </p>
                        </div>
                    )
                ) : (
                    recurringTasks.length > 0 ? (
                        recurringTasks.map(renderRecurringTask)
                    ) : (
                        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed p-6 shadow-inner flex flex-col items-center justify-center">
                            <Repeat size={40} className="text-slate-600 mb-4" />
                            <h3 className="text-slate-350 font-black tracking-wide">No Active Habits Found</h3>
                            <p className="text-xs text-slate-500 mt-1.5 max-w-xs font-semibold leading-relaxed">
                                Build compound micro-discipline by scheduling recurring habit grids.
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default TaskManager;
