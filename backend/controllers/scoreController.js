// controllers/scoreController.js
const CreditScore = require('../models/CreditScore');

async function getScore(clientId) {
  const score = await CreditScore.findOne({ where: { clientId } });
  return score;
}

module.exports = { getScore };
