import { useState, useCallback } from 'react';
import { RecurringTask, PlannerTask } from '../types';

export const useRecurringTasks = () => {
    const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);

    const addRecurringTask = useCallback((task: Omit<RecurringTask, 'id'>) => {
        const newTask: RecurringTask = {
            ...task,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        setRecurringTasks(prev => [...prev, newTask]);
        return newTask;
    }, []);

    const deleteRecurringTask = useCallback((id: string) => {
        setRecurringTasks(prev => prev.filter(task => task.id !== id));
    }, []);

    const editRecurringTask = useCallback((id: string, updates: Partial<RecurringTask>) => {
        setRecurringTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ));
    }, []);

    // Check if a date matches the recurring pattern
    const matchesPattern = (recurringTask: RecurringTask, date: string): boolean => {
        const targetDate = new Date(date);
        const startDate = new Date(recurringTask.startDate);
        const endDate = recurringTask.endDate ? new Date(recurringTask.endDate) : null;

        // Check if date is within range
        if (targetDate < startDate) return false;
        if (endDate && targetDate > endDate) return false;

        switch (recurringTask.pattern) {
            case 'daily':
                return true;

            case 'weekly':
                if (!recurringTask.daysOfWeek || recurringTask.daysOfWeek.length === 0) return false;
                return recurringTask.daysOfWeek.includes(targetDate.getDay());

            case 'monthly':
                if (!recurringTask.dayOfMonth) return false;
                return targetDate.getDate() === recurringTask.dayOfMonth;

            case 'custom':
                if (!recurringTask.customInterval) return false;
                const daysDiff = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                return daysDiff % recurringTask.customInterval === 0;

            default:
                return false;
        }
    };

    // Generate task instances for a specific date
    const getTasksForDate = useCallback((date: string): PlannerTask[] => {
        return recurringTasks
            .filter(rt => matchesPattern(rt, date))
            .map(rt => ({
                id: `recurring-${rt.id}-${date}`,
                title: rt.title,
                date,
                startTime: rt.startTime,
                endTime: rt.endTime,
                duration: rt.duration,
                priority: rt.priority,
                category: rt.category,
                completed: false,
                notes: '🔄 Recurring Task',
            }));
    }, [recurringTasks]);

    // Get all recurring tasks for a date range (for monthly view)
    const getTasksForDateRange = useCallback((startDate: string, endDate: string): PlannerTask[] => {
        const tasks: PlannerTask[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            tasks.push(...getTasksForDate(dateStr));
        }

        return tasks;
    }, [getTasksForDate]);

    return {
        recurringTasks,
        addRecurringTask,
        deleteRecurringTask,
        editRecurringTask,
        getTasksForDate,
        getTasksForDateRange,
    };
};
