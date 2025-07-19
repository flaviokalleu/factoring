'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('planos', [
      {
        name: 'Plano Básico',
        description: 'Pague menos e use mais',
        price: 153.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Plano Plus',
        description: 'Organização e controle de mais clientes',
        price: 90.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Plano Start',
        description: 'Inicie seu negócio de forma automatizada',
        price: 60.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Planos', null, {});
  }
};
