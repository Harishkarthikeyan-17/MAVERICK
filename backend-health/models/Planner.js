const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String }, // HH:MM
    endTime: { type: String }, // HH:MM
    duration: { type: Number }, // in minutes
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    category: { type: String, enum: ['Work', 'Study', 'Health', 'Personal', 'Finance', 'Other'], default: 'Work' },
    completed: { type: Boolean, default: false },
    subtasks: [{ type: String }],
    notes: { type: String },
    location: { type: String, enum: ['Office', 'Home', 'Field', 'Travel'] }
});

const recurringTaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    startTime: { type: String }, // HH:MM
    endTime: { type: String }, // HH:MM
    duration: { type: Number },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    category: { type: String, enum: ['Work', 'Study', 'Health', 'Personal', 'Finance', 'Other'], default: 'Work' },
    pattern: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'], required: true },
    startDate: { type: String, required: true }, // YYYY-MM-DD
    endDate: { type: String },
    daysOfWeek: [{ type: Number }], // 0-6
    dayOfMonth: { type: Number } // 1-31
});

const gamificationSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: String } // YYYY-MM-DD
});

const Task = mongoose.model('Task', taskSchema);
const RecurringTask = mongoose.model('RecurringTask', recurringTaskSchema);
const Gamification = mongoose.model('Gamification', gamificationSchema);

module.exports = { Task, RecurringTask, Gamification };
