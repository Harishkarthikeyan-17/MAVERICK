import { useState, useCallback } from 'react';
import { PlannerTask, TaskPriority, TaskCategory } from '../types';

export const useTasks = (initialTasks: PlannerTask[] = []) => {
    const [tasks, setTasks] = useState<PlannerTask[]>(initialTasks);

    // Calculate duration in minutes from time strings
    const calculateDuration = (startTime: string, endTime: string): number => {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes - startMinutes;
    };

    // Sort tasks by start time
    const sortTasks = (tasksToSort: PlannerTask[]): PlannerTask[] => {
        return [...tasksToSort].sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.startTime.localeCompare(b.startTime);
        });
    };

    // Check for time conflicts
    const hasTimeConflict = (newTask: Omit<PlannerTask, 'id'>, excludeId?: string): boolean => {
        const [newStartHour, newStartMin] = newTask.startTime.split(':').map(Number);
        const [newEndHour, newEndMin] = newTask.endTime.split(':').map(Number);
        const newStart = newStartHour * 60 + newStartMin;
        const newEnd = newEndHour * 60 + newEndMin;

        return tasks.some(task => {
            if (task.id === excludeId || task.date !== newTask.date) return false;

            const [taskStartHour, taskStartMin] = task.startTime.split(':').map(Number);
            const [taskEndHour, taskEndMin] = task.endTime.split(':').map(Number);
            const taskStart = taskStartHour * 60 + taskStartMin;
            const taskEnd = taskEndHour * 60 + taskEndMin;

            return (newStart < taskEnd && newEnd > taskStart);
        });
    };

    const addTask = useCallback((taskData: Omit<PlannerTask, 'id' | 'duration'>) => {
        const duration = calculateDuration(taskData.startTime, taskData.endTime);
        const newTask: PlannerTask = {
            ...taskData,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            duration,
        };

        setTasks(prev => sortTasks([...prev, newTask]));
        return newTask;
    }, []);

    const editTask = useCallback((id: string, updates: Partial<PlannerTask>) => {
        setTasks(prev => {
            const updated = prev.map(task => {
                if (task.id !== id) return task;

                const updatedTask = { ...task, ...updates };

                // Recalculate duration if times changed
                if (updates.startTime || updates.endTime) {
                    updatedTask.duration = calculateDuration(
                        updatedTask.startTime,
                        updatedTask.endTime
                    );
                }

                return updatedTask;
            });

            return sortTasks(updated);
        });
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    }, []);

    const toggleComplete = useCallback((id: string) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    }, []);

    const updatePriority = useCallback((id: string, priority: TaskPriority) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, priority } : task
        ));
    }, []);

    const getTasksByDate = useCallback((date: string) => {
        return tasks.filter(task => task.date === date);
    }, [tasks]);

    const getTasksByPriority = useCallback((date: string, priority: TaskPriority) => {
        return tasks.filter(task => task.date === date && task.priority === priority);
    }, [tasks]);

    const getOverdueTasks = useCallback((currentDate: string) => {
        return tasks.filter(task =>
            task.date < currentDate && !task.completed
        );
    }, [tasks]);

    return {
        tasks,
        addTask,
        editTask,
        deleteTask,
        toggleComplete,
        updatePriority,
        getTasksByDate,
        getTasksByPriority,
        getOverdueTasks,
        hasTimeConflict,
    };
};
