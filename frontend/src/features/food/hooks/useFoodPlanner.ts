import { useState, useCallback, useMemo, useEffect } from 'react';
import type { GeneratedRecipe } from '../services/aiService';
import { apiClient } from '../../../services/apiClient';

// ============================================================
// Types
// ============================================================

export interface PantryItem {
  id: string;
  name: string;
  category: 'Vegetables' | 'Proteins' | 'Grains' | 'Dairy' | 'Condiments' | 'Snacks' | 'Other';
  qty: string;
  expiryDays: number; // days until expiry
  status: 'Stocked' | 'Low Stock' | 'Expiring Soon';
}

export interface GroceryItem {
  id: string;
  name: string;
  qty: string;
  category: string;
  reason: string; // 'From Recipe' | 'Low Stock' | 'Manual'
  checked: boolean;
  addedAt: Date;
}

export interface MealEntry {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged: boolean;
}

export interface NutritionLog {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number; // glasses
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number; // glasses
}

// ============================================================
// Default Data
// ============================================================

const DEFAULT_PANTRY: PantryItem[] = [
  { id: '1', name: 'Chicken Breast', category: 'Proteins', qty: '800g', expiryDays: 3, status: 'Stocked' },
  { id: '2', name: 'Baby Spinach', category: 'Vegetables', qty: '1 bag', expiryDays: 1, status: 'Expiring Soon' },
  { id: '3', name: 'Eggs', category: 'Proteins', qty: '3 left', expiryDays: 5, status: 'Low Stock' },
  { id: '4', name: 'Brown Rice', category: 'Grains', qty: '2 kg', expiryDays: 180, status: 'Stocked' },
  { id: '5', name: 'Olive Oil', category: 'Condiments', qty: '1 bottle', expiryDays: 365, status: 'Stocked' },
  { id: '6', name: 'Garlic', category: 'Vegetables', qty: '1 head', expiryDays: 20, status: 'Stocked' },
  { id: '7', name: 'Salmon Fillet', category: 'Proteins', qty: '400g', expiryDays: 2, status: 'Expiring Soon' },
  { id: '8', name: 'Chickpeas (can)', category: 'Proteins', qty: '2 cans', expiryDays: 730, status: 'Stocked' },
  { id: '9', name: 'Cherry Tomatoes', category: 'Vegetables', qty: '250g', expiryDays: 4, status: 'Stocked' },
  { id: '10', name: 'Greek Yogurt', category: 'Dairy', qty: '500g', expiryDays: 6, status: 'Stocked' },
];

const DEFAULT_GROCERY: GroceryItem[] = [
  { id: 'g1', name: 'Feta Cheese', qty: '200g', category: 'Dairy', reason: 'From Recipe', checked: false, addedAt: new Date() },
  { id: 'g2', name: 'Avocado', qty: '2 units', category: 'Vegetables', reason: 'Meal Plan', checked: false, addedAt: new Date() },
  { id: 'g3', name: 'Lemon', qty: '3 units', category: 'Vegetables', reason: 'Low Stock', checked: true, addedAt: new Date() },
];

const DEFAULT_MEALS: MealEntry[] = [
  { id: 'm1', mealType: 'Breakfast', name: 'Avocado Toast + Poached Egg', calories: 320, protein: 14, carbs: 32, fat: 16, logged: true },
  { id: 'm2', mealType: 'Lunch', name: 'Grilled Chicken Quinoa Bowl', calories: 540, protein: 45, carbs: 48, fat: 12, logged: true },
  { id: 'm3', mealType: 'Dinner', name: 'Salmon & Asparagus', calories: 480, protein: 42, carbs: 18, fat: 22, logged: false },
  { id: 'm4', mealType: 'Snack', name: 'Greek Yogurt + Berries', calories: 180, protein: 12, carbs: 22, fat: 3, logged: false },
];

