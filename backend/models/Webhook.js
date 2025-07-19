// models/Webhook.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Webhook = sequelize.define('Webhook', {
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: false
});

module.exports = Webhook;
