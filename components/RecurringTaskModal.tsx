import React, { useState } from 'react';
import { X, Repeat, Calendar, Clock } from 'lucide-react';
import { RecurringTask, TaskPriority, TaskCategory, RecurrencePattern } from '../types';

interface RecurringTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<RecurringTask, 'id'>) => void;
    editTask?: RecurringTask;
}

const RecurringTaskModal: React.FC<RecurringTaskModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editTask,
}) => {
    const [formData, setFormData] = useState<Omit<RecurringTask, 'id'>>({
        title: editTask?.title || '',
        startTime: editTask?.startTime || '09:00',
        endTime: editTask?.endTime || '10:00',
        duration: editTask?.duration || 60,
        priority: editTask?.priority || 'Medium',
        category: editTask?.category || 'Work',
        pattern: editTask?.pattern || 'daily',
        startDate: editTask?.startDate || new Date().toISOString().split('T')[0],
        endDate: editTask?.endDate || '',
        daysOfWeek: editTask?.daysOfWeek || [1, 2, 3, 4, 5], // Mon-Fri default
        dayOfMonth: editTask?.dayOfMonth || 1,
        customInterval: editTask?.customInterval || 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate duration
        const [startHour, startMin] = formData.startTime.split(':').map(Number);
        const [endHour, endMin] = formData.endTime.split(':').map(Number);
        const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

        onSave({ ...formData, duration });
        onClose();
    };

    const toggleDayOfWeek = (day: number) => {
        const days = formData.daysOfWeek || [];
        if (days.includes(day)) {
            setFormData({ ...formData, daysOfWeek: days.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, daysOfWeek: [...days, day].sort() });
        }
    };

    if (!isOpen) return null;

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center">
                            <Repeat size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-100">
                                {editTask ? 'Edit' : 'Add'} Recurring Task
                            </h2>
                            <p className="text-xs text-slate-500">Set up automated task recurrence</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-xs text-slate-400 mb-2 block font-medium">Task Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                            placeholder="e.g., Morning Exercise"
                            required
                        />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Priority and Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                            >
                                <option value="Work">Work</option>
                                <option value="Study">Study</option>
                                <option value="Health">Health</option>
                                <option value="Personal">Personal</option>
                                <option value="Finance">Finance</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Recurrence Pattern */}
                    <div>
                        <label className="text-xs text-slate-400 mb-2 block font-medium">Recurrence Pattern</label>
                        <select
                            value={formData.pattern}
                            onChange={(e) => setFormData({ ...formData, pattern: e.target.value as RecurrencePattern })}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="custom">Custom Interval</option>
                        </select>
                    </div>

                    {/* Weekly Days Selection */}
                    {formData.pattern === 'weekly' && (
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">Select Days</label>
                            <div className="flex gap-2">
                                {weekDays.map((day, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => toggleDayOfWeek(index)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${formData.daysOfWeek?.includes(index)
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Monthly Day Selection */}
                    {formData.pattern === 'monthly' && (
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">Day of Month</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={formData.dayOfMonth}
                                onChange={(e) => setFormData({ ...formData, dayOfMonth: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                            />
                        </div>
                    )}

                    {/* Custom Interval */}
                    {formData.pattern === 'custom' && (
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">Repeat Every (days)</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.customInterval}
                                onChange={(e) => setFormData({ ...formData, customInterval: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                            />
                        </div>
                    )}

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block font-medium">End Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                        >
                            {editTask ? 'Update' : 'Create'} Recurring Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecurringTaskModal;
