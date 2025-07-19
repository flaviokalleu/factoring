// controllers/gamificationController.js
const Gamification = require('../models/Gamification');

async function addPoints(userId, points) {
  const gam = await Gamification.findOne({ where: { userId } });
  if (gam) {
    gam.points += points;
    gam.lastUpdated = new Date();
    await gam.save();
    return gam;
  } else {
    return await Gamification.create({ userId, points, lastUpdated: new Date() });
  }
}

async function getRanking() {
  return await Gamification.findAll({ order: [['points', 'DESC']] });
}

module.exports = { addPoints, getRanking };
