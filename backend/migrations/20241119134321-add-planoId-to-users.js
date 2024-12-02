module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Desabilitar a verificação de chaves estrangeiras
    await queryInterface.sequelize.query('SET foreign_key_checks = 0;');
    
    // Rodar suas operações de migração aqui
    await queryInterface.addColumn('Users', 'planoId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Reabilitar a verificação de chaves estrangeiras
    await queryInterface.sequelize.query('SET foreign_key_checks = 1;');
  },

  down: async (queryInterface, Sequelize) => {
    // Desabilitar a verificação de chaves estrangeiras
    await queryInterface.sequelize.query('SET foreign_key_checks = 0;');
    
    // Reverter as operações da migração
    await queryInterface.removeColumn('Users', 'planoId');
    
    // Reabilitar a verificação de chaves estrangeiras
    await queryInterface.sequelize.query('SET foreign_key_checks = 1;');
  }
};
