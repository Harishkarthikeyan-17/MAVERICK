const express = require('express');
const router = express.Router();
const { Task, RecurringTask, Gamification } = require('../models/Planner');

const getUserId = (req) => req.user?.id || 'default_user';

// --- TASKS ---
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: getUserId(req) }).sort({ date: 1, startTime: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const task = new Task({ ...req.body, userId: getUserId(req) });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RECURRING TASKS ---
router.get('/recurring', async (req, res) => {
    try {
        const tasks = await RecurringTask.find({ userId: getUserId(req) });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/recurring', async (req, res) => {
    try {
        const task = new RecurringTask({ ...req.body, userId: getUserId(req) });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/recurring/:id', async (req, res) => {
    try {
        await RecurringTask.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GAMIFICATION ---
router.get('/gamification', async (req, res) => {
    try {
        let stats = await Gamification.findOne({ userId: getUserId(req) });
        if (!stats) {
            stats = new Gamification({ userId: getUserId(req) });
            await stats.save();
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/gamification', async (req, res) => {
    try {
        const stats = await Gamification.findOneAndUpdate(
            { userId: getUserId(req) },
            { $set: req.body },
            { new: true, upsert: true }
        );
        res.json(stats);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
