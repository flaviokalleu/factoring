const { Sequelize } = require('sequelize');
const sequelize = require('../config/database'); // Ajuste o caminho conforme sua configuração de banco de dados

// Criação do objeto db para armazenar os modelos e a instância do Sequelize
const db = {
  sequelize,
  Sequelize,
};

// Inicializa os modelos
db.Client = require('./Client')(sequelize, Sequelize.DataTypes);
db.User = require('./User'); // Apenas importa o modelo User diretamente
db.HistoricoCliente = require('./HistoricoCliente')(sequelize, Sequelize.DataTypes);
db.Afiliado = require('./afiliado')(sequelize, Sequelize.DataTypes);  // Adiciona o modelo Afiliado
db.AfiliadoHistorico = require('./afiliadoHistorico')(sequelize, Sequelize.DataTypes); // Adiciona o modelo AfiliadoHistorico

// Estabelecendo relações entre os modelos
db.User.hasMany(db.Client, { foreignKey: 'userId' });  // Um usuário pode ter muitos clientes
db.Client.belongsTo(db.User, { foreignKey: 'userId' });  // Um cliente pertence a um usuário

// Associações entre HistoricoCliente e Client
db.Client.hasMany(db.HistoricoCliente, { foreignKey: 'clienteId', as: 'historicos' });
db.HistoricoCliente.belongsTo(db.Client, { foreignKey: 'clienteId', as: 'client' });

// Adiciona associação entre Afiliado e User
db.User.hasMany(db.Afiliado, { foreignKey: 'userId' });  // Um usuário pode ter muitos afiliados
db.Afiliado.belongsTo(db.User, { foreignKey: 'userId' });  // Um afiliado pertence a um usuário

// Associações entre Afiliado e AfiliadoHistorico
db.Afiliado.hasMany(db.AfiliadoHistorico, { foreignKey: 'afiliadoId', as: 'historicos' });
db.AfiliadoHistorico.belongsTo(db.Afiliado, { foreignKey: 'afiliadoId', as: 'afiliado' });

module.exports = db;
