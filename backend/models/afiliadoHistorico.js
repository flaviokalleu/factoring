// models/afiliadoHistorico.js
module.exports = (sequelize, DataTypes) => {
    const AfiliadoHistorico = sequelize.define('AfiliadoHistorico', {
      afiliadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Afiliados', // Certifique-se de que o nome da tabela está correto
          key: 'id',
        },
      },
      comissao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      totalReceber: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      data: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      timestamps: true,
    });
  
    // Definindo a associação com o modelo Afiliado
    AfiliadoHistorico.associate = (models) => {
      AfiliadoHistorico.belongsTo(models.Afiliado, { foreignKey: 'afiliadoId', as: 'afiliado' });
    };
  
    return AfiliadoHistorico;
  };
  