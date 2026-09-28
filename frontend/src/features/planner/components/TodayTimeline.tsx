import React, { useState, useMemo } from 'react';
import { Clock, MapPin, AlignLeft, CheckCircle2, AlertTriangle, RefreshCw, ZoomIn, ZoomOut, CheckSquare, Star, ArrowDown } from 'lucide-react';
import { PlannerTask } from '../../../core/types';

interface TodayTimelineProps {
    tasks: PlannerTask[];
    onToggleComplete: (taskId: string) => void;
    conflicts: string[];
    onAddTask: () => void;
    onAutoReschedule: () => void;
}

const TodayTimeline: React.FC<TodayTimelineProps> = ({
    tasks,
    onToggleComplete,
    conflicts,
    onAddTask,
    onAutoReschedule,
}) => {
    // Mode toggles
    const [compactMode, setCompactMode] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('ALL');

    // Get current time decimal for live line (e.g. 15.5 for 15:30)
    const currentHourDecimal = useMemo(() => {
        const now = new Date();
        return now.getHours() + now.getMinutes() / 60;
    }, []);

    // Format current time display
    const currentTimeDisplay = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, []);

    // Filter and group tasks
    const groupedTasks = useMemo(() => {
        const groups = {
            Morning: [] as PlannerTask[],
            Afternoon: [] as PlannerTask[],
            Evening: [] as PlannerTask[],
            Night: [] as PlannerTask[],
        };

        const filtered = filterCategory === 'ALL' 
            ? tasks 
            : tasks.filter(t => t.category === filterCategory);

        filtered.sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach(task => {
            const hour = parseInt(task.startTime.split(':')[0], 10);
            if (hour >= 5 && hour < 12) groups.Morning.push(task);
            else if (hour >= 12 && hour < 17) groups.Afternoon.push(task);
            else if (hour >= 17 && hour < 21) groups.Evening.push(task);
            else groups.Night.push(task);
        });

        return groups;
    }, [tasks, filterCategory]);

    const categories = ['ALL', 'Work', 'Study', 'Health', 'Personal', 'Finance'];

    const renderTaskCard = (task: PlannerTask, index: number) => {
        const isPast = parseFloat(task.endTime.split(':')[0]) < currentHourDecimal;
        const isActive = parseFloat(task.startTime.split(':')[0]) <= currentHourDecimal && parseFloat(task.endTime.split(':')[0]) >= currentHourDecimal;

        // Count completed subtasks
        const subtasksTotal = task.subtasks?.length || 0;
        const subtasksCompleted = 0; // Simulated count

        if (compactMode) {
            return (
                <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                        task.completed 
                            ? 'bg-slate-950/20 border-slate-900/50 opacity-50' 
                            : isActive
                                ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                                : 'bg-slate-900/60 border-slate-850 hover:border-slate-700'
                    }`}
                >
                    <div className="flex items-center gap-3 truncate">
                        <button 
                            onClick={() => onToggleComplete(task.id)}
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-655 hover:border-cyan-400'
                            }`}
                        >
                            {task.completed && <CheckCircle2 size={12} />}
                        </button>
                        
                        <span className={`text-xs font-black text-slate-500 font-mono w-20 shrink-0 ${isActive && 'text-cyan-400'}`}>
                            {task.startTime} - {task.endTime}
                        </span>
                        
                        <h4 className={`text-sm font-bold truncate ${task.completed ? 'line-through text-slate-550' : 'text-slate-200'}`}>
                            {task.title}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-sm ${
                            task.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-slate-950 text-slate-500'
                        }`}>
                            {task.priority}
                        </span>
                    </div>
                </div>
            );
        }

        // Expanded view layout
        return (
            <div 
                key={task.id} 
                className={`flex gap-4 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    task.completed 
                        ? 'bg-slate-950/20 border-slate-900 opacity-50' 
                        : isActive
                            ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.01]'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:-translate-y-0.5'
                }`}
            >
                {/* Active pulsating dot for current task */}
                {isActive && !task.completed && (
                    <span className="absolute top-4 right-4 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                )}

                {/* Completion Checkmark */}
                <button 
                    onClick={() => onToggleComplete(task.id)}
                    className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        task.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-600 hover:border-cyan-400 hover:scale-105'
                    }`}
                >
                    {task.completed && <CheckCircle2 size={16} />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-base font-black tracking-wide truncate pr-4 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 shrink-0 bg-slate-950/50 border border-slate-850 px-2.5 py-1 rounded-lg">
                            <Clock size={12} className="text-cyan-400" />
                            <span className="text-xs font-black text-cyan-400 font-mono">
                                {task.startTime} - {task.endTime}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                        <span className={`px-2 py-0.5 rounded ${
                            task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                            task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                            {task.priority}
                        </span>
                        
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-slate-400">
                            {task.category}
                        </span>
                        
                        {task.location && (
                            <span className="flex items-center gap-1.5 text-slate-400 normal-case font-bold">
                                <MapPin size={12} className="text-indigo-400" /> {task.location}
                            </span>
                        )}

                        {subtasksTotal > 0 && (
                            <span className="flex items-center gap-1 text-slate-400 font-bold normal-case">
                                <CheckSquare size={12} className="text-cyan-400" /> {subtasksCompleted}/{subtasksTotal} Subtasks
                            </span>
                        )}
                    </div>

                    {/* Subtask list display preview */}
                    {task.subtasks && task.subtasks.length > 0 && !task.completed && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-950/30 p-3 rounded-xl border border-slate-850">
                            {task.subtasks.map((st, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                                    <span className="truncate">{st}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {task.notes && (
                        <div className="mt-3 text-xs text-slate-400 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-850/80">
                            <AlignLeft size={13} className="mt-0.5 shrink-0 opacity-40" />
                            <p className="line-clamp-2 leading-relaxed font-semibold">{task.notes}</p>
                        </div>
                    )}
                </div>

                {/* Left glowing colored border based on priority */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                    task.priority === 'Medium' ? 'bg-amber-500' : 
                    'bg-emerald-500'
                }`} />
            </div>
        );
    };

    const timeBlocks: { label: string; key: keyof typeof groupedTasks; icon: React.ReactNode; color: string; glow: string }[] = [
        { label: 'Morning Period', key: 'Morning', icon: <span className="text-lg">🌅</span>, color: 'text-yellow-400', glow: 'from-yellow-500/20' },
        { label: 'Afternoon Period', key: 'Afternoon', icon: <span className="text-lg">☀️</span>, color: 'text-orange-400', glow: 'from-orange-500/20' },
        { label: 'Evening Period', key: 'Evening', icon: <span className="text-lg">🌇</span>, color: 'text-purple-400', glow: 'from-purple-500/20' },
        { label: 'Night Period', key: 'Night', icon: <span className="text-lg">🌙</span>, color: 'text-indigo-400', glow: 'from-indigo-500/20' },
    ];

    // Check if timeline is empty
    const isTimelineEmpty = tasks.length === 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* 1. Conflict Alert Overlay Panel */}
            {conflicts.length > 0 && (
                <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-slate-900 border border-red-500/20 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg animate-pulse">
                    <div className="flex gap-3.5 items-start">
                        <div className="p-2 bg-red-500/20 text-red-400 rounded-xl">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Cognitive Scheduling Conflicts Detected</h4>
                            <p className="text-xs text-slate-400 mt-1 font-semibold leading-normal">
                                {conflicts[0]} Overlapping objectives could lead to flow disruption.
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onAutoReschedule}
                        className="px-5 py-2.5 bg-slate-950 hover:bg-slate-850 text-red-400 hover:text-red-300 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-red-500/20 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
                    >
                        <RefreshCw size={14} className="animate-spin duration-[6000ms]" /> Auto-Reschedule Conflicts
                    </button>
                </div>
            )}

            {/* 2. Navigation Actions & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 backdrop-blur-md p-3 rounded-2xl border border-slate-800/60 shadow-md">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                                filterCategory === cat
                                    ? 'bg-slate-800 border-slate-700 text-cyan-400 shadow-md scale-102'
                                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-350'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
                        <button
                            onClick={() => setCompactMode(false)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${!compactMode ? 'bg-slate-800 text-cyan-400' : 'text-slate-550'}`}
                            title="Expanded View"
                        >
                            <ZoomIn size={16} />
                        </button>
                        <button
                            onClick={() => setCompactMode(true)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${compactMode ? 'bg-slate-800 text-cyan-400' : 'text-slate-550'}`}
                            title="Compact View"
                        >
                            <ZoomOut size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={onAddTask}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:scale-102 cursor-pointer transition-all"
                    >
                        Schedule Slot
                    </button>
                </div>
            </div>

            {/* 3. Live Current Time Pulsing Marker */}
            {!isTimelineEmpty && (
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-850 w-fit text-xs font-bold text-slate-400 select-none shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                    <span>Current Time: <span className="text-emerald-400 font-mono font-extrabold">{currentTimeDisplay}</span></span>
                </div>
            )}

            {/* 4. Grouped Timeline List */}
            <div className="space-y-6 relative pl-3 sm:pl-6 border-l border-slate-850/80 ml-3">
                
                {/* The running vertical line indicating time height */}
                {!isTimelineEmpty && (
                    <div 
                        className="absolute left-[-1.5px] top-4 w-[2px] bg-gradient-to-b from-cyan-500 via-indigo-500 to-transparent pointer-events-none"
                        style={{ height: '90%' }}
                    />
                )}

                {timeBlocks.map(({ label, key, icon, color, glow }) => {
                    const blockTasks = groupedTasks[key];
                    if (blockTasks.length === 0) return null;

                    return (
                        <div key={key} className="relative space-y-4">
                            
                            {/* Period Header */}
                            <div className="flex items-center gap-3 relative z-10 py-1 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0 shadow-md">
                                    {icon}
                                </div>
                                <h3 className={`text-sm font-black tracking-widest uppercase ${color}`}>
                                    {label}
                                </h3>
                                <div className={`h-px flex-1 bg-gradient-to-r ${glow} to-transparent`} />
                            </div>

                            {/* Task List */}
                            <div className="space-y-3.5 pl-2">
                                {blockTasks.map(renderTaskCard)}
                            </div>
                        </div>
                    );
                })}
                
                {isTimelineEmpty && (
                    <div className="text-center py-24 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 shadow-md">
                        <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
                            <Clock size={28} className="animate-pulse" />
                        </div>
                        <h3 className="text-lg font-black text-slate-350 tracking-wide">Daily Timeline Blank</h3>
                        <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed font-semibold">
                            No blueprint slots scheduled for this date. Run the **AI Chatbot Scheduler** on the dashboard to generate a custom agenda in seconds!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayTimeline;
