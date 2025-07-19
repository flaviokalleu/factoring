// routes/creditScoreRoutes.js
const express = require('express');
const { calculateScore } = require('../controllers/creditScoreController');
const router = express.Router();

// Endpoint para calcular score de crédito
router.get('/:clientId', async (req, res) => {
  try {
    const result = await calculateScore(req.params.clientId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular score' });
  }
});

module.exports = router;
