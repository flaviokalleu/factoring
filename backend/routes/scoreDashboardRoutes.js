// routes/scoreDashboardRoutes.js
const express = require('express');
const { getScoreDashboard } = require('../controllers/scoreDashboardController');
const router = express.Router();

router.get('/:companyId', async (req, res) => {
  try {
    const dashboard = await getScoreDashboard(req.params.companyId);
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dashboard de scores' });
  }
});

module.exports = router;
