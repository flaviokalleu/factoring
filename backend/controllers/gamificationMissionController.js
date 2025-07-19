// controllers/gamificationMissionController.js
const Gamification = require('../models/Gamification');

async function addMission(userId, mission) {
  // Simulação de missão
  return { userId, mission, completed: false, date: new Date() };
}

module.exports = { addMission };
