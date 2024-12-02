module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AfiliadoHistoricos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      afiliadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Afiliados',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      comissao: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      totalReceber: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Data da transação
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AfiliadoHistoricos');
  }
};
