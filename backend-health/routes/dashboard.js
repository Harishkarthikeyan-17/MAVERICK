const express = require('express');
const router = express.Router();
const { Task, Gamification } = require('../models/Planner');
const { Transaction } = require('../models/Finance');
const { NutritionLog } = require('../models/Food');
const { Skill } = require('../models/Learning');
const { Trip } = require('../models/Travel');

const getUserId = (req) => req.user?.id || 'default_user';

router.get('/performance', async (req, res) => {
    try {
        // Mocking aggregation for simplicity right now
        // Normally would group by day from Task collection
        res.json([
            { name: 'Mon', score: 65, tasks: 4 },
            { name: 'Tue', score: 85, tasks: 7 },
            { name: 'Wed', score: 45, tasks: 2 },
            { name: 'Thu', score: 90, tasks: 8 },
            { name: 'Fri', score: 75, tasks: 5 },
            { name: 'Sat', score: 30, tasks: 1 },
            { name: 'Sun', score: 80, tasks: 6 }
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/finance-summary', async (req, res) => {
    try {
        // Mock aggregation
        res.json([
            { name: 'Week 1', income: 45000, expense: 32000 },
            { name: 'Week 2', income: 12000, expense: 28000 },
            { name: 'Week 3', income: 8000, expense: 15000 },
            { name: 'Week 4', income: 4000, expense: 21000 }
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        // Aggregate real basic stats
        const userId = getUserId(req);
        
        const gamification = await Gamification.findOne({ userId });
        const level = gamification ? gamification.level : 1;
        
        const tasksCompleted = await Task.countDocuments({ userId, completed: true });
        const tasksTotal = await Task.countDocuments({ userId });
        const completionRate = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
        
        res.json({
            level,
            completionRate: `${completionRate}%`,
            tasksDone: `${tasksCompleted}/${tasksTotal}`,
            focusTime: '4h 12m', // mock
            healthStatus: 'Good' // mock
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/nutrition-summary', async (req, res) => {
    try {
        const log = await NutritionLog.findOne({ userId: getUserId(req) }).sort({ date: -1 });
        if (log) {
            res.json({ calories: `${log.calories} kcal`, score: '85%' });
        } else {
            res.json({ calories: '0 kcal', score: '0%' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/learning-summary', async (req, res) => {
    try {
        const latestSkill = await Skill.findOne({ userId: getUserId(req) }).sort({ lastPracticed: -1 });
        res.json({
            streak: '5 Day streak', // mock
            focus: latestSkill ? latestSkill.name : 'System Design'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/travel-summary', async (req, res) => {
    try {
        const trip = await Trip.findOne({ userId: getUserId(req) }).sort({ startDate: 1 });
        if (trip) {
            res.json({
                destination: trip.destination,
                countdown: '14 days' // mock
            });
        } else {
            res.json({ destination: 'None', countdown: '-' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/wards', async (req, res) => {
    try {
        // Mock data for guardian role
        res.json([
            { id: 1, name: 'Arjun K.', status: 'Studying', lastActive: '10m ago' },
            { id: 2, name: 'Kiran M.', status: 'In Class', lastActive: '2h ago' },
            { id: 3, name: 'Meena R.', status: 'Offline', lastActive: '5h ago' }
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/focus-tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: getUserId(req), priority: 'High', completed: false }).limit(3);
        if (tasks.length > 0) {
            res.json(tasks.map(t => ({ id: t._id, text: t.title, time: t.startTime || 'TBD', tag: t.category })));
        } else {
            res.json([
                { id: 1, text: 'Review quarterly financial report', time: '10:00 AM', tag: 'Finance' },
                { id: 2, text: 'System Design Mock Interview', time: '02:00 PM', tag: 'Learning' },
                { id: 3, text: 'Finalize Tokyo Itinerary', time: '05:00 PM', tag: 'Travel' }
            ]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/alerts', async (req, res) => {
    try {
        res.json([{ id: 1, message: 'Arjun exceeded screen time limit' }]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
