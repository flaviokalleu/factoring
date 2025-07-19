'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        firstName: 'Administrador',
        lastName: 'Sistema',
        whatsapp: '00000000000',
        cpf: '00000000000',
        email: 'admin@admin.com',
        password: '$2b$10$QeQw1Qw1Qw1Qw1Qw1Qw1QeQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1', // hash de 'admin123' (exemplo)
        role: 'superadmin',
        companyId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};
