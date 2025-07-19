module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rodar suas operações de migração aqui
    await queryInterface.addColumn('Users', 'planoId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter as operações da migração
    await queryInterface.removeColumn('Users', 'planoId');
  }
};
