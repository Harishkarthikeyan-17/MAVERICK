/**
 * routes/health.js
 * POST /api/health/stress  — calculate stress score from vitals
 * PUT  /api/health/watch-sync — simulate smartwatch data push
 */

const express = require('express');
const router = express.Router();

// In-memory store for last stress reading + watch data
let lastStressReading = null;
let watchData = { heartRate: 72, bloodPressure: 120, hrv: 60, steps: 8000 };

/**
 * POST /api/health/stress
 * Body: { heartRate: number, bloodPressure: number, hrv: number }
 * Formula: stress = ((HR/100) + (BP/200) + (100-HRV)/100) / 3 * 100
 */
router.post('/stress', (req, res) => {
  const { heartRate, bloodPressure, hrv } = req.body;

  // Validate inputs
  if (heartRate == null || bloodPressure == null || hrv == null) {
    return res.status(400).json({ error: 'heartRate, bloodPressure, and hrv are required.' });
  }

  const HR  = Number(heartRate);
  const BP  = Number(bloodPressure);
  const HRV = Number(hrv);

  if ([HR, BP, HRV].some(isNaN)) {
    return res.status(400).json({ error: 'All fields must be valid numbers.' });
  }

  // Stress formula
  const rawScore = ((HR / 100) + (BP / 200) + ((100 - HRV) / 100)) / 3 * 100;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Classify level
  let level = 'LOW';
  if (score >= 40 && score < 70) level = 'MODERATE';
  else if (score >= 70)           level = 'HIGH';

  const tips = {
    LOW:      'Great! Your stress levels are healthy. Keep up your routine.',
    MODERATE: 'Try deep breathing or a 5-minute walk to lower your stress.',
    HIGH:     'High stress detected. Consider meditation or a short break immediately.',
  };

  lastStressReading = { score, level, heartRate: HR, bloodPressure: BP, hrv: HRV, timestamp: new Date().toISOString() };

  return res.json({ score, level, tip: tips[level], timestamp: lastStressReading.timestamp });
});

/**
 * PUT /api/health/watch-sync
 * Body: { heartRate?, bloodPressure?, hrv?, steps? }
 * Simulates receiving data from a smartwatch
 */
router.put('/watch-sync', (req, res) => {
  const { heartRate, bloodPressure, hrv, steps } = req.body;

  // Merge provided fields
  if (heartRate    != null) watchData.heartRate    = Number(heartRate);
  if (bloodPressure != null) watchData.bloodPressure = Number(bloodPressure);
  if (hrv          != null) watchData.hrv          = Number(hrv);
  if (steps        != null) watchData.steps        = Number(steps);

  watchData.lastSync = new Date().toISOString();

  return res.json({ message: 'Smartwatch data synced successfully.', data: watchData });
});

/**
 * GET /api/health/watch-sync — retrieve latest watch data
 */
router.get('/watch-sync', (_req, res) => {
  return res.json(watchData);
});

/**
 * GET /api/health/stress — retrieve last stress reading (used by notifications)
 */
router.get('/stress', (_req, res) => {
  if (!lastStressReading) return res.json(null);
  return res.json(lastStressReading);
});

module.exports = router;
