'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Companies', [
      {
        name: 'Empresa Exemplo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    // Busca o id da empresa criada
    const [company] = await queryInterface.sequelize.query("SELECT id FROM \"Companies\" WHERE name = 'Empresa Exemplo' LIMIT 1;");
    const companyId = company[0]?.id;
    // Cria um admin para essa empresa
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin_empresa',
        firstName: 'Admin',
        lastName: 'Empresa',
        whatsapp: '11111111111',
        empresa: 'Empresa Exemplo',
        cpf: '11111111111',
        email: 'admin@empresa.com',
        password: '$2b$10$QeQw1Qw1Qw1Qw1Qw1Qw1QeQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1',
        role: 'admin',
        companyId: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { username: 'admin_empresa' }, {});
    await queryInterface.bulkDelete('Companies', { name: 'Empresa Exemplo' }, {});
  }
};
