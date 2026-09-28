const express = require('express');
const router = express.Router();
const { Trip, Itinerary, TravelDocument } = require('../models/Travel');

const getUserId = (req) => req.user?.id || 'default_user';

// --- TRIPS ---
router.get('/trips', async (req, res) => {
    try {
        const trips = await Trip.find({ userId: getUserId(req) });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/trips', async (req, res) => {
    try {
        const trip = new Trip({ ...req.body, userId: getUserId(req) });
        await trip.save();
        res.status(201).json(trip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/trips/:id', async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(trip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- ITINERARIES ---
router.get('/itineraries/:tripId', async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ tripId: req.params.tripId, userId: getUserId(req) }).sort({ date: 1 });
        res.json(itineraries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/itineraries', async (req, res) => {
    try {
        const itinerary = new Itinerary({ ...req.body, userId: getUserId(req) });
        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/itineraries/:id', async (req, res) => {
    try {
        const itinerary = await Itinerary.findOneAndUpdate(
            { _id: req.params.id, userId: getUserId(req) },
            { $set: req.body },
            { new: true }
        );
        res.json(itinerary);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- DOCUMENTS ---
router.get('/documents/:tripId', async (req, res) => {
    try {
        const docs = await TravelDocument.find({ tripId: req.params.tripId, userId: getUserId(req) });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/documents', async (req, res) => {
    try {
        const doc = new TravelDocument({ ...req.body, userId: getUserId(req) });
        await doc.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
