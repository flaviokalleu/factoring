// controllers/chatbotLogController.js
async function logChat(userId, message, reply) {
  // Simulação de log
  return { userId, message, reply, date: new Date() };
}

module.exports = { logChat };
