/**
 * routes/workout.js
 * POST /api/workout        — save/update a workout day
 * POST /api/workout/reset  — reset weekly planner
 * GET  /api/workout        — get current week's planner
 */

const express = require('express');
const router  = express.Router();

// Helper: get Monday of the current ISO week
function getWeekStart() {
  const d = new Date();
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Default planner template
const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_TYPES = ['Cardio', 'Strength', 'Yoga', 'Cardio', 'Strength', 'Sports', 'Rest'];

function buildDefaultWeek(weekStart) {
  return DEFAULT_DAYS.map((day, i) => ({
    id: `${weekStart}-${day}`,
    day,
    type: DEFAULT_TYPES[i],
    duration: DEFAULT_TYPES[i] === 'Rest' ? 0 : (i % 2 === 0 ? 30 : 45),
    completed: false,
    weekStart,
  }));
}

// In-memory: weekStart → workouts[]
const workoutStore = new Map();

function getOrInitWeek(weekStart) {
  if (!workoutStore.has(weekStart)) {
    workoutStore.set(weekStart, buildDefaultWeek(weekStart));
  }
  return workoutStore.get(weekStart);
}

/** GET /api/workout — current week's plan */
router.get('/', (_req, res) => {
  const weekStart = getWeekStart();
  return res.json({ weekStart, workouts: getOrInitWeek(weekStart) });
});

/**
 * POST /api/workout — toggle / update a workout day
 * Body: { day: string, type?: string, duration?: number, completed?: boolean }
 */
router.post('/', (req, res) => {
  const { day, type, duration, completed } = req.body;
  if (!day) return res.status(400).json({ error: 'day is required.' });

  const weekStart = getWeekStart();
  const week      = getOrInitWeek(weekStart);
  const idx       = week.findIndex((w) => w.day === day);

  if (idx === -1) return res.status(404).json({ error: `Day "${day}" not found in planner.` });

  if (type      != null) week[idx].type      = type;
  if (duration  != null) week[idx].duration  = Number(duration);
  if (completed != null) week[idx].completed = Boolean(completed);
  week[idx].updatedAt = new Date().toISOString();

  workoutStore.set(weekStart, week);
  return res.json({ message: 'Workout updated.', workout: week[idx] });
});

/** POST /api/workout/reset — reset current week back to defaults */
router.post('/reset', (_req, res) => {
  const weekStart = getWeekStart();
  workoutStore.set(weekStart, buildDefaultWeek(weekStart));
  return res.json({ message: 'Weekly workout planner reset.', weekStart, workouts: workoutStore.get(weekStart) });
});

module.exports = router;
