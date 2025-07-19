// models/Renegotiation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Renegotiation = sequelize.define('Renegotiation', {
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  originalValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  newValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  installments: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendente'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = Renegotiation;
