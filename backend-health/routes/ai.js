const express = require('express');
const router = express.Router();
const { generateCompletion, generateChat } = require('../ai/groqClient');
const { getAISuggestion } = require('../ai/geminiClient');
// POST /api/ai/generate-recipe
router.post('/generate-recipe', async (req, res) => {
  const { mode, dishName, cuisine, dietPreference, cookingTime, modifiers, ingredients, variation } = req.body;

  try {
    let prompt = '';

    if (mode === 'dish') {
      prompt = `You are a professional chef and nutritionist. Generate a detailed recipe for: "${dishName}"
Cuisine: ${cuisine || 'Any'}
Diet: ${dietPreference || 'None'}
Cooking Time: ${cookingTime || 'Any'}
${modifiers && modifiers.length > 0 ? `Modifications: ${modifiers.join(', ')}` : ''}

Respond ONLY with a valid JSON object. No markdown, no backticks, no explanation before or after. Use exactly this structure:
{
  "title": "string",
  "description": "2-3 sentence description",
  "cuisine": "string",
  "difficulty": "Easy",
  "cookTime": 30,
  "servings": 2,
  "healthScore": 85,
  "calories": 450,
  "protein": 35,
  "carbs": 40,
  "fat": 15,
  "fiber": 6,
  "ingredients": [{ "name": "string", "amount": "string", "inPantry": false }],
  "instructions": ["step 1", "step 2"],
  "tags": ["tag1", "tag2"],
  "aiInsight": "one sentence nutritional insight"
}`;

    } else if (mode === 'ingredients') {
      const randomStyles = ['stir fry', 'soup', 'salad', 'curry', 'baked dish', 'grilled dish', 'pasta', 'wrap', 'rice bowl', 'stew', 'omelette', 'casserole'];
      const randomCuisines = ['Indian', 'Italian', 'Mexican', 'Japanese', 'Thai', 'Mediterranean', 'Chinese', 'Korean', 'American', 'Greek', 'French', 'Middle Eastern'];
      const randomStyle = randomStyles[Math.floor(Math.random() * randomStyles.length)];
      const randomCuisine = randomCuisines[Math.floor(Math.random() * randomCuisines.length)];

      prompt = `You are a creative professional chef. The user has these ingredients: ${ingredients.join(', ')}.

${variation
  ? `REQUIREMENT: You MUST suggest a ${randomCuisine}-style ${randomStyle}. This is your ONLY option. Do NOT suggest anything else. Be creative and use the ingredients in an unexpected way for this specific style.`
  : 'Suggest the single best dish the user can make with these ingredients.'}

Respond ONLY with a valid JSON object. No markdown, no backticks, no explanation before or after. Use exactly this structure:
{
  "title": "string",
  "description": "2-3 sentence description",
  "cuisine": "string",
  "difficulty": "Easy",
  "cookTime": 20,
  "servings": 2,
  "healthScore": 88,
  "calories": 380,
  "protein": 20,
  "carbs": 45,
  "fat": 12,
  "fiber": 8,
  "ingredients": [{ "name": "string", "amount": "string", "inPantry": true }],
  "instructions": ["step 1", "step 2"],
  "tags": ["tag1", "tag2"],
  "aiInsight": "one sentence nutritional insight",
  "matchScore": 90
}`;

    } else {
      // describe mode
      prompt = `You are a professional chef and nutritionist. The user wants: "${dishName}"
Generate the perfect recipe that matches this description exactly.

Respond ONLY with a valid JSON object. No markdown, no backticks, no explanation before or after. Use exactly this structure:
{
  "title": "string",
  "description": "2-3 sentence description",
  "cuisine": "string",
  "difficulty": "Easy",
  "cookTime": 30,
  "servings": 2,
  "healthScore": 85,
  "calories": 450,
  "protein": 35,
  "carbs": 40,
  "fat": 15,
  "fiber": 6,
  "ingredients": [{ "name": "string", "amount": "string", "inPantry": false }],
  "instructions": ["step 1", "step 2"],
  "tags": ["tag1", "tag2"],
  "aiInsight": "one sentence nutritional insight"
}`;
    }

    const raw = await generateCompletion(null, prompt, {
      maxTokens: 1500,
      temperature: variation ? 1.2 : 0.7
    });

    const clean = raw.replace(/```json|```/g, '').trim();
    const recipe = JSON.parse(clean);
    recipe.id = Date.now().toString();

    res.json(recipe);

  } catch (err) {
    console.error('[AI RECIPE ERROR]', err.message);
    res.status(500).json({ error: 'Failed to generate recipe. Please try again.' });
  }
});

