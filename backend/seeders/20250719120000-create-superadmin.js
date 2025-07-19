// seeders/20250719120000-create-superadmin.js
'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Cria empresa principal
    const companies = await queryInterface.bulkInsert('Companies', [{
      name: 'SuperAdminCorp',
      cnpj: '00000000000000',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    // Busca o primeiro plano
    const planos = await queryInterface.sequelize.query('SELECT id FROM "planos" LIMIT 1;', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const planoId = planos.length ? planos[0].id : null;

    // Gera hash da senha
    const password = 'superadmin123';
    const hash = bcrypt.hashSync(password, 10);

    // Cria usuário superadmin
    await queryInterface.bulkInsert('Users', [{
      name: 'Super Administrador',
      email: 'superadmin@factoring.com',
      password: hash,
      role: 'superadmin',
      status: 'active',
      companyId: (Array.isArray(companies) ? companies[0].id : companies.id) || 1,
      planoId,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'superadmin@factoring.com' });
    await queryInterface.bulkDelete('Companies', { cnpj: '00000000000000' });
  }
};
