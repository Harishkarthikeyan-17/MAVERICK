/**
 * routes/goals.js
 * Full CRUD for health goals
 * GET/POST/PUT/DELETE /api/goals
 * Incomplete goals are surfaced in /api/notifications
 */

const express = require('express');
const router  = express.Router();
const { v4: uuid } = require('uuid');

// In-memory goals store
let goals = [
  {
    id: '1',
    title: 'Run 20 km this week',
    category: 'fitness',
    targetValue: 20,
    currentValue: 12,
    unit: 'km',
    period: 'weekly',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Eat 5 servings of vegetables daily',
    category: 'diet',
    targetValue: 7,
    currentValue: 4,
    unit: 'days',
    period: 'weekly',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Meditate 10 min daily',
    category: 'lifestyle',
    targetValue: 30,
    currentValue: 30,
    unit: 'min',
    period: 'weekly',
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

// Helper: check if a goal is completed based on current vs target
const isComplete = (g) => g.currentValue >= g.targetValue;

/** GET /api/goals — return all goals, marking incomplete ones */
router.get('/', (_req, res) => {
  const result = goals.map((g) => ({
    ...g,
    completed: isComplete(g),
    progress: Math.min(100, Math.round((g.currentValue / g.targetValue) * 100)),
  }));
  return res.json(result);
});

/**
 * POST /api/goals — create a new goal
 * Body: { title, category, targetValue, unit, period, currentValue? }
 */
router.post('/', (req, res) => {
  const { title, category, targetValue, unit, period, currentValue = 0 } = req.body;

  if (!title || !category || targetValue == null || !unit || !period) {
    return res.status(400).json({ error: 'title, category, targetValue, unit, and period are required.' });
  }

  const newGoal = {
    id: uuid(),
    title,
    category,
    targetValue: Number(targetValue),
    currentValue: Number(currentValue),
    unit,
    period,
    completed: Number(currentValue) >= Number(targetValue),
    createdAt: new Date().toISOString(),
  };

  goals.push(newGoal);
  return res.status(201).json({ ...newGoal, progress: Math.round((newGoal.currentValue / newGoal.targetValue) * 100) });
});

/**
 * PUT /api/goals/:id — update a goal (progress or metadata)
 * Body: Partial goal fields
 */
router.put('/:id', (req, res) => {
  const idx = goals.findIndex((g) => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Goal not found.' });

  const updates = req.body;
  goals[idx] = { ...goals[idx], ...updates, updatedAt: new Date().toISOString() };
  goals[idx].completed = isComplete(goals[idx]);

  return res.json({
    ...goals[idx],
    progress: Math.min(100, Math.round((goals[idx].currentValue / goals[idx].targetValue) * 100)),
  });
});

/** DELETE /api/goals/:id */
router.delete('/:id', (req, res) => {
  const before = goals.length;
  goals = goals.filter((g) => g.id !== req.params.id);
  if (goals.length === before) return res.status(404).json({ error: 'Goal not found.' });
  return res.json({ message: 'Goal deleted successfully.' });
});

/**
 * PUT /api/goals/:id/watch-update — simulate smartwatch incrementing a goal
 * Body: { increment: number }
 */
router.put('/:id/watch-update', (req, res) => {
  const idx = goals.findIndex((g) => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Goal not found.' });

  const increment = Number(req.body.increment) || 1;
  goals[idx].currentValue = Math.min(goals[idx].targetValue, goals[idx].currentValue + increment);
  goals[idx].completed    = isComplete(goals[idx]);
  goals[idx].updatedAt    = new Date().toISOString();

  return res.json({
    ...goals[idx],
    progress: Math.min(100, Math.round((goals[idx].currentValue / goals[idx].targetValue) * 100)),
    source: 'smartwatch',
  });
});

// Export goals array reference so notifications route can read it
module.exports = router;
module.exports.getGoals = () => goals;
