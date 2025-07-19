// models/Gamification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gamification = sequelize.define('Gamification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Bronze'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = Gamification;
