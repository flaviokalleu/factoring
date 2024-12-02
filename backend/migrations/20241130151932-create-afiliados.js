// migrations/[timestamp]-create-afiliados.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da tabela 'Afiliados' com todos os campos necessários
    await queryInterface.createTable('Afiliados', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      comissao: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_a_receber: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Referencia a tabela 'Users'
          key: 'id',
        },
        onDelete: 'CASCADE', // Quando o usuário for deletado, o afiliado será deletado também
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remoção da tabela 'Afiliados' caso a migração seja revertida
    await queryInterface.dropTable('Afiliados');
  },
};
