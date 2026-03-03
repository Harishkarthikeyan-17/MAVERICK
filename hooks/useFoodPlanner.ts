import { useState, useMemo } from 'react';
import { Ingredient, Dish, FoodPreference, MealPlanDay } from '../types';

// Mock DB of recipes for the "AI" engine
const RECIPE_DATABASE: Partial<Dish & { requiredIngredients: string[] }>[] = [
    { id: '1', name: 'Vegetable Stir Fry', time: 20, difficulty: 'Easy', healthTag: 'Balanced', calories: 350, requiredIngredients: ['vegetables', 'soy sauce', 'oil'], allergens: ['soy'], steps: ['Chop vegetables', 'Heat oil', 'Stir fry for 5 mins', 'Add sauce'] },
    { id: '2', name: 'Omelette', time: 10, difficulty: 'Easy', healthTag: 'High Protein', calories: 250, requiredIngredients: ['eggs', 'butter', 'pepper'], allergens: ['eggs', 'dairy'], steps: ['Beat eggs', 'Heat butter', 'Cook until fluffy'] },
    { id: '3', name: 'Grilled Chicken Salad', time: 25, difficulty: 'Medium', healthTag: 'High Protein', calories: 400, requiredIngredients: ['chicken', 'lettuce', 'tomato', 'dressing'], allergens: [], steps: ['Grill chicken', 'Toss salad', 'Combine'] },
    { id: '4', name: 'Pasta Primavera', time: 30, difficulty: 'Medium', healthTag: 'Comfort', calories: 500, requiredIngredients: ['pasta', 'vegetables', 'cream'], allergens: ['gluten', 'dairy'], steps: ['Boil pasta', 'Sauté veggies', 'Mix with cream'] },
    { id: '5', name: 'Dal Tadka & Rice', time: 40, difficulty: 'Medium', healthTag: 'Balanced', calories: 450, requiredIngredients: ['dal', 'rice', 'spices'], allergens: [], steps: ['Boil dal', 'Prepare tadka', 'Serve with rice'] },
    { id: '6', name: 'Avocado Toast', time: 10, difficulty: 'Easy', healthTag: 'Balanced', calories: 300, requiredIngredients: ['bread', 'avocado', 'salt'], allergens: ['gluten'], steps: ['Toast bread', 'Mash avocado', 'Season'] },
];

export const useFoodPlanner = () => {
    // State
    const [pantry, setPantry] = useState<Ingredient[]>([]);
    const [preferences, setPreferences] = useState<FoodPreference>({
        diet: 'None',
        allergies: [],
        peopleCount: 2,
        cookingTime: 'Medium (30-60m)'
    });
    const [cookingHistory, setCookingHistory] = useState<number[]>([1, 1, 0, 1, 1, 1, 0]); // Last 7 days binary

    // 1. Available Ingredients Input
    const addIngredient = (name: string) => {
        if (!name.trim()) return;
        setPantry(prev => [...prev, {
            id: Date.now().toString(),
            name: name.trim(),
            category: 'Other',
            expiryStatus: 'Good'
        }]);
    };

    const removeIngredient = (id: string) => {
        setPantry(prev => prev.filter(i => i.id !== id));
    };

    // 3. AI Dish Generation Engine
    const generatedDishes = useMemo(() => {
        const pantryNames = pantry.map(p => p.name.toLowerCase());

        return RECIPE_DATABASE.map(recipe => {
            // Check ingredient match
            const required = recipe.requiredIngredients || [];
            const missing = required.filter(req => !pantryNames.some(p => p.includes(req.toLowerCase())));
            const matchCount = required.length - missing.length;
            const matchScore = (matchCount / required.length) * 100;

            // Check Preference Match (Diet)
            if (preferences.diet === 'Vegetarian' && (recipe.requiredIngredients?.includes('chicken') || recipe.requiredIngredients?.includes('meat'))) return null;
            if (preferences.diet === 'Vegan' && (recipe.requiredIngredients?.includes('eggs') || recipe.requiredIngredients?.includes('dairy') || recipe.requiredIngredients?.includes('cream'))) return null;

            // Check Allergies
            const hasAllergen = recipe.allergens?.some(a => preferences.allergies.includes(a));

            // Calculate Confidence (AI Logic)
            let confidence: 'High' | 'Medium' | 'Low' = 'High';
            if (recipe.healthTag === 'Comfort') confidence = 'Medium';
            if (hasAllergen) confidence = 'Low';

            return {
                ...recipe,
                matchScore,
                missingIngredients: missing,
                confidenceLevel: confidence,
                warning: hasAllergen ? `Contains ${recipe.allergens?.find(a => preferences.allergies.includes(a))}` : null
            } as Dish & { warning?: string };
        })
            .filter((d): d is Dish & { warning?: string } => d !== null)
            .sort((a, b) => b.matchScore - a.matchScore); // Best match first
    }, [pantry, preferences]);

    // 2. Substitutions
    const getSubstitutions = (ingredient: string) => {
        const map: Record<string, string[]> = {
            'cream': ['Greek Yogurt', 'Coconut Milk'],
            'butter': ['Olive Oil', 'Ghee'],
            'chicken': ['Tofu', 'Paneer', 'Mushrooms'],
            'sugar': ['Honey', 'Maple Syrup'],
            'bread': ['Rice Cake', 'Tortilla']
        };
        return map[ingredient.toLowerCase()] || [];
    };

    // 7. Smart Shopping List
    const shoppingList = useMemo(() => {
        const allMissing = generatedDishes.slice(0, 3).flatMap(d => d.missingIngredients); // From top 3 suggestions
        return Array.from(new Set(allMissing)); // Unique
    }, [generatedDishes]);

    // 8. Habit Consistency
    const consistencyScore = useMemo(() => {
        const cooked = cookingHistory.filter(Boolean).length;
        return Math.round((cooked / 7) * 100);
    }, [cookingHistory]);

    return {
        pantry,
        addIngredient,
        removeIngredient,
        preferences,
        setPreferences,
        generatedDishes,
        getSubstitutions,
        shoppingList,
        consistencyScore,
        cookingHistory
    };
};
