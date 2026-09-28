import { apiClient } from '../../../services/apiClient';

export interface RecipeFromDishParams {
  dishName: string;
  cuisine: string;
  dietPreference: string;
  cookingTime: string;
  modifiers?: string[];
}

export interface RecipeFromIngredientsParams {
  ingredients: string[];
  dietPreference?: string;
  servings?: number;
  variation?: string;
}

export interface GeneratedRecipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookTime: number;
  servings: number;
  healthScore: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  tags: string[];
  aiInsight: string;
  matchScore?: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  inPantry: boolean;
}

export interface NutritionInsightParams {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterIntake: number;
  mealsLogged: number;
}

export interface WeeklyPlanParams {
  goal: string;
  dietPreference: string;
  calories: number;
  familySize: number;
}

// ── Generate recipe from dish name ──────────────────────────
export async function generateRecipeFromDish(
  params: RecipeFromDishParams,
  onStream?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<GeneratedRecipe> {
  const recipe = await apiClient<GeneratedRecipe>('/ai/generate-recipe', {
    method: 'POST',
    data: {
      mode: 'dish',
      dishName: params.dishName,
      cuisine: params.cuisine,
      dietPreference: params.dietPreference,
      cookingTime: params.cookingTime,
      modifiers: params.modifiers || [],
    },
    signal,
  });

  // Simulate streaming the description for UI effect
  if (onStream && recipe.description) {
    const words = recipe.description.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) break;
      await new Promise(resolve => setTimeout(resolve, 35));
      onStream(words[i] + (i < words.length - 1 ? ' ' : ''));
    }
  }

  return recipe;
}

// ── Generate recipe from ingredients ────────────────────────
export async function generateRecipeFromIngredients(
  params: RecipeFromIngredientsParams,
  onStream?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<GeneratedRecipe> {
  const recipe = await apiClient<GeneratedRecipe>('/ai/generate-recipe', {
    method: 'POST',
    data: {
      mode: 'ingredients',
      ingredients: params.ingredients,
      dietPreference: params.dietPreference || 'None',
      servings: params.servings || 2,
      variation: params.variation || null,
    },
    signal,
  });

  if (onStream && recipe.description) {
    const words = recipe.description.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) break;
      await new Promise(resolve => setTimeout(resolve, 35));
      onStream(words[i] + (i < words.length - 1 ? ' ' : ''));
    }
  }

  return recipe;
}

// ── Generate nutrition insight ───────────────────────────────
export async function generateNutritionInsight(
  params: NutritionInsightParams
): Promise<string> {
  try {
    const data = await apiClient<{ insight: string }>('/ai/nutrition-insight', {
      method: 'POST',
      data: params,
    });
    return data.insight;
  } catch (err) {
    return 'Unable to load insight right now. Check your nutrition stats below.';
  }
}

// ── Weekly meal plan (kept as static for now) ───────────────
export async function generateWeeklyMealPlan(
  params: WeeklyPlanParams
): Promise<string[][]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plans: Record<string, string[][]> = {
    'Muscle Gain': [
      ['Protein Oats + Eggs', 'Chicken Rice Bowl', 'Beef Stir Fry', 'Greek Yogurt'],
      ['Egg White Omelette', 'Tuna Pasta', 'Grilled Salmon', 'Cottage Cheese'],
      ['Protein Pancakes', 'Turkey Wrap', 'Chicken Curry + Rice', 'Almonds'],
      ['Scrambled Eggs + Toast', 'Salmon Salad', 'Beef & Broccoli', 'Protein Shake'],
      ['Oats + Banana', 'Chicken Quinoa', 'Prawn Stir Fry', 'Hard Boiled Eggs'],
      ['French Toast', 'Beef Bowl', 'Lamb Chops + Veggies', 'Cheese & Crackers'],
      ['Smoothie Bowl', 'Leftover Prep', 'Family Roast Chicken', 'Protein Bar'],
    ],
    'Fat Loss': [
      ['Veggie Omelette', 'Large Greek Salad', 'Grilled Fish + Steamed Veg', 'Apple + Nut Butter'],
      ['Overnight Oats', 'Lentil Soup', 'Chicken Lettuce Wraps', 'Celery + Hummus'],
      ['Poached Eggs + Spinach', 'Tuna Salad', 'Turkey Zoodles', 'Mixed Nuts'],
      ['Green Smoothie', 'Chickpea Salad', 'Baked Cod', 'Boiled Eggs'],
      ['Avocado Toast', 'Soup + Side Salad', 'Shrimp Stir Fry', 'Berries'],
      ['Oats + Berries', 'Veggie Bowl', 'Salmon + Asparagus', 'Rice Cakes'],
      ['Egg Muffins', 'Buddha Bowl', 'Chicken & Veggie Skewers', 'Edamame'],
    ],
    'Balanced': [
      ['Avocado Toast + Egg', 'Grilled Chicken Quinoa', 'Salmon & Asparagus', 'Banana'],
      ['Yogurt Parfait', 'Turkey Sandwich', 'Pasta Primavera', 'Trail Mix'],
      ['Smoothie Bowl', 'Veggie Wrap', 'Beef Tacos', 'Orange'],
      ['Oats + Fruits', 'Chicken Salad', 'Shrimp Pasta', 'Cheese'],
      ['Eggs Benedict', 'Lentil Bowl', 'Grilled Salmon', 'Apple'],
      ['French Toast', 'Caesar Salad + Chicken', 'Pizza (homemade)', 'Yogurt'],
      ['Pancakes', 'Sunday Roast', 'Light Dinner Soup', 'Dark Chocolate'],
    ],
  };

  return plans[params.goal] || plans['Balanced'];
}

// ── Retry wrapper ────────────────────────────────────────────
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = Math.pow(2, attempt) * 500;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retry attempts exceeded');
}