const DEFAULT_NUTRITION_HISTORY: NutritionLog[] = [
  { date: 'Mon', calories: 2050, protein: 118, carbs: 210, fat: 68, fiber: 24, water: 7 },
  { date: 'Tue', calories: 2200, protein: 130, carbs: 240, fat: 72, fiber: 28, water: 8 },
  { date: 'Wed', calories: 1850, protein: 105, carbs: 195, fat: 60, fiber: 18, water: 6 },
  { date: 'Thu', calories: 2180, protein: 125, carbs: 230, fat: 70, fiber: 26, water: 8 },
  { date: 'Fri', calories: 2300, protein: 140, carbs: 250, fat: 75, fiber: 30, water: 9 },
  { date: 'Sat', calories: 1700, protein: 88, carbs: 180, fat: 55, fiber: 15, water: 5 },
  { date: 'Sun', calories: 1980, protein: 110, carbs: 205, fat: 65, fiber: 22, water: 7 },
];

const DEFAULT_GOALS: DailyGoals = {
  calories: 2200,
  protein: 130,
  carbs: 250,
  fat: 75,
  fiber: 30,
  water: 8,
};

// ============================================================
// Unified Food Planner Store
// ============================================================

export const useFoodPlanner = () => {
  // ── Pantry State ──────────────────────────────────────────
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pantry, grocery, meals, nutrition] = await Promise.all([
          apiClient<PantryItem[]>('/food/pantry'),
          apiClient<GroceryItem[]>('/food/grocery'),
          apiClient<MealEntry[]>('/food/meals'),
          apiClient<NutritionLog[]>('/food/nutrition')
        ]);
        setPantryItems(pantry);
        setGroceryList(grocery);
        setTodayMeals(meals);
        // setNutritionHistory(nutrition); // Need state for this
      } catch (err) {
        console.error("Failed to fetch food data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addPantryItem = useCallback(async (item: Omit<PantryItem, 'id' | '_id'>) => {
    try {
      const newItem = await apiClient<PantryItem>('/food/pantry', { method: 'POST', data: item });
      setPantryItems(prev => [...prev, { ...newItem, id: (newItem as any)._id }]);
    } catch (err) { console.error(err); }
  }, []);

  const removePantryItem = useCallback(async (id: string) => {
    try {
      await apiClient(`/food/pantry/${id}`, { method: 'DELETE' });
      setPantryItems(prev => prev.filter(i => i.id !== id && (i as any)._id !== id));
    } catch (err) { console.error(err); }
  }, []);

  const updatePantryItem = useCallback(async (id: string, updates: Partial<PantryItem>) => {
    try {
      const updated = await apiClient<PantryItem>(`/food/pantry/${id}`, { method: 'PUT', data: updates });
      setPantryItems(prev => prev.map(i => (i.id === id || (i as any)._id === id) ? { ...updated, id: (updated as any)._id } : i));
    } catch (err) { console.error(err); }
  }, []);

  // ── Grocery State ─────────────────────────────────────────
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);

  const addToGrocery = useCallback(async (items: Omit<GroceryItem, 'id' | 'addedAt' | 'checked'>[]) => {
    try {
      const result = await apiClient<GroceryItem[]>('/food/grocery', { method: 'POST', data: items });
      const newItems = Array.isArray(result) ? result : [result];
      setGroceryList(prev => [...prev, ...newItems.map(i => ({...i, id: (i as any)._id}))]);
      return newItems.length;
    } catch (err) { console.error(err); return 0; }
  }, []);

  const toggleGroceryItem = useCallback(async (id: string) => {
    const item = groceryList.find(i => i.id === id || (i as any)._id === id);
    if (!item) return;
    try {
      await apiClient(`/food/grocery/${id}`, { method: 'PUT', data: { checked: !item.checked } });
      setGroceryList(prev => prev.map(i => (i.id === id || (i as any)._id === id) ? { ...i, checked: !i.checked } : i));
    } catch (err) { console.error(err); }
  }, [groceryList]);

  const removeGroceryItem = useCallback(async (id: string) => {
    try {
      await apiClient(`/food/grocery/${id}`, { method: 'DELETE' });
      setGroceryList(prev => prev.filter(i => i.id !== id && (i as any)._id !== id));
    } catch (err) { console.error(err); }
  }, []);

  const purchaseCheckedItems = useCallback(() => {
    const checked = groceryList.filter(i => i.checked);
    // Add purchased items to pantry
    checked.forEach(item => {
      setPantryItems(prev => {
        const exists = prev.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        if (exists) return prev; // Already in pantry
        return [...prev, {
          id: `p${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name: item.name,
          category: 'Other' as const,
          qty: item.qty,
          expiryDays: 7,
          status: 'Stocked' as const,
        }];
      });
    });
    setGroceryList(prev => prev.filter(i => !i.checked));
  }, [groceryList]);

  // ── Meal Plan State ───────────────────────────────────────
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<string[][]>([]);

  const logMeal = useCallback(async (mealId: string) => {
    try {
      await apiClient(`/food/meals/${mealId}`, { method: 'PUT', data: { logged: true } });
      setTodayMeals(prev => prev.map(m => (m.id === mealId || (m as any)._id === mealId) ? { ...m, logged: true } : m));
    } catch (err) { console.error(err); }
  }, []);

  const addMealToDay = useCallback(async (meal: Omit<MealEntry, 'id'>) => {
    try {
      const result = await apiClient<MealEntry>('/food/meals', { method: 'POST', data: meal });
      setTodayMeals(prev => [...prev, { ...result, id: (result as any)._id }]);
    } catch (err) { console.error(err); }
  }, []);

  // ── Saved Recipes ─────────────────────────────────────────
  const [savedRecipes, setSavedRecipes] = useState<GeneratedRecipe[]>([]);

  const saveRecipe = useCallback((recipe: GeneratedRecipe) => {
    setSavedRecipes(prev => {
      const exists = prev.find(r => r.id === recipe.id);
      if (exists) return prev;
      return [recipe, ...prev];
    });
  }, []);

  const removeSavedRecipe = useCallback((id: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  }, []);

  // ── Nutrition Data ────────────────────────────────────────
  const [nutritionHistory] = useState<NutritionLog[]>(DEFAULT_NUTRITION_HISTORY);
  const [dailyGoals] = useState<DailyGoals>(DEFAULT_GOALS);
  const [waterIntake, setWaterIntake] = useState(5); // glasses today

  const addWater = useCallback(() => {
    setWaterIntake(prev => Math.min(prev + 1, 15));
  }, []);

  // ── Computed Daily Stats ──────────────────────────────────
  const dailyStats = useMemo(() => {
    const logged = todayMeals.filter(m => m.logged);
    return {
      calories: logged.reduce((sum, m) => sum + m.calories, 0),
      protein: logged.reduce((sum, m) => sum + m.protein, 0),
      carbs: logged.reduce((sum, m) => sum + m.carbs, 0),
      fat: logged.reduce((sum, m) => sum + m.fat, 0),
      mealsLogged: logged.length,
      totalMeals: todayMeals.length,
    };
  }, [todayMeals]);

  // ── Alerts ───────────────────────────────────────────────
  const pantryAlerts = useMemo(() => ({
    expiring: pantryItems.filter(i => i.status === 'Expiring Soon'),
    lowStock: pantryItems.filter(i => i.status === 'Low Stock'),
  }), [pantryItems]);

  const pantryIngredientNames = useMemo(() =>
    pantryItems.map(i => i.name.toLowerCase()),
    [pantryItems]
  );

  return {
    // Pantry
    pantryItems,
    addPantryItem,
    removePantryItem,
    updatePantryItem,
    pantryIngredientNames,

    // Grocery
    groceryList,
    addToGrocery,
    toggleGroceryItem,
    removeGroceryItem,
    purchaseCheckedItems,

    // Meals
    todayMeals,
    logMeal,
    addMealToDay,
    weeklyPlan,
    setWeeklyPlan,

    // Recipes
    savedRecipes,
    saveRecipe,
    removeSavedRecipe,

    // Nutrition
    nutritionHistory,
    dailyGoals,
    waterIntake,
    addWater,

    // Computed
    dailyStats,
    pantryAlerts,
  };
};
