'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('clients', 'dataUltimaAtualizacao', {
      type: Sequelize.DATE,
      allowNull: true,  // Permite valores nulos inicialmente
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('clients', 'dataUltimaAtualizacao');
  }
};
