// controllers/scoreDashboardController.js
const CreditScore = require('../models/CreditScore');

async function getScoreDashboard(companyId) {
  // Busca scores de todos os clientes da empresa
  const scores = await CreditScore.findAll({ where: { companyId } });
  // Estatísticas
  const avgScore = scores.length ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0;
  const lowScores = scores.filter(s => s.score < 500).length;
  return { total: scores.length, avgScore, lowScores, scores };
}

module.exports = { getScoreDashboard };
