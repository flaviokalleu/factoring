module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    valorPegado: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    juros: {
      type: DataTypes.FLOAT,
      defaultValue: 10, // Juros padrão de 10%
    },
    dataEmprestimo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    porcentagem: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    afiliado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jurosReceber: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalReceber: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dataUltimaAtualizacao: {  // Novo campo para a data da última atualização
      type: DataTypes.DATE,
      allowNull: true,
    }
  });

  return Client;
};
