// routes/gamificationMissionRoutes.js
const express = require('express');
const { addMission } = require('../controllers/gamificationMissionController');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { userId, mission } = req.body;
    const result = await addMission(userId, mission);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar missão' });
  }
});

module.exports = router;
