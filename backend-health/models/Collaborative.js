const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Editor', 'Viewer'], default: 'Viewer' },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' }
});

const collabTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    assignedTo: { type: String }, // User ID or Name
    assignedBy: { type: String }, // User ID or Name
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});

const roomFileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    size: { type: String },
    url: { type: String }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    user: { type: String, required: true }, // name
    text: { type: String, required: true }
}, { timestamps: true });

const roomSchema = new mongoose.Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    accessType: { type: String, enum: ['View Only', 'View + Post', 'Full Collaboration'], default: 'Full Collaboration' },
    members: [memberSchema],
    tasks: [collabTaskSchema],
    files: [roomFileSchema],
    comments: [commentSchema],
    workspaceContent: { type: String, default: '' },
    isLocked: { type: Boolean, default: false }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = { Room };
