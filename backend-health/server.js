/**
 * MAVERICK Health API — server.js
 * Express application: serves the API and (in production) the React frontend build.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const apiRouter = require('./middleware/apiRouter');
const connectDB = require('./config/mongoDb');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Connect to MongoDB
connectDB();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// In production (same-origin), browser requests do not need CORS headers.
// CORS_ORIGINS lets you whitelist dev origins via environment variable.
// Default: allow common local dev ports.
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(logger);

// ─── Health probe (Docker / load-balancer / uptime checks) ───────────────────
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// All remaining /api/* routes (protected by verifyToken middleware inside)
app.use('/api', apiRouter);

// ─── Serve React / Vite production build ─────────────────────────────────────
const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');
const indexHtml = path.join(distPath, 'index.html');

if (fs.existsSync(distPath)) {
  // Serve compiled JS/CSS/image assets
  app.use(express.static(distPath));

  // SPA fallback — React Router handles the path inside the browser.
  // Skip API and health-probe paths so they are not intercepted.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/healthz') {
      return next();
    }
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    }
    next();
  });
} else {
  // No build present — API-only development mode
  app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'MAVERICK Health API is running (no frontend build)', port: PORT });
  });
}

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Start — bind on all interfaces so Docker / reverse-proxy can reach it ────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 MAVERICK running at http://0.0.0.0:${PORT}`);
  console.log('📋 API routes: /api/auth  /api/ai  /api/health  /api/energy');
  console.log('               /api/bmi  /api/activity  /api/goals  /api/notifications');
  console.log('               /api/workout  /api/finance  /api/planner  /api/food');
  console.log('               /api/travel  /api/learning  /api/collaborative  /api/dashboard');
  console.log('   GET  /healthz\n');

  if (fs.existsSync(distPath)) {
    console.log(`🌐 Serving React build from: ${distPath}`);
  } else {
    console.log('ℹ️  No frontend/dist — running in API-only mode');
  }
});
