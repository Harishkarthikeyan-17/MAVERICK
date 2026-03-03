import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Calendar, ChevronLeft, ChevronRight, LayoutGrid, LayoutList, Sun, Cloud, CloudRain, Zap, Brain, ShieldAlert, CheckCircle, Target, Coffee } from 'lucide-react';
import { PlannerTask, TaskPriority, TaskCategory, DayNote, EnergyLevel, DailyReflection, TaskLocation } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useRecurringTasks } from '../hooks/useRecurringTasks';
import { usePlannerSummary } from '../hooks/usePlannerSummary';
import { useIntelligentPlanner } from '../hooks/useIntelligentPlanner';
import PlannerTaskCard from '../components/PlannerTaskCard';
import PriorityPanel from '../components/PriorityPanel';
import DayNotesPanel from '../components/DayNotesPanel';
import PlannerNotifications from '../components/PlannerNotifications';
import DaySummaryCard from '../components/DaySummaryCard';
import MonthlySummaryCard from '../components/MonthlySummaryCard';
import RecurringTaskModal from '../components/RecurringTaskModal';

const Planner: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [viewMode, setViewMode] = useState<'timeline' | 'priority'>('timeline');
    const [summaryView, setSummaryView] = useState<'day' | 'month'>('day');
    const [dayNotes, setDayNotes] = useState<DayNote[]>([]);
    const [filterCategory, setFilterCategory] = useState<TaskCategory | 'All'>('All');

    // Task form state
    const [taskForm, setTaskForm] = useState({
        title: '',
        startTime: '09:00',
        endTime: '10:00',
        priority: 'Medium' as TaskPriority,
        category: 'Work' as TaskCategory,
        location: 'Office' as TaskLocation,
    });

    // Hooks
    const taskManager = useTasks([]);
    const recurringManager = useRecurringTasks();

    // Combine regular and recurring tasks
    const allTasks = useMemo(() => {
        const regularTasks = taskManager.tasks;
        const recurringTasks = recurringManager.getTasksForDate(selectedDate);
        return [...regularTasks, ...recurringTasks];
    }, [taskManager.tasks, selectedDate, recurringManager]);

    const { dailySummary, monthlySummary } = usePlannerSummary(allTasks, selectedDate);

    // Get tasks for selected date
    const dayTasks = useMemo(() => {
        const tasks = allTasks.filter(task => task.date === selectedDate);
        if (filterCategory === 'All') return tasks;
        return tasks.filter(task => task.category === filterCategory);
    }, [allTasks, selectedDate, filterCategory]);

    // Get tasks by priority
    const highPriorityTasks = dayTasks.filter(t => t.priority === 'High');
    const mediumPriorityTasks = dayTasks.filter(t => t.priority === 'Medium');
    const lowPriorityTasks = dayTasks.filter(t => t.priority === 'Low');

    // Get notifications
    const upcomingTasks = dayTasks.filter(t => !t.completed).slice(0, 5);
    const overdueTasks = taskManager.getOverdueTasks(selectedDate);
    const recurringReminders = recurringManager.getTasksForDate(selectedDate).slice(0, 3);

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
        planBTasks,
        getRecoverySuggestion,
        textConflicts,
        highImpactTasks,
        routineHealth,
        saveReflection,
        getDailyReflection,
        suggestBreakIfNeeded,
        predictiveHint
    } = useIntelligentPlanner(dayTasks, selectedDate);

    // Break Protection: Check if we need to warn user
    const burnoutWarning = suggestBreakIfNeeded ? suggestBreakIfNeeded() : null;

    // Add to suggestions if not already present
    const allSuggestions = useMemo(() => {
        const list = [...suggestions];
        if (burnoutWarning && !list.includes(burnoutWarning)) {
            list.unshift(burnoutWarning);
        }
        return list;
    }, [suggestions, burnoutWarning]);

    const currentReflection = getDailyReflection(selectedDate);
    const [reflectionForm, setReflectionForm] = useState<Partial<DailyReflection>>({
        mood: 'Good',
        gratitude: '',
    });

    const handleSaveReflection = () => {
        if (reflectionForm.gratitude) {
            saveReflection({
                date: selectedDate,
                mood: reflectionForm.mood as any,
                gratitude: reflectionForm.gratitude,
                completed: true
            });
        }
    };

    // Date navigation
    const changeDate = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const goToToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    // Task handlers
    const handleAddTask = () => {
        if (!taskForm.title) return;

        const hasConflict = taskManager.hasTimeConflict({
            ...taskForm,
            date: selectedDate,
            completed: false,
        });

        if (hasConflict) {
            if (!confirm('This task overlaps with an existing task. Add anyway?')) {
                return;
            }
        }

        taskManager.addTask({
            ...taskForm,
            date: selectedDate,
            completed: false,
        });

        setTaskForm({
            title: '',
            startTime: '09:00',
            endTime: '10:00',
            priority: 'Medium',
            category: 'Work',
            location: 'Office',
        });
        setShowTaskModal(false);
    };

    const handleSaveNote = (date: string, content: string) => {
        setDayNotes(prev => {
            const existing = prev.findIndex(note => note.date === date);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { date, content };
                return updated;
            }
            return [...prev, { date, content }];
        });
    };

    // Format date for display
    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Generate week calendar strip
    const getWeekDates = () => {
        const date = new Date(selectedDate);
        const week = [];
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day.toISOString().split('T')[0]);
        }
        return week;
    };

    const weekDates = getWeekDates();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
                            Day Planner
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-widest font-black">
                                Intelligent
                            </span>
                        </h2>
                        <p className="text-slate-400 mt-1">Organize your tasks and maximize productivity</p>
                    </div>

                    {/* Focus Intent & Energy - Intelligent Extension */}
                    <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50">
                        <div className="flex items-center gap-2 px-3 border-r border-slate-800">
                            {weather === 'Sunny' ? <Sun size={16} className="text-yellow-500" /> :
                                weather === 'Rainy' ? <CloudRain size={16} className="text-blue-400" /> :
                                    <Cloud size={16} className="text-slate-400" />}
                            <span className="text-xs font-medium text-slate-400">{weather}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Target size={16} className="text-cyan-500" />
                            <input
                                type="text"
                                placeholder="Today's Focus Intent..."
                                value={focusIntent}
                                onChange={(e) => setFocusIntent(e.target.value)}
                                className="bg-transparent border-none text-sm text-slate-200 placeholder:text-slate-600 focus:ring-0 w-40 md:w-64"
                            />
                        </div>

                        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                            <Zap size={16} className={
                                energyLevel === 'High' ? 'text-green-500' :
                                    energyLevel === 'Medium' ? 'text-yellow-500' :
                                        'text-red-500'
                            } />
                            <select
                                value={energyLevel}
                                onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                                className="bg-transparent border-none text-xs font-medium text-slate-400 focus:ring-0 cursor-pointer p-0"
                            >
                                <option value="High">High Energy</option>
                                <option value="Medium">Medium Energy</option>
                                <option value="Low">Low Energy</option>
                                <option value="Very Low">Recharge Mode</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                            <select
                                value={userLocation}
                                onChange={(e) => setUserLocation(e.target.value as TaskLocation)}
                                className="bg-transparent border-none text-xs font-medium text-slate-400 focus:ring-0 cursor-pointer p-0"
                            >
                                <option value="Office">Office</option>
                                <option value="Home">Home</option>
                                <option value="Field">Field</option>
                                <option value="Travel">Travel</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            {/* Calendar Strip */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-cyan-400" size={20} />
                        <h3 className="text-sm font-bold text-slate-100">{formatDateDisplay(selectedDate)}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => changeDate(-7)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={goToToday}
                            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded-lg transition-all"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => changeDate(7)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weekDates.map(date => {
                        const d = new Date(date);
                        const isSelected = date === selectedDate;
                        const isToday = date === new Date().toISOString().split('T')[0];
                        const tasksCount = allTasks.filter(t => t.date === date).length;

                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`p-3 rounded-xl transition-all ${isSelected
                                    ? 'bg-cyan-500 text-white'
                                    : isToday
                                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                <div className="text-xs font-medium">
                                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className="text-lg font-bold mt-1">{d.getDate()}</div>
                                {tasksCount > 0 && (
                                    <div className="text-[10px] mt-1 opacity-70">{tasksCount} tasks</div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Action Bar */}
            <div className="sticky top-20 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800/50 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowTaskModal(!showTaskModal)}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Task
                    </button>
                    <button
                        onClick={() => setShowRecurringModal(true)}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Recurring Task
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'All')}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500/50"
                    >
                        <option value="All">All Categories</option>
                        <option value="Work">Work</option>
                        <option value="Study">Study</option>
                        <option value="Health">Health</option>
                        <option value="Personal">Personal</option>
                        <option value="Finance">Finance</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`p-2 rounded transition-all ${viewMode === 'timeline'
                                ? 'bg-cyan-500 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <LayoutList size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('priority')}
                            className={`p-2 rounded transition-all ${viewMode === 'priority'
                                ? 'bg-cyan-500 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Add Task Form */}
            {showTaskModal && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-slate-100 mb-4">Add New Task</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input
                            type="text"
                            placeholder="Task title"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            className="md:col-span-2 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50"
                        />
                        <input
                            type="time"
                            value={taskForm.startTime}
                            onChange={(e) => setTaskForm({ ...taskForm, startTime: e.target.value })}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50"
                        />
                        <input
                            type="time"
                            value={taskForm.endTime}
                            onChange={(e) => setTaskForm({ ...taskForm, endTime: e.target.value })}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50"
                        />
                        <select
                            value={taskForm.priority}
                            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50"
                        >
                            <option value="High">High Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="Low">Low Priority</option>
                        </select>

                        <select
                            value={taskForm.location}
                            onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value as TaskLocation })}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50"
                        >
                            <option value="Office">Office</option>
                            <option value="Home">Home</option>
                            <option value="Field">Field</option>
                            <option value="Travel">Travel</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <select
                            value={taskForm.category}
                            onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value as TaskCategory })}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50"
                        >
                            <option value="Work">Work</option>
                            <option value="Study">Study</option>
                            <option value="Health">Health</option>
                            <option value="Personal">Personal</option>
                            <option value="Finance">Finance</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTask}
                                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-all"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Tasks */}
                <div className="lg:col-span-2 space-y-6">
                    {viewMode === 'timeline' ? (
                        /* Timeline View */
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-slate-100 mb-4">Timeline</h3>
                            {dayTasks.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm">No tasks scheduled for this day</p>
                                    <p className="text-xs mt-1">Click "Add Task" to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dayTasks.map(task => (
                                        <PlannerTaskCard
                                            key={task.id}
                                            task={task}
                                            onToggleComplete={taskManager.toggleComplete}
                                            onDelete={taskManager.deleteTask}
                                            showConflict={taskManager.hasTimeConflict(task, task.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Priority View */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <PriorityPanel
                                priority="High"
                                tasks={highPriorityTasks}
                                onToggleComplete={taskManager.toggleComplete}
                                onDelete={taskManager.deleteTask}
                            />
                            <PriorityPanel
                                priority="Medium"
                                tasks={mediumPriorityTasks}
                                onToggleComplete={taskManager.toggleComplete}
                                onDelete={taskManager.deleteTask}
                            />
                            <PriorityPanel
                                priority="Low"
                                tasks={lowPriorityTasks}
                                onToggleComplete={taskManager.toggleComplete}
                                onDelete={taskManager.deleteTask}
                            />
                        </div>
                    )}

                    {/* Day Notes */}
                    <DayNotesPanel
                        selectedDate={selectedDate}
                        notes={dayNotes}
                        onSaveNote={handleSaveNote}
                    />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <PlannerNotifications
                        upcomingTasks={upcomingTasks}
                        overdueTasks={overdueTasks}
                        recurringReminders={recurringReminders}
                    />

                    {/* Intelligent Assistants - Smart Insights */}
                    {(allSuggestions.length > 0 || textConflicts.length > 0 || routineHealth || highImpactTasks.length > 0) && (
                        <div className="bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl animate-in slide-in-from-right-4">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-400 mb-3">
                                <Brain size={16} />
                                Smart Insights
                            </h4>
                            <div className="space-y-3">
                                {highImpactTasks.length > 0 && (
                                    <div className="flex flex-col gap-1 text-xs bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                        <div className="flex items-center gap-2 text-slate-300 font-bold mb-1">
                                            <Target size={14} className="text-cyan-400" />
                                            Top Focus (High Impact)
                                        </div>
                                        {highImpactTasks.map(task => (
                                            <div key={task.id} className="pl-6 text-slate-400 truncate">• {task.title}</div>
                                        ))}
                                    </div>
                                )}
                                {textConflicts.map((conflict, i) => (
                                    <div key={i} className="flex gap-2 text-xs text-amber-400 bg-amber-400/10 p-2 rounded-lg">
                                        <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                                        {conflict}
                                    </div>
                                ))}
                                {routineHealth && (
                                    <div className="flex gap-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded-lg">
                                        <CheckCircle size={14} className="shrink-0 mt-0.5 text-slate-500" />
                                        {routineHealth}
                                    </div>
                                )}
                                {allSuggestions.map((suggestion, i) => (
                                    <div key={i} className="flex gap-2 text-xs text-slate-300 bg-indigo-500/10 p-2 rounded-lg">
                                        <Zap size={14} className="shrink-0 mt-0.5 text-indigo-400" />
                                        {suggestion}
                                    </div>
                                ))}
                                {predictiveHint && (
                                    <div className="flex gap-2 text-xs text-indigo-300 bg-indigo-500/5 p-2 rounded-lg italic border border-indigo-500/10">
                                        <Brain size={14} className="shrink-0 mt-0.5 text-indigo-400" />
                                        Reminder: {predictiveHint}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Plan B - Fallback List */}
                    {planBTasks.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3">
                                <Coffee size={16} />
                                Plan B (Quick Wins)
                            </h4>
                            <div className="space-y-2">
                                {planBTasks.map(task => (
                                    <div key={task.id} className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded-lg border border-slate-800">
                                        <span className="text-slate-300 truncate">{task.title}</span>
                                        <span className="text-slate-500">{task.duration}m</span>
                                    </div>
                                ))}
                                <p className="text-[10px] text-slate-600 italic mt-2">
                                    {getRecoverySuggestion()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Summary Toggle */}
                    <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1">
                        <button
                            onClick={() => setSummaryView('day')}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${summaryView === 'day'
                                ? 'bg-cyan-500 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Day Summary
                        </button>
                        <button
                            onClick={() => setSummaryView('month')}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${summaryView === 'month'
                                ? 'bg-cyan-500 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Month Summary
                        </button>
                    </div>

                    {/* Summary Cards */}
                    {summaryView === 'day' ? (
                        <DaySummaryCard summary={dailySummary} />
                    ) : (
                        <MonthlySummaryCard summary={monthlySummary} />
                    )}
                </div>
            </div>

            {/* End of Day Reflection - Soft UI Addition */}
            <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-900 border border-slate-800/50 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sun size={100} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            End of Day Reflection
                            {currentReflection?.completed && <CheckCircle size={16} className="text-green-500" />}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-xl">
                            How did the day go? take a moment to reflect on your energy and achievements.
                        </p>
                    </div>

                    {!currentReflection ? (
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <select
                                value={reflectionForm.mood}
                                onChange={(e) => setReflectionForm({ ...reflectionForm, mood: e.target.value as any })}
                                className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 min-w-[120px]"
                            >
                                <option value="Great">Great 🤩</option>
                                <option value="Good">Good 🙂</option>
                                <option value="Neutral">Neutral 😐</option>
                                <option value="Bad">Bad 😫</option>
                                <option value="Awful">Awful 💀</option>
                            </select>
                            <input
                                type="text"
                                placeholder="I'm grateful for..."
                                value={reflectionForm.gratitude}
                                onChange={(e) => setReflectionForm({ ...reflectionForm, gratitude: e.target.value })}
                                className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 w-full md:w-64"
                            />
                            <button
                                onClick={handleSaveReflection}
                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 bg-slate-950/50 px-4 py-3 rounded-xl border border-slate-800">
                            <div className="text-center px-2">
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Mood</div>
                                <div className="text-lg text-slate-200 font-medium">{currentReflection.mood}</div>
                            </div>
                            <div className="w-px h-8 bg-slate-800"></div>
                            <div className="px-2">
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Gratitude</div>
                                <div className="text-sm text-slate-300 italic">"{currentReflection.gratitude}"</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recurring Task Modal */}
            <RecurringTaskModal
                isOpen={showRecurringModal}
                onClose={() => setShowRecurringModal(false)}
                onSave={(task) => {
                    recurringManager.addRecurringTask(task);
                    setShowRecurringModal(false);
                }}
            />
        </div>
    );
};

export default Planner;
