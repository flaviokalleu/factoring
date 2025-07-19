// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();

// Exemplo de endpoint de chatbot
router.post('/chat', (req, res) => {
  const { message } = req.body;
  // Aqui você pode integrar com um serviço de IA/chatbot
  res.json({ reply: 'Mensagem recebida: ' + message });
});

module.exports = router;
