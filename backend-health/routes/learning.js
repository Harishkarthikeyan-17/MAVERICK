const express = require('express');
const router = express.Router();
const { Skill, LearningGoal, FocusSession } = require('../models/Learning');

const getUserId = (req) => req.user?.id || 'default_user';

// --- SKILLS ---
router.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find({ userId: getUserId(req) }).sort({ createdAt: -1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/skills', async (req, res) => {
    try {
        const skill = new Skill({ ...req.body, userId: getUserId(req) });
        await skill.save();
        res.status(201).json(skill);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/skills/:id', async (req, res) => {
    try {
        const skill = await Skill.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(skill);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/skills/:id', async (req, res) => {
    try {
        await Skill.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GOALS ---
router.get('/goals', async (req, res) => {
    try {
        const goals = await LearningGoal.find({ userId: getUserId(req) }).populate('linkedSkillId');
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/goals', async (req, res) => {
    try {
        const goal = new LearningGoal({ ...req.body, userId: getUserId(req) });
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/goals/:id', async (req, res) => {
    try {
        const goal = await LearningGoal.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(goal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/goals/:id', async (req, res) => {
    try {
        await LearningGoal.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- FOCUS SESSIONS ---
router.get('/sessions', async (req, res) => {
    try {
        const sessions = await FocusSession.find({ userId: getUserId(req) }).sort({ startTime: -1 }).populate('skillId');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/sessions', async (req, res) => {
    try {
        const session = new FocusSession({ ...req.body, userId: getUserId(req) });
        await session.save();
        res.status(201).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
