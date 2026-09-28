const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['Vegetables', 'Proteins', 'Grains', 'Dairy', 'Condiments', 'Snacks', 'Other'], required: true },
    qty: { type: String, required: true },
    expiryDays: { type: Number },
    status: { type: String, enum: ['Stocked', 'Low Stock', 'Expiring Soon'], default: 'Stocked' }
});

const groceryItemSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: String, required: true },
    category: { type: String, default: 'Other' },
    reason: { type: String },
    checked: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
});

const mealSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    logged: { type: Boolean, default: false }
});

const nutritionLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    water: { type: Number, default: 0 } // glasses
});

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);
const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);
const Meal = mongoose.model('Meal', mealSchema);
const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);

module.exports = { PantryItem, GroceryItem, Meal, NutritionLog };
