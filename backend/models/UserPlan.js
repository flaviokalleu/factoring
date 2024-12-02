const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPlan = sequelize.define('UserPlan', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Plano',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

UserPlan.associate = (models) => {
  UserPlan.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  UserPlan.belongsTo(models.Plano, { foreignKey: 'planId', as: 'plano' });
};

module.exports = UserPlan;
