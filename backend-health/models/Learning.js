const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    sectorId: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    masteryLevel: { type: String, enum: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Novice' },
    confidenceScore: { type: Number, min: 1, max: 10, default: 1 },
    hoursLogged: { type: Number, default: 0 },
    lastPracticed: { type: Date },
    dailyTime: { type: Number, default: 0 }, // in minutes
    weeklyGoal: { type: Number, default: 0 }, // in hours
    monthlyGoal: { type: Number, default: 0 }, // in hours
    deadline: { type: Date },
    weakAreas: [{ type: String }],
    nextTopics: [{ type: String }]
}, { timestamps: true });

const learningGoalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual', 'Lifetime'], required: true },
    linkedSkillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    targetDate: { type: Date, required: true },
    progressPercent: { type: Number, default: 0 },
    status: { type: String, enum: ['Not Started', 'Active', 'At Risk', 'Behind', 'Completed', 'Paused'], default: 'Not Started' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' }
}, { timestamps: true });

const focusSessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    plannedDuration: { type: Number, required: true }, // minutes
    actualDuration: { type: Number, default: 0 }, // minutes
    distractions: [{ type: String }],
    qualityScore: { type: Number, min: 1, max: 5 },
    sessionType: { type: String, enum: ['Learning', 'Practice', 'Review', 'Project', 'Reading'], required: true }
});

const Skill = mongoose.model('Skill', skillSchema);
const LearningGoal = mongoose.model('LearningGoal', learningGoalSchema);
const FocusSession = mongoose.model('FocusSession', focusSessionSchema);

module.exports = { Skill, LearningGoal, FocusSession };
