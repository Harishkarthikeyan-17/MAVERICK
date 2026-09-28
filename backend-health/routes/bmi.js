/**
 * routes/bmi.js
 * POST /api/bmi/calculate — calculate BMI + category + ideal range
 */

const express = require('express');
const router = express.Router();

/**
 * POST /api/bmi/calculate
 * Body: { weight: number (kg), height: number (cm) }
 */
router.post('/calculate', (req, res) => {
  const { weight, height } = req.body;

  if (weight == null || height == null) {
    return res.status(400).json({ error: 'weight (kg) and height (cm) are required.' });
  }

  const w = Number(weight);
  const h = Number(height);

  if (isNaN(w) || isNaN(h) || h <= 0 || w <= 0) {
    return res.status(400).json({ error: 'weight and height must be positive numbers.' });
  }

  // BMI formula
  const bmi = w / Math.pow(h / 100, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;

  // Category classification (WHO standards)
  let category = 'Normal weight';
  let color    = 'green';
  if (bmi < 18.5)             { category = 'Underweight';   color = 'blue';   }
  else if (bmi >= 25 && bmi < 30) { category = 'Overweight';    color = 'yellow'; }
  else if (bmi >= 30 && bmi < 35) { category = 'Obese (Class I)'; color = 'orange'; }
  else if (bmi >= 35)         { category = 'Obese (Class II+)'; color = 'red';  }

  // Ideal weight range for this height (BMI 18.5–24.9)
  const heightM       = h / 100;
  const idealMinKg    = Math.round(18.5 * heightM * heightM * 10) / 10;
  const idealMaxKg    = Math.round(24.9 * heightM * heightM * 10) / 10;
  const idealRange    = `${idealMinKg} – ${idealMaxKg} kg`;

  // Caloric advice
  const advice = {
    Underweight:        'Increase caloric intake with nutrient-dense foods and strength training.',
    'Normal weight':    'Maintain your balanced diet and regular exercise routine.',
    Overweight:         'Focus on a slight caloric deficit (300-500 kcal/day) and cardio workouts.',
    'Obese (Class I)':  'Consult a healthcare provider for a structured weight management plan.',
    'Obese (Class II+)':'Medical supervision recommended for safe weight loss.',
  };

  return res.json({
    bmi: bmiRounded,
    category,
    color,
    idealRange,
    advice: advice[category],
    weightKg:  w,
    heightCm:  h,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
