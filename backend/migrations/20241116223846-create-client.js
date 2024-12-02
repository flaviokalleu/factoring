'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clients', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false
      },
      celular: {
        type: Sequelize.STRING,
        allowNull: true
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: true
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      valorPegado: {
        type: Sequelize.STRING,
        allowNull: false
      },
      juros: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      dataEmprestimo: {
        type: Sequelize.DATE,
        allowNull: false
      },
      porcentagem: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      jurosReceber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalReceber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      afiliado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Clients');
  }
};
