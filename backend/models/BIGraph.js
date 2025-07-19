// models/BIGraph.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BIGraph = sequelize.define('BIGraph', {
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  config: {
    type: DataTypes.JSON,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = BIGraph;
