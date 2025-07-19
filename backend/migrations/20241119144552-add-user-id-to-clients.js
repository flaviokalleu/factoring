'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Clients', 'userId', {
      type: Sequelize.INTEGER, // Tipo do dado, dependendo do seu modelo (INTEGER, UUID, etc)
      allowNull: false, // Garantir que o campo não seja nulo
      references: {
        model: 'Users', // A tabela associada que contém os usuários
        key: 'id', // A chave primária da tabela users
      },
      onUpdate: 'CASCADE', // Se o ID do usuário mudar, isso atualizará os clientes associados
      onDelete: 'CASCADE', // Se o usuário for deletado, os clientes associados também serão removidos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Clients', 'userId');
  }
};
