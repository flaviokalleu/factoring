// controllers/chatbotController.js
async function chatbotReply(message) {
  // Exemplo simples de resposta
  if (message.toLowerCase().includes('boleto')) return 'Seu boleto está disponível no portal.';
  if (message.toLowerCase().includes('negociar')) return 'Podemos negociar sua dívida. Entre em contato.';
  return 'Mensagem recebida: ' + message;
}

module.exports = { chatbotReply };
