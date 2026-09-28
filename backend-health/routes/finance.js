const express = require('express');
const router = express.Router();
const { Transaction, Budget, Loan, FinanceGoal } = require('../models/Finance');

// Middleware to mock userId for now, since we aren't enforcing JWT fully yet in all requests
// Assuming req.user is set by authMiddleware
const getUserId = (req) => req.user?.id || 'default_user';

// --- TRANSACTIONS ---
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: getUserId(req) }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/transactions', async (req, res) => {
    try {
        const newTx = new Transaction({ ...req.body, userId: getUserId(req) });
        await newTx.save();
        res.status(201).json(newTx);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/transactions/:id', async (req, res) => {
    try {
        await Transaction.findOneAndDelete({ _id: req.params.id, userId: getUserId(req) });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- BUDGETS ---
router.get('/budgets', async (req, res) => {
    try {
        const month = req.query.month || new Date().toISOString().slice(0, 7); // YYYY-MM
        const budgets = await Budget.find({ userId: getUserId(req), month });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/budgets/:category', async (req, res) => {
    try {
        const month = req.body.month || new Date().toISOString().slice(0, 7);
        const budget = await Budget.findOneAndUpdate(
            { userId: getUserId(req), category: req.params.category, month },
            { $set: { allocated: req.body.allocated, spent: req.body.spent } },
            { new: true, upsert: true }
        );
        res.json(budget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- GOALS ---
router.get('/goals', async (req, res) => {
    try {
        const goals = await FinanceGoal.find({ userId: getUserId(req) });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/goals', async (req, res) => {
    try {
        const goal = new FinanceGoal({ ...req.body, userId: getUserId(req) });
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/goals/:id', async (req, res) => {
    try {
        const goal = await FinanceGoal.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(goal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
