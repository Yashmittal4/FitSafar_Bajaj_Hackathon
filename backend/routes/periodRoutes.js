const express = require('express');
const router = express.Router();
const { getPeriodData, createOrUpdatePeriodData } = require('../controllers/periodController');
const verifyToken = require('../middleware/auth');

// Get period data
router.get('/data', verifyToken, getPeriodData);

// Create or update period data
router.post('/data', verifyToken, createOrUpdatePeriodData);

module.exports = router;


