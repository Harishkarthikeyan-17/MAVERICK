/**
 * routes/activity.js
 * POST /api/activity/log — log daily activity: steps, calories, vitamins, meds
 * GET  /api/activity/today — get today's log
 */

const express = require('express');
const router  = express.Router();
const { v4: uuid } = require('uuid');

// In-memory activity log (keyed by date string YYYY-MM-DD)
const activityStore = new Map();

/**
 * POST /api/activity/log
 * Body: {
 *   calories: number,
 *   steps: number,
 *   vitamins: string[],
 *   medications: string[],
 *   date?: string (YYYY-MM-DD, defaults to today)
 * }
 */
router.post('/log', (req, res) => {
  const {
    calories = 0,
    steps    = 0,
    vitamins = [],
    medications = [],
    date,
  } = req.body;

  const dateKey = date || new Date().toISOString().split('T')[0];

  const existing = activityStore.get(dateKey) || {
    id: uuid(),
    date: dateKey,
    calories: 0,
    steps: 0,
    vitamins: [],
    medications: [],
  };

  // Merge: accumulate calories and steps, union unique vitamins/meds
  const merged = {
    ...existing,
    calories: existing.calories + Number(calories),
    steps:    existing.steps    + Number(steps),
    vitamins:    [...new Set([...existing.vitamins,    ...vitamins])],
    medications: [...new Set([...existing.medications, ...medications])],
    updatedAt: new Date().toISOString(),
  };

  activityStore.set(dateKey, merged);

  return res.status(201).json({ message: 'Activity logged successfully.', data: merged });
});

/**
 * GET /api/activity/today
 */
router.get('/today', (_req, res) => {
  const dateKey = new Date().toISOString().split('T')[0];
  const log = activityStore.get(dateKey) || {
    date: dateKey, calories: 0, steps: 0, vitamins: [], medications: [],
  };
  return res.json(log);
});

/**
 * GET /api/activity/history — returns last 7 days
 */
router.get('/history', (_req, res) => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    result.push(activityStore.get(key) || { date: key, calories: 0, steps: 0, vitamins: [], medications: [] });
  }
  return res.json(result);
});

module.exports = router;
