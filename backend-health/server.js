/**
 * MAVERICK Health API — server.js
 * Express micro-service: port 5000
 * Uses in-memory storage (no DB required)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const apiRouter = require('./middleware/apiRouter');
const connectDB = require('./config/mongoDb');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(logger);

// ─── Routes ──────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);
app.use('/api', apiRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'MAVERICK Health API is running', port: PORT });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 MAVERICK Health API running at http://localhost:${PORT}`);
  console.log('📋 Available routes:');
  console.log('   POST /api/health/stress');
  console.log('   PUT  /api/health/watch-sync');
  console.log('   POST /api/energy/calculate');
  console.log('   POST /api/bmi/calculate');
  console.log('   POST /api/activity/log');
  console.log('   GET/POST/PUT/DELETE /api/goals');
  console.log('   GET  /api/notifications');
  console.log('   POST /api/workout');
  console.log('   POST /api/workout/reset\n');
});
