// models/CreditScore.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CreditScore = sequelize.define('CreditScore', {
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  riskLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recommendedLimit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  recommendedRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = CreditScore;
