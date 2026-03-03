import { useMemo } from 'react';
import { PlannerTask, TaskCategory } from '../types';

interface DailySummary {
    totalPlannedTime: number;
    totalCompletedTime: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    productivityPercentage: number;
    categoryBreakdown: Record<TaskCategory, number>;
}

interface MonthlySummary {
    totalProductiveHours: number;
    totalTasksCompleted: number;
    totalTasksPlanned: number;
    completionRate: number;
    categoryFrequency: Record<TaskCategory, number>;
    consistencyScore: number;
    mostProductiveDay: string;
}

export const usePlannerSummary = (tasks: PlannerTask[], selectedDate: string) => {
    const dailySummary = useMemo((): DailySummary => {
        const dayTasks = tasks.filter(task => task.date === selectedDate);

        const totalPlannedTime = dayTasks.reduce((sum, task) => sum + task.duration, 0);
        const totalCompletedTime = dayTasks
            .filter(task => task.completed)
            .reduce((sum, task) => sum + task.duration, 0);

        const completedTasks = dayTasks.filter(task => task.completed).length;
        const totalTasks = dayTasks.length;
        const pendingTasks = totalTasks - completedTasks;

        const productivityPercentage = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        const categoryBreakdown: Record<TaskCategory, number> = {
            Work: 0,
            Study: 0,
            Health: 0,
            Personal: 0,
            Finance: 0,
            Other: 0,
        };

        dayTasks.forEach(task => {
            categoryBreakdown[task.category] += task.duration;
        });

        return {
            totalPlannedTime,
            totalCompletedTime,
            totalTasks,
            completedTasks,
            pendingTasks,
            productivityPercentage,
            categoryBreakdown,
        };
    }, [tasks, selectedDate]);

    const monthlySummary = useMemo((): MonthlySummary => {
        const currentMonth = selectedDate.substring(0, 7); // YYYY-MM
        const monthTasks = tasks.filter(task => task.date.startsWith(currentMonth));

        const totalProductiveHours = monthTasks
            .filter(task => task.completed)
            .reduce((sum, task) => sum + task.duration, 0) / 60;

        const totalTasksCompleted = monthTasks.filter(task => task.completed).length;
        const totalTasksPlanned = monthTasks.length;

        const completionRate = totalTasksPlanned > 0
            ? Math.round((totalTasksCompleted / totalTasksPlanned) * 100)
            : 0;

        const categoryFrequency: Record<TaskCategory, number> = {
            Work: 0,
            Study: 0,
            Health: 0,
            Personal: 0,
            Finance: 0,
            Other: 0,
        };

        monthTasks.forEach(task => {
            categoryFrequency[task.category]++;
        });

        // Calculate consistency score (tasks completed per day)
        const uniqueDates = new Set(monthTasks.map(task => task.date));
        const daysWithTasks = uniqueDates.size;
        const avgTasksPerDay = daysWithTasks > 0 ? totalTasksCompleted / daysWithTasks : 0;
        const consistencyScore = Math.min(100, Math.round(avgTasksPerDay * 10));

        // Find most productive day
        const dayProductivity: Record<string, number> = {};
        monthTasks.forEach(task => {
            if (task.completed) {
                dayProductivity[task.date] = (dayProductivity[task.date] || 0) + task.duration;
            }
        });

        const mostProductiveDay = Object.entries(dayProductivity).reduce(
            (max, [date, minutes]) => minutes > max.minutes ? { date, minutes } : max,
            { date: 'N/A', minutes: 0 }
        ).date;

        return {
            totalProductiveHours,
            totalTasksCompleted,
            totalTasksPlanned,
            completionRate,
            categoryFrequency,
            consistencyScore,
            mostProductiveDay,
        };
    }, [tasks, selectedDate]);

    return {
        dailySummary,
        monthlySummary,
    };
};
