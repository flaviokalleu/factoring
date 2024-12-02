const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/auth'); // Removido as chaves para importar corretamente

router.get('/dashboard', authenticateToken, getDashboardData);

module.exports = router;