// POST /api/ai/nutrition-insight
router.post('/nutrition-insight', async (req, res) => {
  const { calories, protein, carbs, fat, fiber, waterIntake, mealsLogged } = req.body;

  try {
    const prompt = `You are a nutrition coach. Based on today's intake:
- Calories: ${calories} kcal
- Protein: ${protein}g
- Carbs: ${carbs}g
- Fat: ${fat}g
- Fiber: ${fiber}g
- Water: ${waterIntake} glasses
- Meals logged: ${mealsLogged}

Give a single short paragraph (2-3 sentences max) of specific, actionable nutrition advice for today. Be direct and personal. No generic advice. Respond with plain text only, no formatting.`;

    const insight = await generateCompletion(null, prompt, {
      maxTokens: 200,
      temperature: 0.7
    });
    res.json({ insight });

  } catch (err) {
    console.error('[AI INSIGHT ERROR]', err.message);
    res.status(500).json({ error: 'Failed to generate insight.' });
  }
});
// POST /api/ai/finance-chat
router.post('/finance-chat', async (req, res) => {
  const { message, financials } = req.body;

  try {
    const { income, expense, savings, savingsRatio, totalScore, expenseByCategory } = financials;

    const topCategories = Object.entries(expenseByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: ₹${amt.toLocaleString('en-IN')}`)
      .join(', ');

    const systemContext = `You are an expert AI Financial Assistant for an Indian user. Here is their current financial data:
- Monthly Income: ₹${income.toLocaleString('en-IN')}
- Monthly Expenses: ₹${expense.toLocaleString('en-IN')}
- Monthly Savings: ₹${savings.toLocaleString('en-IN')}
- Savings Ratio: ${savingsRatio.toFixed(1)}%
- Financial Health Score: ${totalScore}/100
- Top Spending Categories: ${topCategories || 'No data yet'}

Rules:
- Always use Indian Rupee (₹) and Indian number formatting
- Give specific, actionable advice based on their actual numbers
- Be concise — 2-4 sentences max unless they ask for a breakdown
- Be encouraging but honest
- Never give generic advice — always reference their actual data
- If asked about affordability, calculate based on their savings and income
- Respond in plain text only, no markdown formatting, no bullet symbols`;

    const reply = await generateCompletion(systemContext, message, {
      maxTokens: 300,
      temperature: 0.7
    });

    res.json({ reply });

  } catch (err) {
    console.error('[FINANCE CHAT ERROR]', err.message);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});
// POST /api/ai/health-chat
router.post('/health-chat', async (req, res) => {
  const { message, healthData, conversationHistory } = req.body;

  try {
    const { heartRate, bloodPressure, hrv, steps, sleep, calories, stressScore, stressLevel, energyScore, energyLevel } = healthData;

    const systemContext = `You are MAVERICK Health AI, an expert health assistant. Here is the user's current health data:
- Heart Rate: ${heartRate} bpm (normal: 60-100)
- Blood Pressure: ${bloodPressure} mmHg (normal: <120)
- HRV: ${hrv} ms (optimal: 60-100)
- Steps Today: ${steps} (goal: 10,000)
- Sleep Last Night: ${sleep} hours (recommended: 7-9)
- Calories Burned: ${calories} kcal
- Stress Score: ${stressScore}/100 (${stressLevel} stress)
- Energy Score: ${energyScore}/100 (${energyLevel} vitality)

Rules:
- Give specific advice based on their actual numbers above
- Be concise — 2-4 sentences unless they ask for detail
- Be encouraging and supportive
- If stress is high, suggest breathing or rest
- If energy is low, suggest hydration, sleep, or light movement
- Never give generic advice — always reference their actual data
- You remember the conversation history so refer to previous messages when relevant
- Respond in plain text only, no markdown symbols`;

const messages = [
      ...(conversationHistory || []).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ];
    const reply = await generateChat([
        { role: 'system', content: systemContext },
        ...messages,
    ], {
      maxTokens: 300,
      temperature: 0.7
    });

    res.json({ reply });

  } catch (err) {
    console.error('[HEALTH CHAT ERROR]', err.message);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});

// POST /api/ai/health-insight
router.post('/health-insight', async (req, res) => {
  const { heartRate, bloodPressure, hrv, steps, sleep, calories, stressScore, stressLevel, energyScore } = req.body;

  try {
    const prompt = `You are a health coach. Based on these vitals:
- Heart Rate: ${heartRate} bpm
- Blood Pressure: ${bloodPressure} mmHg
- HRV: ${hrv} ms
- Steps: ${steps}
- Sleep: ${sleep} hours
- Calories burned: ${calories} kcal
- Stress Score: ${stressScore}/100 (${stressLevel})
- Energy Score: ${energyScore}/100

Give one specific, actionable health tip for right now based on the most concerning metric. 2 sentences max. Plain text only, no symbols.`;

    const insight = await generateCompletion(null, prompt, {
      maxTokens: 150,
      temperature: 0.7
    });

    res.json({ insight });

  } catch (err) {
    console.error('[HEALTH INSIGHT ERROR]', err.message);
    res.status(500).json({ error: 'Failed to generate insight.' });
  }
});

// POST /api/ai/chat (General chat for learning coach and doubt solver)
router.post('/chat', async (req, res) => {
  const { message, systemPrompt } = req.body;
  try {
    const reply = await generateCompletion(systemPrompt, message, {
      maxTokens: 500,
      temperature: 0.7
    });
    res.json({ reply });
  } catch (err) {
    console.error('[AI CHAT ERROR]', err.message);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
});

// POST /api/ai/travel-guidelines
router.post('/travel-guidelines', async (req, res) => {
  const { destination } = req.body;
  try {
    const prompt = `You are a travel expert. Provide travel guidelines for ${destination}. 
Return ONLY a valid JSON array of objects. Do not use markdown backticks.
Structure:
[
  { "category": "Entry & Visa", "rules": ["rule 1", "rule 2"] },
  { "category": "Local Etiquette", "rules": ["rule 1"] }
]
Maximum 4 categories, 3 rules each.`;
    
    const raw = await generateCompletion(null, prompt, { maxTokens: 500 });
    const clean = raw.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error('[TRAVEL AI ERROR]', err.message);
    res.status(500).json({ error: 'Failed to generate guidelines.' });
  }
});

// POST /api/ai/weekly-meal-plan
router.post('/weekly-meal-plan', async (req, res) => {
  const { goal, dietPreference, calories, familySize } = req.body;
  try {
    const prompt = `Create a 7-day meal plan (4 meals/day: Breakfast, Lunch, Dinner, Snack).
Goal: ${goal}
Diet: ${dietPreference}
Calories/day: ${calories}
Family size: ${familySize}
Return ONLY a valid JSON array of 7 arrays, where each inner array has exactly 4 string items (the meal names). No markdown.`;
    
    const raw = await generateCompletion(null, prompt, { maxTokens: 800 });
    const clean = raw.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error('[MEAL PLAN AI ERROR]', err.message);
    res.status(500).json({ error: 'Failed to generate meal plan.' });
  }
});

// POST /api/ai/gemini/health
router.post('/gemini/health', async (req, res) => {
  const { symptoms } = req.body;
  try {
    const reply = await getAISuggestion("Health Monitoring", `User symptoms: ${symptoms}. Provide non-emergency health advice.`);
    res.json({ reply });
  } catch (err) {
    console.error('[GEMINI HEALTH ERROR]', err);
    res.status(500).json({ error: 'Failed to generate health suggestion.' });
  }
});

// POST /api/ai/gemini/finance
router.post('/gemini/finance', async (req, res) => {
  const { concern, data } = req.body;
  try {
    const reply = await getAISuggestion("Finance Tracking", `User concern: ${concern}. Current Financials: ${JSON.stringify(data)}.`);
    res.json({ reply });
  } catch (err) {
    console.error('[GEMINI FINANCE ERROR]', err);
    res.status(500).json({ error: 'Failed to generate finance suggestion.' });
  }
});

// POST /api/ai/gemini/meal-plan
router.post('/gemini/meal-plan', async (req, res) => {
  const { ingredients, profile } = req.body;
  try {
    const reply = await getAISuggestion("Meal Planning", `Ingredients available: ${ingredients}. Health profile: ${profile}. Suggest a balanced meal.`);
    res.json({ reply });
  } catch (err) {
    console.error('[GEMINI MEAL PLAN ERROR]', err);
    res.status(500).json({ error: 'Failed to generate meal plan suggestion.' });
  }
});

module.exports = router;