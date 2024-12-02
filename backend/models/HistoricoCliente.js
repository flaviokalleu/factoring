module.exports = (sequelize, DataTypes) => {
  const HistoricoCliente = sequelize.define('HistoricoCliente', {
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Clients', // Certifique-se de que o nome do modelo está correto
        key: 'id',
      },
    },
    acao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    observacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  // Definindo a associação com o modelo Client
  HistoricoCliente.associate = (models) => {
    HistoricoCliente.belongsTo(models.Client, { foreignKey: 'clienteId', as: 'client' });
  };

  return HistoricoCliente;
};
