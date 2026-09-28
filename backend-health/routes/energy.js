/**
 * routes/energy.js
 * POST /api/energy/calculate — calculate energy level score
 */

const express = require('express');
const router = express.Router();

// In-memory store for last energy calculation
let lastEnergyReading = null;

/**
 * POST /api/energy/calculate
 * Body: { activitySteps: number, sleepHours: number, caloriesConsumed: number }
 * Formula: energy = (steps/10000 + sleep/8 + calories/2000) / 3 * 100
 */
router.post('/calculate', (req, res) => {
  const { activitySteps, sleepHours, caloriesConsumed } = req.body;

  if (activitySteps == null || sleepHours == null || caloriesConsumed == null) {
    return res.status(400).json({ error: 'activitySteps, sleepHours, and caloriesConsumed are required.' });
  }

  const steps    = Number(activitySteps);
  const sleep    = Number(sleepHours);
  const calories = Number(caloriesConsumed);

  if ([steps, sleep, calories].some(isNaN)) {
    return res.status(400).json({ error: 'All fields must be valid numbers.' });
  }

  // Energy formula (capped at 100)
  const rawScore = ((steps / 10000) + (sleep / 8) + (calories / 2000)) / 3 * 100;
  const score    = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Classify level
  let level = 'Low';
  if (score >= 40 && score < 60) level = 'Moderate';
  else if (score >= 60 && score < 80) level = 'High';
  else if (score >= 80)               level = 'Peak';

  const messages = {
    Low:      'Your energy is low. Rest, hydrate, and eat a balanced meal.',
    Moderate: 'Moderate energy — a light walk or snack may boost you.',
    High:     'High energy levels — great time to exercise!',
    Peak:     'You\'re at peak energy! Push for your best performance.',
  };

  lastEnergyReading = {
    score,
    level,
    activitySteps: steps,
    sleepHours: sleep,
    caloriesConsumed: calories,
    message: messages[level],
    timestamp: new Date().toISOString(),
  };

  return res.json(lastEnergyReading);
});

/** GET /api/energy/latest — retrieve last energy computation */
router.get('/latest', (_req, res) => {
  if (!lastEnergyReading) return res.json(null);
  return res.json(lastEnergyReading);
});

module.exports = router;
