module.exports = (sequelize, DataTypes) => {
  const Afiliado = sequelize.define('Afiliado', {
    nome: {
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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comissao: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,  // Permite que o campo comissao seja nulo
    },
    total_a_receber: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    // Adicionando o campo para referenciar o User
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Permite que o campo userId seja nulo
      references: {
        model: 'Users',  // Nome da tabela no banco de dados
        key: 'id',
      },
      onDelete: 'CASCADE', // Opcional: se o usuário for deletado, o afiliado será deletado também
    }
  });

  Afiliado.associate = (models) => {
    // Relacionando Afiliado com User
    Afiliado.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    
    // Relacionando Afiliado com AfiliadoHistorico
    Afiliado.hasMany(models.AfiliadoHistorico, {
      foreignKey: 'afiliadoId',
      as: 'historicos',
    });
  };
  
  return Afiliado;
};
