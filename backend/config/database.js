const { Sequelize } = require('sequelize');

// Carregar as variáveis do .env
require('dotenv').config();

// Configurações do banco de dados usando variáveis de ambiente
const sequelize = new Sequelize(
    process.env.DB_NAME,    // Nome do banco de dados
    process.env.DB_USER,    // Usuário do banco de dados
    process.env.DB_PASSWORD, // Senha do banco de dados
    {
        host: process.env.DB_HOST, // Host do banco de dados
        dialect: 'mysql',
        logging: false,            // Desativar logs de consultas (opcional)
    }
);

module.exports = sequelize;
