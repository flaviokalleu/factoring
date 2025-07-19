// controllers/creditScoreController.js
const CreditScore = require('../models/CreditScore');
const HistoricoCliente = require('../models/HistoricoCliente');

// Cálculo avançado de score interno
async function calculateScore(clientId) {
  const history = await HistoricoCliente.findAll({ where: { clienteId: clientId } });
  const payments = history.filter(h => h.status === 'pago').length;
  const delays = history.filter(h => h.status === 'atrasado').length;
  const totalValue = history.reduce((sum, h) => sum + (h.valor || 0), 0);
  const lastPayment = history.filter(h => h.status === 'pago').sort((a, b) => new Date(b.data) - new Date(a.data))[0];
  const daysSinceLastPayment = lastPayment ? Math.floor((Date.now() - new Date(lastPayment.data)) / (1000*60*60*24)) : 999;
  // Score: volume, pontualidade, frequência
  let score = 500 + payments * 15 - delays * 30 + Math.floor(totalValue/1000);
  score -= daysSinceLastPayment > 30 ? 50 : 0;
  score = Math.max(300, Math.min(score, 900));
  let riskLevel = 'baixo';
  if (score < 500) riskLevel = 'alto';
  else if (score < 650) riskLevel = 'médio';
  const recommendedLimit = score * 2 + totalValue * 0.1;
  const recommendedRate = riskLevel === 'alto' ? 0.18 : riskLevel === 'médio' ? 0.12 : 0.07;
  await CreditScore.upsert({ clientId, score, riskLevel, recommendedLimit, recommendedRate, updatedAt: new Date() });
  return { score, riskLevel, recommendedLimit, recommendedRate, payments, delays, totalValue, daysSinceLastPayment };
}

module.exports = { calculateScore };
