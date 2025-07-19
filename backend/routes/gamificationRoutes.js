// routes/gamificationRoutes.js
const express = require('express');
const { addPoints, getRanking } = require('../controllers/gamificationController');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { userId, points } = req.body;
    const gam = await addPoints(userId, points);
    res.json(gam);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar pontos' });
  }
});

router.get('/ranking', async (req, res) => {
  try {
    const ranking = await getRanking();
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

module.exports = router;
