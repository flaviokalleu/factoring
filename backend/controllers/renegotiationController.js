// controllers/renegotiationController.js
const Renegotiation = require('../models/Renegotiation');

async function suggestRenegotiation(clientId, originalValue, delayDays) {
  // Simulação simples: desconto progressivo conforme atraso
  let discount = 0;
  if (delayDays > 30) discount = 0.10;
  else if (delayDays > 15) discount = 0.05;
  const newValue = originalValue * (1 - discount);
  const installments = delayDays > 30 ? 6 : 3;
  const reneg = await Renegotiation.create({ clientId, originalValue, newValue, installments, discount, status: 'sugerido', createdAt: new Date() });
  return reneg;
}

module.exports = { suggestRenegotiation };
