// routes/scoreRoutes.js
const express = require('express');
const { getScore } = require('../controllers/scoreController');
const router = express.Router();

router.get('/:clientId', async (req, res) => {
  try {
    const score = await getScore(req.params.clientId);
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar score' });
  }
});

module.exports = router;
