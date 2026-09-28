import { useState, useCallback, useEffect } from 'react';
import { PlannerTask, TaskPriority, TaskCategory } from '../../../core/types';
import { apiClient } from '../../../services/apiClient';

export const useTasks = (initialTasks: PlannerTask[] = []) => {
    const [tasks, setTasks] = useState<PlannerTask[]>(initialTasks);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await apiClient<PlannerTask[]>('/planner/tasks');
                // map _id to id if necessary
                const mapped = data.map(t => ({ ...t, id: (t as any)._id || t.id }));
                setTasks(sortTasks(mapped));
            } catch (err) {
                console.error("Failed to fetch tasks", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Calculate duration in minutes from time strings
    const calculateDuration = (startTime: string, endTime: string): number => {
        if (!startTime || !endTime) return 0;
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
            return (a.startTime || '').localeCompare(b.startTime || '');
        });
    };

    // Check for time conflicts
    const hasTimeConflict = (newTask: Omit<PlannerTask, 'id'>, excludeId?: string): boolean => {
        if (!newTask.startTime || !newTask.endTime) return false;
        const [newStartHour, newStartMin] = newTask.startTime.split(':').map(Number);
        const [newEndHour, newEndMin] = newTask.endTime.split(':').map(Number);
        const newStart = newStartHour * 60 + newStartMin;
        const newEnd = newEndHour * 60 + newEndMin;

        return tasks.some(task => {
            if (task.id === excludeId || task.date !== newTask.date) return false;
            if (!task.startTime || !task.endTime) return false;

            const [taskStartHour, taskStartMin] = task.startTime.split(':').map(Number);
            const [taskEndHour, taskEndMin] = task.endTime.split(':').map(Number);
            const taskStart = taskStartHour * 60 + taskStartMin;
            const taskEnd = taskEndHour * 60 + taskEndMin;

            return (newStart < taskEnd && newEnd > taskStart);
        });
    };

    const addTask = useCallback(async (taskData: Omit<PlannerTask, 'id' | 'duration'>) => {
        const duration = calculateDuration(taskData.startTime, taskData.endTime);
        const payload = { ...taskData, duration };
        
        try {
            const newTask = await apiClient<PlannerTask>('/planner/tasks', { method: 'POST', data: payload });
            const taskWithId = { ...newTask, id: (newTask as any)._id };
            setTasks(prev => sortTasks([...prev, taskWithId]));
            return taskWithId;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, []);

    const editTask = useCallback(async (id: string, updates: Partial<PlannerTask>) => {
        try {
            if (updates.startTime && updates.endTime) {
                updates.duration = calculateDuration(updates.startTime, updates.endTime);
            }
            
            const updated = await apiClient<PlannerTask>(`/planner/tasks/${id}`, { method: 'PUT', data: updates });
            const updatedWithId = { ...updated, id: (updated as any)._id || id };
            
            setTasks(prev => {
                const newTasks = prev.map(task => task.id === id ? { ...task, ...updatedWithId } : task);
                return sortTasks(newTasks);
            });
        } catch (err) {
            console.error(err);
        }
    }, []);

    const deleteTask = useCallback(async (id: string) => {
        try {
            await apiClient(`/planner/tasks/${id}`, { method: 'DELETE' });
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const toggleComplete = useCallback(async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            await editTask(id, { completed: !task.completed });
        }
    }, [tasks, editTask]);

    const updatePriority = useCallback(async (id: string, priority: TaskPriority) => {
        await editTask(id, { priority });
    }, [editTask]);

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
