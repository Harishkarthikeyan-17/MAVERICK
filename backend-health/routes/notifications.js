/**
 * routes/notifications.js
 * GET /api/notifications — aggregate dynamic alerts from goals, meds, stress, energy
 */

const express = require('express');
const router  = express.Router();
const { v4: uuid } = require('uuid');

// Lazy-require routes so circular deps are avoided
const getGoals = () => {
  try { return require('./goals').getGoals(); } catch { return []; }
};

/**
 * GET /api/notifications
 * Dynamically builds alert list from:
 *   • Goals that are incomplete (progress < 100%)
 *   • Medications not yet logged today
 *   • Stress level (if last reading was HIGH)
 *   • Energy level (if last reading was Low)
 */
router.get('/', (_req, res) => {
  const notifications = [];

  // ── Goal alerts ──────────────────────────────────────────────────────────
  const goals = getGoals();
  goals.forEach((goal) => {
    const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
    if (!goal.completed && progress < 100) {
      notifications.push({
        id:       uuid(),
        type:     'GOAL',
        title:    `Goal Behind Schedule: ${goal.title}`,
        message:  `You are at ${progress}% of your ${goal.period} ${goal.category} goal. ${goal.targetValue - goal.currentValue} ${goal.unit} remaining.`,
        severity: progress < 30 ? 'high' : 'medium',
        icon:     'target',
        createdAt: new Date().toISOString(),
      });
    }
  });

  // ── Default medication reminder (always shown until synced) ──────────────
  notifications.push({
    id:       uuid(),
    type:     'MEDICATION',
    title:    'Medication Reminder',
    message:  'Check your vitamins & medications checklist for today.',
    severity: 'low',
    icon:     'pill',
    createdAt: new Date().toISOString(),
  });

  // ── Static stress + energy nudges (can be made dynamic via shared state) ─
  notifications.push({
    id:       uuid(),
    type:     'STRESS',
    title:    'Daily Stress Check-in',
    message:  'Have you logged your vitals today? Submit your heart rate and HRV for a stress analysis.',
    severity: 'low',
    icon:     'brain',
    createdAt: new Date().toISOString(),
  });

  notifications.push({
    id:       uuid(),
    type:     'ENERGY',
    title:    'Energy Level Tip',
    message:  'Stay hydrated and get 7–8 hours of sleep to maintain peak energy.',
    severity: 'low',
    icon:     'zap',
    createdAt: new Date().toISOString(),
  });

  // Sort: high > medium > low
  const severityOrder = { high: 0, medium: 1, low: 2 };
  notifications.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return res.json(notifications);
});

module.exports = router;
