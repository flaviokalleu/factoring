// models/Notification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // 'email', 'sms', etc
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // 'pendente', 'enviado', 'falha'
    allowNull: false,
    defaultValue: 'pendente'
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: false
});

module.exports = Notification;
