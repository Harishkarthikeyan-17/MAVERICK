import { useState, useEffect, useMemo } from 'react';
import { PlannerTask, TaskPriority, EnergyLevel, TaskLocation, WeatherCondition, DailyReflection, PlannerContext } from '../../../core/types';

export const useIntelligentPlanner = (tasks: PlannerTask[], date: string) => {
    // 1. Focus Intent & Energy Status
    const [focusIntent, setFocusIntent] = useState<string>('');
    const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('Medium');

    // 2. Weather Awareness (Simulated for now, can be connected to API)
    const [weather, setWeather] = useState<WeatherCondition>('Sunny');

    // 3. Location (Optional)
    const [userLocation, setUserLocation] = useState<TaskLocation>('Office');

    // 9. End of Day Reflection
    const [reflections, setReflections] = useState<DailyReflection[]>([]);

    // Simulated Weather Fetching
    useEffect(() => {
        // In a real app, this would fetch from an API based on geolocation
        const simulatedWeathers: WeatherCondition[] = ['Sunny', 'Cloudy', 'Rainy'];
        const randomWeather = simulatedWeathers[Math.floor(Math.random() * simulatedWeathers.length)];
        setWeather(randomWeather);
    }, [date]);

    // 1., 2., 4., & 10. Task Suggestions (Combined Intelligence)
    const suggestions = useMemo(() => {
        const result: string[] = [];

        // 1. Focus Intent Logic (Keyword Match)
        if (focusIntent.trim()) {
            const keywords = focusIntent.toLowerCase().split(' ');
            const relevantTasks = tasks.filter(t =>
                !t.completed &&
                keywords.some(k => k.length > 2 && t.title.toLowerCase().includes(k))
            );

            if (relevantTasks.length > 0) {
                result.push(`Intent Match: Prioritize "${relevantTasks[0].title}" to align with your focus.`);
            }
        }

        // 10. Predictive Planning (History Trend - 3 Day Window)
        const recentReflections = reflections
            .filter(r => new Date(r.date) < new Date(date))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);

        if (recentReflections.length > 0) {
            const badDays = recentReflections.filter(r => ['Bad', 'Awful'].includes(r.mood)).length;
            if (badDays >= 2) {
                result.push('Burnout Warning: You had a rough streak recently. Ease into today.');
            } else if (recentReflections[0]?.mood === 'Great') {
                result.push('Great momentum from yesterday! Tackle big rocks early.');
            }
        }

        // Energy Logic
        if (energyLevel === 'Very Low' || energyLevel === 'Low') {
            result.push('Energy is low. Focus on administrative tasks, reading, or light planning.');
            result.push('Avoid high-complexity decision making right now.');
        } else if (energyLevel === 'High') {
            result.push('Energy is high! Great time for deep work and creative problem solving.');
            result.push('Tackle your most difficult task first.');
        }

        // Weather Logic
        if (weather === 'Rainy' || weather === 'Stormy') {
            result.push('Weather looks gloomy. Perfect for focused indoor work.');
        } else if (weather === 'Sunny' && (energyLevel === 'Medium' || energyLevel === 'High')) {
            result.push('Good weather outside. Consider a walking meeting or a quick outdoor break.');
        }

        // 4. Location Logic (Time Aware)
        // Assume "Office" tasks should happen 9-5, "Home" tasks otherwise? 
        // For now, simple mismatch check is safest without complex time settings.
        const currentHour = new Date().getHours();
        const locationMismatchCount = tasks.filter(t => t.location && t.location !== userLocation && !t.completed).length;

        if (locationMismatchCount > 0) {
            // Refine: Only warn if it's "now" logic? 
            // Simplified: Just warn generally but cooler.
            result.push(`Location check: ${locationMismatchCount} tasks might need a location change (${userLocation} vs plan).`);
        }

        return result;
    }, [energyLevel, weather, userLocation, tasks, reflections, date, focusIntent]);

    // 3. Plan B & Flow Recovery System
    const planBTasks = useMemo(() => {
        // Suggest Plan B tasks (Low priority, short duration, low energy requirement)
        return tasks.filter(t =>
            t.priority === 'Low' &&
            t.duration <= 30 &&
            !t.completed
        );
    }, [tasks]);

    const getRecoverySuggestion = () => {
        if (planBTasks.length > 0) {
            const random = planBTasks[Math.floor(Math.random() * planBTasks.length)];
            return `Flow broken? Reset with a quick win: "${random.title}" (${random.duration}m)`;
        }
        return "Flow broken? Take a 5-minute breathing break to reset.";
    };

    // 5. Conflict Detection (Smart)
    const textConflicts = useMemo(() => {
        const warnings: string[] = [];

        // Lunch Protection (12 PM - 2 PM)
        const lunchTasks = tasks.filter(t => {
            const h = parseInt(t.startTime.split(':')[0]);
            return h >= 12 && h < 14;
        });

        // Calculate free time in lunch window
        let lunchBusyMinutes = 0;
        lunchTasks.forEach(t => lunchBusyMinutes += t.duration);

        if (lunchBusyMinutes >= 100) { // If > 1h 40m booked in 2h window
            warnings.push("🥗 Lunch Protection warnings: You are fully booked during lunch hours.");
        }

        // Deep Work Limit
        const deepWorkMinutes = tasks
            .filter(t => t.priority === 'High' && t.category === 'Work')
            .reduce((acc, t) => acc + t.duration, 0);

        if (deepWorkMinutes > 240) { // > 4 hours
            warnings.push("🧠 Brain Fog Alert: Over 4 hours of deep work scheduled. Ensure you have buffers.");
        }

        // Late Night Warning
        const lateTasks = tasks.filter(t => parseInt(t.startTime.split(':')[0]) >= 20);
        if (lateTasks.length > 0) {
            warnings.push("🌙 Late Night Protection: You have tasks scheduled after 8 PM.");
        }

        // Back-to-back high priority
        const sortedTasks = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));
        for (let i = 0; i < sortedTasks.length - 1; i++) {
            const current = sortedTasks[i];
            const next = sortedTasks[i + 1];

            if (current.priority === 'High' && next.priority === 'High') {
                const [currEndH, currEndM] = current.endTime.split(':').map(Number);
                const [nextStartH, nextStartM] = next.startTime.split(':').map(Number);

                // If less than 15 mins gap
                if ((nextStartH * 60 + nextStartM) - (currEndH * 60 + currEndM) < 15) {
                    warnings.push(`⚡ High Intensity Overload: No break between "${current.title}" and "${next.title}".`);
                }
            }
        }

        return warnings;
    }, [tasks]);

    // 6. Priority & Impact Scoring
    const highImpactTasks = useMemo(() => {
        // Boost priority if matches focus intent
        if (focusIntent) {
            const intentTasks = tasks.filter(t => !t.completed && t.title.toLowerCase().includes(focusIntent.toLowerCase()));
            if (intentTasks.length > 0) return intentTasks.slice(0, 3);
        }
        return tasks.filter(t => t.priority === 'High').slice(0, 3);
    }, [tasks, focusIntent]);

    // 7. Recurring Routine Manager (Habit Decay)
    const routineHealth = useMemo(() => {
        const overdue = tasks.filter(t => !t.completed && new Date(t.date) < new Date(new Date().toISOString().split('T')[0]));

        if (overdue.length > 3) {
            return "📉 Habit Decay Alert: 3+ tasks overdue. Start fresh and reschedule them?";
        }
        return null;
    }, [tasks]);


    // 9. Reflection Helper
    const saveReflection = (reflection: DailyReflection) => {
        setReflections(prev => {
            const existing = prev.findIndex(r => r.date === reflection.date);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = reflection;
                return updated;
            }
            return [...prev, reflection];
        });
    };

    const getDailyReflection = (date: string) => {
        return reflections.find(r => r.date === date);
    };

    // 8. Break & Burnout Protection (Real-time check)
    const burnoutRisk = useMemo(() => {
        const highIntensityTasks = tasks
            .filter(t => t.priority === 'High' && !t.completed)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

        let runningDuration = 0, lastEnd = '';

        for (const t of highIntensityTasks) {
            if (lastEnd) {
                const [lh, lm] = lastEnd.split(':').map(Number);
                const [sh, sm] = t.startTime.split(':').map(Number);
                // Reset counter if gap > 20 mins
                if ((sh * 60 + sm) - (lh * 60 + lm) > 20) runningDuration = 0;
            }
            runningDuration += t.duration;
            lastEnd = t.endTime;

            if (runningDuration > 120) return "🛑 Stop & Breathe: You've planned 2+ hours of continuous high-focus work.";
        }
        return null;
    }, [tasks]);

    const suggestBreakIfNeeded = () => burnoutRisk;

    // 10. Predictive Planning Hint (Advanced)
    const predictiveHint = useMemo(() => {
        if (!reflections.length) return null;

        const recent = reflections.slice(-3); // Last 3
        const avgMoodScore = recent.reduce((acc, r) => {
            if (r.mood === 'Great') return acc + 3;
            if (r.mood === 'Good') return acc + 2;
            if (r.mood === 'Neutral') return acc + 1;
            return acc;
        }, 0);

        if (recent.length === 0) return "Start your reflection streak today!";
        if (recent[recent.length - 1].mood === 'Bad') return "Recovery: Focus on low-stress tasks today.";
        if (avgMoodScore > 5) return "You're on a roll! Challenge yourself today.";

        return "Consistency is key. Stick to the plan.";
    }, [reflections]);

    return {
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
        predictiveHint,
        burnoutRisk
    };
};
