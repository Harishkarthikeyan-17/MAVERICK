import React, { useState, useMemo, useEffect } from 'react';
import { Target, Zap, Cloud, Sun, CloudRain, Keyboard, Plus, Sparkles, CheckCircle2, X, Headphones, Brain } from 'lucide-react';
import { EnergyLevel, TaskLocation, PlannerTask, TaskPriority, TaskCategory } from '../../core/types';

import { useTasks } from './hooks/useTasks';
import { useRecurringTasks } from './hooks/useRecurringTasks';
import { useIntelligentPlanner } from './hooks/useIntelligentPlanner';

import PlannerNavTabs, { PlannerTab } from './components/PlannerNavTabs';
import PlannerDashboard from './components/PlannerDashboard';
import TodayTimeline from './components/TodayTimeline';
import TaskManager from './components/TaskManager';
import FocusTracker from './components/FocusTracker';
import ConsistencyAnalytics from './components/ConsistencyAnalytics';
import RecurringTaskModal from './components/RecurringTaskModal';

const PlannerPage: React.FC = () => {
    // Top-Level State
    const [activeTab, setActiveTab] = useState<PlannerTab>('overview');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);

    // Gamification & Session State
    const [xp, setXp] = useState(1250);
    const [level, setLevel] = useState(3);
    const [mood, setMood] = useState<'Great' | 'Good' | 'Neutral' | 'Bad' | 'Awful'>('Good');
    const [focusSessions, setFocusSessions] = useState(3);
    const [distractionCount, setDistractionCount] = useState(2);
    const [lastCompletedTaskTitle, setLastCompletedTaskTitle] = useState('');
    const [showXpCelebration, setShowXpCelebration] = useState(false);

    // Form inputs for new daily tasks
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('Work');
    const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
    const [newTaskStart, setNewTaskStart] = useState('09:00');
    const [newTaskEnd, setNewTaskEnd] = useState('10:00');
    const [newTaskLocation, setNewTaskLocation] = useState<TaskLocation>('Office');
    const [newTaskNotes, setNewTaskNotes] = useState('');
    const [newTaskSubtasks, setNewTaskSubtasks] = useState<string[]>([]);
    const [tempSubtask, setTempSubtask] = useState('');

    // Hooks
    const taskManager = useTasks([
        {
            id: '1',
            title: 'Analyze Q3 productivity metrics',
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '10:30',
            duration: 90,
            priority: 'High',
            category: 'Work',
            completed: false,
            subtasks: ['Fetch data from database', 'Generate Recharts layout', 'Export PDF report'],
            notes: 'AI generated draft. Crucial task.'
        },
        {
            id: '2',
            title: 'Deep Focus Coding: Dashboard overhaul',
            date: new Date().toISOString().split('T')[0],
            startTime: '11:00',
            endTime: '13:00',
            duration: 120,
            priority: 'High',
            category: 'Study',
            completed: false,
            subtasks: ['Write glassmorphic CSS classes', 'Connect Recharts interactive hooks'],
            notes: 'Pomodoro mode recommended.'
        },
        {
            id: '3',
            title: 'Cardio interval run',
            date: new Date().toISOString().split('T')[0],
            startTime: '17:30',
            endTime: '18:15',
            duration: 45,
            priority: 'Medium',
            category: 'Health',
            completed: true,
            notes: 'Active recovery day.'
        }
    ]);
    
    const recurringManager = useRecurringTasks();

    // Load initial recurring tasks
    useEffect(() => {
        if (recurringManager.recurringTasks.length === 0) {
            recurringManager.addRecurringTask({
                title: 'Morning Mindfulness & Meditation',
                startTime: '07:30',
                endTime: '08:00',
                duration: 30,
                priority: 'High',
                category: 'Health',
                pattern: 'daily',
                startDate: new Date().toISOString().split('T')[0]
            });
            recurringManager.addRecurringTask({
                title: 'Coding practice & Algorithm study',
                startTime: '20:00',
                endTime: '21:00',
                duration: 60,
                priority: 'Medium',
                category: 'Study',
                pattern: 'weekly',
                startDate: new Date().toISOString().split('T')[0],
                daysOfWeek: [1, 2, 3, 4, 5]
            });
            recurringManager.addRecurringTask({
                title: 'Review weekly budget spreadsheet',
                startTime: '10:00',
                endTime: '11:00',
                duration: 60,
                priority: 'Low',
                category: 'Finance',
                pattern: 'weekly',
                startDate: new Date().toISOString().split('T')[0],
                daysOfWeek: [6]
            });
        }
    }, [recurringManager]);

    // Data Aggregation
    const allTasks = useMemo(() => {
        const regularTasks = taskManager.tasks;
        const recurringTasks = recurringManager.getTasksForDate(selectedDate);
        return [...regularTasks, ...recurringTasks];
    }, [taskManager.tasks, selectedDate, recurringManager]);

    const dayTasks = useMemo(() => {
        return allTasks.filter(task => task.date === selectedDate);
    }, [allTasks, selectedDate]);

    const upcomingTask = useMemo(() => {
        return dayTasks.filter(t => !t.completed && t.priority === 'High').sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
    }, [dayTasks]);

    const completedTasksCount = dayTasks.filter(t => t.completed).length;
    const completionPercentage = dayTasks.length > 0 ? Math.round((completedTasksCount / dayTasks.length) * 100) : 0;
    const productivityScore = Math.min(100, Math.round((completionPercentage * 0.7) + (dayTasks.length > 0 ? 30 : 0)));

    // Intelligent Planner Hook
    const {
        focusIntent,
        setFocusIntent,
        energyLevel,
        setEnergyLevel,
        weather,
        userLocation,
        setUserLocation,
        suggestions,
        getRecoverySuggestion,
        textConflicts,
        highImpactTasks,
        routineHealth,
        burnoutRisk
    } = useIntelligentPlanner(dayTasks, selectedDate);

    // Keyboard Shortcuts Event Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // If focus is inside input/textarea fields, ignore shortcuts
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'd':
                    setActiveTab('overview');
                    break;
                case 't':
                    setActiveTab('timeline');
                    break;
                case 'm':
                    setActiveTab('tasks');
                    break;
                case 'f':
                    setActiveTab('focus');
                    break;
                case 'a':
                    setActiveTab('analytics');
                    break;
                case 'n':
                    setShowTaskModal(true);
                    break;
                case '?':
                    setShowShortcutsModal(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Custom Task Completion Handler with XP Reward
    const handleToggleComplete = (id: string) => {
        const targetTask = allTasks.find(t => t.id === id);
        if (targetTask && !targetTask.completed) {
            // Gain XP on completion!
            const earnedXp = targetTask.priority === 'High' ? 100 : targetTask.priority === 'Medium' ? 50 : 25;
            setLastCompletedTaskTitle(targetTask.title);
            setShowXpCelebration(true);
            setTimeout(() => setShowXpCelebration(false), 3000);

            setXp(prev => {
                const nextXp = prev + earnedXp;
                const reqXp = level * 600;
                if (nextXp >= reqXp) {
                    setLevel(l => l + 1);
                    return nextXp - reqXp;
                }
                return nextXp;
            });
        }
        taskManager.toggleComplete(id);
    };

    // Subtask lists for quick add task modal
    const handleAddSubtask = () => {
        if (tempSubtask.trim()) {
            setNewTaskSubtasks(prev => [...prev, tempSubtask.trim()]);
            setTempSubtask('');
        }
    };

    const handleRemoveSubtask = (index: number) => {
        setNewTaskSubtasks(prev => prev.filter((_, i) => i !== index));
    };

    // Quick Task Submission
    const handleCreateQuickTask = () => {
        if (!newTaskTitle.trim()) return;
        taskManager.addTask({
            title: newTaskTitle.trim(),
            date: selectedDate,
            startTime: newTaskStart,
            endTime: newTaskEnd,
            priority: newTaskPriority,
            category: newTaskCategory,
            completed: false,
            location: newTaskLocation,
            notes: newTaskNotes.trim() || undefined,
            subtasks: newTaskSubtasks.length > 0 ? newTaskSubtasks : undefined
        });

        // Clear state
        setNewTaskTitle('');
        setNewTaskNotes('');
        setNewTaskSubtasks([]);
        setShowTaskModal(false);

        // Quick XP for planning!
        setXp(prev => {
            const nextXp = prev + 15;
            const reqXp = level * 600;
            if (nextXp >= reqXp) {
                setLevel(l => l + 1);
                return nextXp - reqXp;
            }
            return nextXp;
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            
            {/* Gamification Floating XP Banner (Bottom Right Corner Notification) */}
            {showXpCelebration && (
                <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-0.5 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-bounce">
                    <div className="bg-slate-950 px-5 py-3 rounded-2xl flex items-center gap-3">
                        <Sparkles size={20} className="text-yellow-400 animate-spin" />
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Task Completed!</div>
                            <div className="text-sm font-black text-white truncate max-w-[200px]">{lastCompletedTaskTitle}</div>
                            <div className="text-xs font-bold text-emerald-400 mt-0.5">+50 XP Awarded</div>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Header with Intelligent Extensions */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-slate-800/40 pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Planner
                        </h1>
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest font-black flex items-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.35)] animate-pulse">
                            <Brain size={12} className="animate-spin duration-[4000ms]" /> AI Systems Active
                        </span>
                    </div>
                    <p className="text-slate-400 mt-2 font-medium">Your immersive cyberpunk productivity operating system.</p>
                </div>

                {/* Focus Intent, Energy, & Location Context Bar */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 backdrop-blur-xl p-2 rounded-2xl border border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                    
                    {/* Weather Visualizer */}
                    <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-800/80 bg-slate-950/40 rounded-lg">
                        {weather === 'Sunny' ? <Sun size={16} className="text-yellow-500 animate-spin duration-[15000ms]" /> :
                            weather === 'Rainy' ? <CloudRain size={16} className="text-blue-400" /> :
                                <Cloud size={16} className="text-slate-400" />}
                        <span className="text-xs font-extrabold text-slate-300">{weather}</span>
                    </div>

                    {/* Today's Priority Focus Intent */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/20 rounded-lg border border-slate-800/50">
                        <Target size={16} className="text-cyan-500" />
                        <input
                            type="text"
                            placeholder="What's your focus intent today?"
                            value={focusIntent}
                            onChange={(e) => setFocusIntent(e.target.value)}
                            className="bg-transparent border-none text-xs text-slate-200 placeholder:text-slate-600 focus:ring-0 w-36 md:w-56 font-bold"
                        />
                    </div>

                    {/* Mood & Energy Selectors */}
                    <div className="flex items-center gap-2 pl-3 border-l border-slate-800/80">
                        <Zap size={16} className={
                            energyLevel === 'High' ? 'text-emerald-500' :
                                energyLevel === 'Medium' ? 'text-amber-500' :
                                    'text-red-500'
                        } />
                        <select
                            value={energyLevel}
                            onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                            className="bg-transparent border-none text-xs font-black text-slate-300 focus:ring-0 cursor-pointer p-0"
                        >
                            <option value="High" className="bg-slate-950 text-emerald-400">High Focus</option>
                            <option value="Medium" className="bg-slate-950 text-amber-400">Medium Flow</option>
                            <option value="Low" className="bg-slate-950 text-orange-400">Low Focus</option>
                            <option value="Very Low" className="bg-slate-950 text-red-500">Recharge Mode</option>
                        </select>
                    </div>

                    {/* Location Selectors */}
                    <div className="flex items-center gap-2 pl-3 border-l border-slate-800/80 pr-2">
                        <span className="text-xs text-slate-500 font-bold">Context:</span>
                        <select
                            value={userLocation}
                            onChange={(e) => setUserLocation(e.target.value as TaskLocation)}
                            className="bg-transparent border-none text-xs font-black text-slate-300 focus:ring-0 cursor-pointer p-0"
                        >
                            <option value="Office" className="bg-slate-950 text-slate-300">Office Suite</option>
                            <option value="Home" className="bg-slate-950 text-slate-300">Home Base</option>
                            <option value="Field" className="bg-slate-950 text-slate-300">On Site</option>
                            <option value="Travel" className="bg-slate-950 text-slate-300">In Transit</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Smart Navigation & Date Picker */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PlannerNavTabs activeTab={activeTab} onChange={setActiveTab} />
                
                {/* Keyboard and Date Selection Controls */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                    <button 
                        onClick={() => setShowShortcutsModal(true)}
                        className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-xl border border-slate-850 transition-colors shadow-lg"
                        title="Keyboard Shortcuts Guide"
                    >
                        <Keyboard size={18} />
                    </button>
                    
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-slate-900 border border-slate-850 text-slate-300 font-bold text-sm px-4 py-2.5 rounded-xl focus:ring-cyan-500 focus:border-cyan-500 shadow-lg cursor-pointer"
                    />
                </div>
            </div>

            {/* Dynamic Content Panel */}
            <div className="min-h-[600px] mt-6">
                {activeTab === 'overview' && (
                    <PlannerDashboard 
                        productivityScore={productivityScore}
                        completionPercentage={completionPercentage}
                        streak={14}
                        focusSession={focusSessions > 0 ? `Active: Deep Coding (${focusSessions} today)` : 'No Session Started'}
                        upcomingTask={upcomingTask}
                        insights={suggestions}
                        xp={xp}
                        level={level}
                        mood={mood}
                        setMood={setMood}
                        onQuickPlan={(suggestedTasks) => {
                            // Automatically populate NLP-generated suggestions into our daily agenda!
                            suggestedTasks.forEach(st => {
                                taskManager.addTask({
                                    ...st,
                                    date: selectedDate,
                                    completed: false
                                });
                            });
                        }}
                    />
                )}

                {activeTab === 'timeline' && (
                    <TodayTimeline 
                        tasks={dayTasks}
                        onToggleComplete={handleToggleComplete}
                        conflicts={textConflicts}
                        onAddTask={() => setShowTaskModal(true)}
                        onAutoReschedule={() => {
                            // Emulate dynamic scheduling by shifting overlapping item times by 1 hour
                            if (dayTasks.length > 1) {
                                const highItem = dayTasks.find(t => t.priority === 'High');
                                const otherItem = dayTasks.find(t => t.id !== highItem?.id && !t.completed);
                                if (otherItem) {
                                    const [h, m] = otherItem.startTime.split(':').map(Number);
                                    const nextH = String((h + 1) % 24).padStart(2, '0');
                                    const nextEndH = String((h + 2) % 24).padStart(2, '0');
                                    taskManager.editTask(otherItem.id, {
                                        startTime: `${nextH}:00`,
                                        endTime: `${nextEndH}:00`
                                    });
                                }
                            }
                        }}
                    />
                )}

                {activeTab === 'tasks' && (
                    <TaskManager 
                        dailyTasks={dayTasks}
                        recurringTasks={recurringManager.recurringTasks}
                        onAddTask={() => setShowTaskModal(true)}
                        onAddRecurring={() => setShowRecurringModal(true)}
                        onToggleComplete={handleToggleComplete}
                        onDeleteTask={taskManager.deleteTask}
                        onDeleteRecurring={recurringManager.deleteRecurringTask}
                        onSnoozeTask={(id) => {
                            // Emulate swipe snooze by moving start time back by 2 hours
                            const t = dayTasks.find(x => x.id === id);
                            if (t) {
                                const h = parseInt(t.startTime.split(':')[0]) + 2;
                                const eh = parseInt(t.endTime.split(':')[0]) + 2;
                                taskManager.editTask(id, {
                                    startTime: `${String(h % 24).padStart(2, '0')}:00`,
                                    endTime: `${String(eh % 24).padStart(2, '0')}:00`
                                });
                            }
                        }}
                    />
                )}

                {activeTab === 'focus' && (
                    <FocusTracker 
                        focusSessions={focusSessions}
                        setFocusSessions={setFocusSessions}
                        distractionCount={distractionCount}
                        setDistractionCount={setDistractionCount}
                        onAwardXp={(xpReward) => {
                            setXp(prev => {
                                const nextXp = prev + xpReward;
                                const reqXp = level * 600;
                                if (nextXp >= reqXp) {
                                    setLevel(l => l + 1);
                                    return nextXp - reqXp;
                                }
                                return nextXp;
                            });
                        }}
                    />
                )}

                {activeTab === 'analytics' && (
                    <ConsistencyAnalytics 
                        xp={xp}
                        level={level}
                        streak={14}
                        focusSessions={focusSessions}
                    />
                )}
            </div>

            {/* Floating Cyber Quick-Add Action Button */}
            <button 
                onClick={() => setShowTaskModal(true)}
                className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40 w-14 h-14 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer group"
            >
                <Plus size={26} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Modal: Quick Add Daily Task */}
            {showTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-[0_0_35px_rgba(0,0,0,0.5)] overflow-hidden">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-850">
                            <h3 className="text-xl font-black text-slate-100 flex items-center gap-2">
                                <Sparkles className="text-cyan-400" size={20} /> Create Daily Blueprint
                            </h3>
                            <button onClick={() => setShowTaskModal(false)} className="text-slate-500 hover:text-slate-300">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            
                            {/* Input Title */}
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Blueprint Title</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter task objective..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 focus:ring-cyan-500 focus:border-cyan-500 font-semibold"
                                    required
                                />
                            </div>

                            {/* Category & Priority Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Domain Category</label>
                                    <select
                                        value={newTaskCategory}
                                        onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                                        className="w-full bg-slate-950 border border-slate-800 text-slate-350 text-sm rounded-xl p-3 focus:ring-cyan-500 focus:border-cyan-500"
                                    >
                                        <option value="Work">💼 Work Suite</option>
                                        <option value="Study">📚 Study / Research</option>
                                        <option value="Health">🧘 Health & Vitals</option>
                                        <option value="Personal">🏡 Personal Routines</option>
                                        <option value="Finance">💳 Financial Audits</option>
                                        <option value="Other">⚙️ Utility Tasks</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Core Priority</label>
                                    <select
                                        value={newTaskPriority}
                                        onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                                        className="w-full bg-slate-950 border border-slate-800 text-slate-350 text-sm rounded-xl p-3 focus:ring-cyan-500 focus:border-cyan-500 font-bold"
                                    >
                                        <option value="High" className="text-red-400">🚨 High Impact</option>
                                        <option value="Medium" className="text-amber-400">⚡ Medium Priority</option>
                                        <option value="Low" className="text-emerald-400">🌱 Low Priority</option>
                                    </select>
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Time Slot: Start</label>
                                    <input 
                                        type="time" 
                                        value={newTaskStart}
                                        onChange={(e) => setNewTaskStart(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Time Slot: End</label>
                                    <input 
                                        type="time" 
                                        value={newTaskEnd}
                                        onChange={(e) => setNewTaskEnd(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Subtask Checklists Creation */}
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Blueprint Checklist</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Add a step..."
                                        value={tempSubtask}
                                        onChange={(e) => setTempSubtask(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                                        className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 focus:ring-cyan-500 focus:border-cyan-500"
                                    />
                                    <button 
                                        onClick={handleAddSubtask}
                                        className="px-4 py-2 bg-slate-800 text-cyan-400 rounded-xl hover:bg-slate-700 font-bold transition-all border border-slate-750"
                                    >
                                        Add
                                    </button>
                                </div>

                                {newTaskSubtasks.length > 0 && (
                                    <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-850 space-y-2">
                                        {newTaskSubtasks.map((st, i) => (
                                            <div key={i} className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-350">
                                                <span className="font-semibold flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-500" /> {st}</span>
                                                <button onClick={() => handleRemoveSubtask(i)} className="text-slate-500 hover:text-red-400">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Blueprint Notes</label>
                                <textarea 
                                    placeholder="Add any technical context or reference details..."
                                    value={newTaskNotes}
                                    onChange={(e) => setNewTaskNotes(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 focus:ring-cyan-500 focus:border-cyan-500 min-h-[80px]"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-slate-850 bg-slate-900/60">
                            <button 
                                onClick={() => setShowTaskModal(false)}
                                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-all border border-slate-850 text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateQuickTask}
                                disabled={!newTaskTitle.trim()}
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-black text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                            >
                                Compile Blueprint
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Keyboard Shortcut Cheatsheet */}
            {showShortcutsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-850">
                            <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                                <Keyboard className="text-cyan-400" size={20} /> Keyboard Shortcut Blueprint
                            </h3>
                            <button onClick={() => setShowShortcutsModal(false)} className="text-slate-500 hover:text-slate-300">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { keys: ['D'], desc: 'Jump to Dashboard view' },
                                { keys: ['T'], desc: 'Jump to Hour Timeline planner' },
                                { keys: ['M'], desc: 'Jump to Habits & Tasks manager' },
                                { keys: ['F'], desc: 'Jump to Focus Pomodoro Hub' },
                                { keys: ['A'], desc: 'Jump to Productivity Analytics' },
                                { keys: ['N'], desc: 'Deploy Quick Daily Task Modal' },
                                { keys: ['?'], desc: 'Toggle keyboard shortcut panel' }
                            ].map((shortcut, i) => (
                                <div key={i} className="flex justify-between items-center py-1">
                                    <span className="text-sm font-semibold text-slate-400">{shortcut.desc}</span>
                                    <div className="flex gap-1">
                                        {shortcut.keys.map((k, idx) => (
                                            <kbd key={idx} className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-black text-cyan-400 font-mono shadow-[0_0_8px_rgba(6,182,212,0.15)]">{k}</kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-slate-850 text-center bg-slate-900/60">
                            <button 
                                onClick={() => setShowShortcutsModal(false)}
                                className="px-6 py-2 bg-slate-950 text-slate-400 rounded-xl hover:bg-slate-850 border border-slate-850 text-xs font-bold transition-all"
                            >
                                Dismiss Portal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Recurring Task */}
            <RecurringTaskModal
                isOpen={showRecurringModal}
                onClose={() => setShowRecurringModal(false)}
                onSave={(task) => {
                    recurringManager.addRecurringTask(task);
                    setShowRecurringModal(false);
                    // Reward XP
                    setXp(prev => {
                        const nextXp = prev + 50;
                        const reqXp = level * 600;
                        if (nextXp >= reqXp) {
                            setLevel(l => l + 1);
                            return nextXp - reqXp;
                        }
                        return nextXp;
                    });
                }}
            />
        </div>
    );
};

export default PlannerPage;

