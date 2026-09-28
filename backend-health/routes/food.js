const express = require('express');
const router = express.Router();
const { PantryItem, GroceryItem, Meal, NutritionLog } = require('../models/Food');

const getUserId = (req) => req.user?.id || 'default_user';

// --- PANTRY ---
router.get('/pantry', async (req, res) => {
    try {
        const items = await PantryItem.find({ userId: getUserId(req) });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/pantry', async (req, res) => {
    try {
        const item = new PantryItem({ ...req.body, userId: getUserId(req) });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/pantry/:id', async (req, res) => {
    try {
        const item = await PantryItem.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/pantry/:id', async (req, res) => {
    try {
        await PantryItem.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GROCERY ---
router.get('/grocery', async (req, res) => {
    try {
        const items = await GroceryItem.find({ userId: getUserId(req) }).sort({ addedAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/grocery', async (req, res) => {
    try {
        const itemsToInsert = Array.isArray(req.body) ? req.body : [req.body];
        const newItems = itemsToInsert.map(i => ({ ...i, userId: getUserId(req) }));
        const result = await GroceryItem.insertMany(newItems);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/grocery/:id', async (req, res) => {
    try {
        const item = await GroceryItem.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/grocery/:id', async (req, res) => {
    try {
        await GroceryItem.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MEALS ---
router.get('/meals', async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const meals = await Meal.find({ userId: getUserId(req), date });
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/meals', async (req, res) => {
    try {
        const meal = new Meal({ ...req.body, userId: getUserId(req) });
        await meal.save();
        res.status(201).json(meal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/meals/:id', async (req, res) => {
    try {
        const meal = await Meal.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(meal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/meals/:id', async (req, res) => {
    try {
        await Meal.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NUTRITION LOG ---
router.get('/nutrition', async (req, res) => {
    try {
        // Return last 7 days
        const logs = await NutritionLog.find({ userId: getUserId(req) }).sort({ date: -1 }).limit(7);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
