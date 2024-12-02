const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definindo o modelo de Plano
const Plano = sequelize.define('Plano', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Se for autoincremento
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Exportando o modelo Plano
module.exports = Plano;
