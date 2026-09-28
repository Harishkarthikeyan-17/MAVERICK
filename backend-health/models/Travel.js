const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    readiness: { type: Number, default: 0 },
    budget: { type: Number, default: 0 }
});

const itinerarySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    day: { type: String, required: true }, // e.g. "Day 1"
    date: { type: String, required: true }, // YYYY-MM-DD
    activities: [{
        time: { type: String },
        title: { type: String, required: true },
        desc: { type: String },
        status: { type: String, enum: ['pending', 'active', 'done'], default: 'pending' }
    }]
});

const documentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    size: { type: String },
    type: { type: String, enum: ['PDF', 'IMAGE', 'DOC'], default: 'PDF' },
    url: { type: String } // S3 or local path
});

const Trip = mongoose.model('Trip', tripSchema);
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
const TravelDocument = mongoose.model('TravelDocument', documentSchema);

module.exports = { Trip, Itinerary, TravelDocument };
