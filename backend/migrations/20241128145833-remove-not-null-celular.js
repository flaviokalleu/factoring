'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remover a coluna 'celular' da tabela 'Clientes'
    await queryInterface.removeColumn('Clients', 'celular');
  },

  down: async (queryInterface, Sequelize) => {
    // Caso precise reverter, adicione a coluna 'celular' de volta
    await queryInterface.addColumn('Clients', 'celular', {
      type: Sequelize.STRING,
      allowNull: true, // Defina como permitir NULL, caso deseje manter essa configuração
    });
  }
};
