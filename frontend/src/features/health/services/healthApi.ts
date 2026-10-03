/**
 * services/healthApi.ts
 * Centralized Axios service for the MAVERICK Health API (port 5000)
 * All calls use async/await with try/catch and typed return values
 */

import axios, { AxiosResponse } from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StressResponse {
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH';
  tip: string;
  timestamp: string;
}

export interface EnergyResponse {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Peak';
  message: string;
  activitySteps: number;
  sleepHours: number;
  caloriesConsumed: number;
  timestamp: string;
}

export interface BMIResponse {
  bmi: number;
  category: string;
  color: string;
  idealRange: string;
  advice: string;
  weightKg: number;
  heightCm: number;
  timestamp: string;
}

export interface ActivityLog {
  id?: string;
  date: string;
  calories: number;
  steps: number;
  vitamins: string[];
  medications: string[];
}

export interface Goal {
  id: string;
  title: string;
  category: 'fitness' | 'diet' | 'lifestyle';
  targetValue: number;
  currentValue: number;
  unit: string;
  period: 'weekly' | 'monthly';
  completed: boolean;
  progress: number;
  createdAt?: string;
}

export interface Notification {
  id: string;
  type: 'GOAL' | 'MEDICATION' | 'STRESS' | 'ENERGY';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  icon: string;
  createdAt: string;
}

export interface WorkoutDay {
  id: string;
  day: string;
  type: string;
  duration: number;
  completed: boolean;
  weekStart: string;
}

export interface WorkoutWeek {
  weekStart: string;
  workouts: WorkoutDay[];
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

// Response interceptor — extract data automatically
const unwrap = <T>(promise: Promise<AxiosResponse<T>>): Promise<T> =>
  promise.then((r) => r.data);

// ─── Health / Stress ──────────────────────────────────────────────────────────

export const calculateStress = (payload: {
  heartRate: number;
  bloodPressure: number;
  hrv: number;
}): Promise<StressResponse> => unwrap(api.post('/health/stress', payload));

export const syncWatchData = (payload: {
  heartRate?: number;
  bloodPressure?: number;
  hrv?: number;
  steps?: number;
}): Promise<{ message: string; data: object }> => unwrap(api.put('/health/watch-sync', payload));

export const getWatchData = (): Promise<object> => unwrap(api.get('/health/watch-sync'));

// ─── Energy ───────────────────────────────────────────────────────────────────

export const calculateEnergy = (payload: {
  activitySteps: number;
  sleepHours: number;
  caloriesConsumed: number;
}): Promise<EnergyResponse> => unwrap(api.post('/energy/calculate', payload));

// ─── BMI ─────────────────────────────────────────────────────────────────────

export const calculateBMI = (payload: {
  weight: number;
  height: number;
}): Promise<BMIResponse> => unwrap(api.post('/bmi/calculate', payload));

// ─── Activity ─────────────────────────────────────────────────────────────────

export const logActivity = (payload: Partial<ActivityLog>): Promise<{ message: string; data: ActivityLog }> =>
  unwrap(api.post('/activity/log', payload));

export const getTodayActivity = (): Promise<ActivityLog> => unwrap(api.get('/activity/today'));

export const getActivityHistory = (): Promise<ActivityLog[]> => unwrap(api.get('/activity/history'));

// ─── Goals ───────────────────────────────────────────────────────────────────

export const getGoals = (): Promise<Goal[]> => unwrap(api.get('/goals'));

export const createGoal = (payload: Omit<Goal, 'id' | 'completed' | 'progress'>): Promise<Goal> =>
  unwrap(api.post('/goals', payload));

export const updateGoal = (id: string, payload: Partial<Goal>): Promise<Goal> =>
  unwrap(api.put(`/goals/${id}`, payload));

export const deleteGoal = (id: string): Promise<{ message: string }> =>
  unwrap(api.delete(`/goals/${id}`));

export const watchUpdateGoal = (id: string, increment = 1): Promise<Goal> =>
  unwrap(api.put(`/goals/${id}/watch-update`, { increment }));

// ─── Notifications ────────────────────────────────────────────────────────────

export const getNotifications = (): Promise<Notification[]> => unwrap(api.get('/notifications'));

// ─── Workout ─────────────────────────────────────────────────────────────────

export const getWorkoutWeek = (): Promise<WorkoutWeek> => unwrap(api.get('/workout'));

export const updateWorkout = (payload: {
  day: string;
  type?: string;
  duration?: number;
  completed?: boolean;
}): Promise<{ message: string; workout: WorkoutDay }> => unwrap(api.post('/workout', payload));

export const resetWorkoutWeek = (): Promise<WorkoutWeek & { message: string }> =>
  unwrap(api.post('/workout/reset', {}));

export default api;
