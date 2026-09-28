const express = require('express');
const router = express.Router();
const { Room } = require('../models/Collaborative');

const getUserId = (req) => req.user?.id || 'default_user';

// Get user's rooms (where they are a member)
router.get('/rooms', async (req, res) => {
    try {
        const userId = getUserId(req);
        const rooms = await Room.find({
            $or: [
                { ownerId: userId },
                { 'members.userId': userId }
            ]
        });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a room
router.post('/rooms', async (req, res) => {
    try {
        const userId = getUserId(req);
        // Ensure owner is added as admin member
        const members = req.body.members || [];
        if (!members.find(m => m.userId === userId)) {
            members.push({ userId, name: req.body.ownerName || 'Creator', role: 'Admin', status: 'online' });
        }
        
        const room = new Room({ 
            ...req.body, 
            ownerId: userId,
            members,
            // Generate unique code if not provided
            code: req.body.code || Math.random().toString(36).substr(2, 6).toUpperCase()
        });
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Join a room by code
router.post('/rooms/join', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { code, userName } = req.body;
        
        const room = await Room.findOne({ code });
        if (!room) return res.status(404).json({ error: 'Room not found' });
        
        // Check if already a member
        if (!room.members.find(m => m.userId === userId)) {
            room.members.push({
                userId,
                name: userName || 'New Member',
                role: 'Viewer', // Default role on join
                status: 'online'
            });
            await room.save();
        }
        
        res.json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific room
router.get('/rooms/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ error: 'Room not found' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update workspace content
router.put('/rooms/:id/workspace', async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: { workspaceContent: req.body.content } },
            { new: true }
        );
        res.json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add comment
router.post('/rooms/:id/comments', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ error: 'Room not found' });
        
        const newComment = {
            userId: getUserId(req),
            user: req.body.user,
            text: req.body.text
        };
        
        room.comments.push(newComment);
        await room.save();
        res.status(201).json(room.comments[room.comments.length - 1]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
