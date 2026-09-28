const express = require('express');
const router = express.Router();
const { verifyToken } = require('./authMiddleware');

const healthRoutes = require('../routes/health');
const energyRoutes = require('../routes/energy');
const bmiRoutes = require('../routes/bmi');
const activityRoutes = require('../routes/activity');
const goalsRoutes = require('../routes/goals');
const notificationRoutes = require('../routes/notifications');
const workoutRoutes = require('../routes/workout');
const financeRoutes = require('../routes/finance');
const plannerRoutes = require('../routes/planner');
const foodRoutes = require('../routes/food');
const travelRoutes = require('../routes/travel');
const learningRoutes = require('../routes/learning');
const collaborativeRoutes = require('../routes/collaborative');
const dashboardRoutes = require('../routes/dashboard');

router.use(verifyToken);

router.use('/health', healthRoutes);
router.use('/energy', energyRoutes);
router.use('/bmi', bmiRoutes);
router.use('/activity', activityRoutes);
router.use('/goals', goalsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/workout', workoutRoutes);
router.use('/finance', financeRoutes);
router.use('/planner', plannerRoutes);
router.use('/food', foodRoutes);
router.use('/travel', travelRoutes);
router.use('/learning', learningRoutes);
router.use('/collaborative', collaborativeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;