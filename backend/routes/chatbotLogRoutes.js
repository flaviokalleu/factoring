// routes/chatbotLogRoutes.js
const express = require('express');
const { logChat } = require('../controllers/chatbotLogController');
const router = express.Router();

router.post('/log', async (req, res) => {
  try {
    const { userId, message, reply } = req.body;
    const log = await logChat(userId, message, reply);
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao logar conversa do chatbot' });
  }
});

module.exports = router;
