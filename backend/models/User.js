// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subdomain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accessTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  planoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Plano',
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

User.associate = (models) => {
  // Relacionando User com Client
  User.hasMany(models.Client, { foreignKey: 'userId', as: 'clients' });

  // Relacionando User com Afiliado (um para um)
  User.hasOne(models.Afiliado, { foreignKey: 'userId', as: 'afiliado' });

  // Relacionando User com UserPlan
  User.hasMany(models.UserPlan, { foreignKey: 'userId', as: 'userPlans' });
};


module.exports = User;
