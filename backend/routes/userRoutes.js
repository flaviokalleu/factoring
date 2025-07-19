const auditLogger = require('../middleware/auditLogger');
// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const UserPlan = require('../models/UserPlan'); // ou o caminho correto para o seu modelo UserPlan
  // Certifique-se de que Sequelize está sendo importado corretamente
const router = express.Router();

const { getUserById } = require('../controllers/userController');

// Rota para registro de usuário
// Rota para registro de usuário
router.post('/register', accessControl(), async (req, res) => {
  const { username, firstName, lastName, whatsapp, companyId, cpf, email, senha, subdomain, planoId } = req.body;

  try {
    // Se for admin, só pode criar usuário para sua própria empresa
    if (req.user.role === 'admin' && companyId !== req.user.companyId) {
      return res.status(403).json({ error: 'Admin só pode criar usuários da própria empresa.' });
    }
    // Verifica se o nome de usuário já existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Nome de usuário já existe' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criação do novo usuário com a senha criptografada
    const newUser = await User.create({
      username,
      firstName,
      lastName,
      whatsapp,
      companyId,
      cpf,
      email,
      senha: hashedPassword, // Senha criptografada
      subdomain,
      planoId,
    });

    // Definir a data de expiração para 30 dias a partir de agora
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // Criação de uma entrada na tabela UserPlan com a data de expiração
    await UserPlan.create({
      userId: newUser.id,
      planId: planoId,
      expiresAt: expirationDate,
    });

    await auditLogger(req.user.id, 'register_user', `Usuário criado: ${newUser.username}`);
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Nome de usuário já existe' });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});


// Rota para listar usuários, respeitando regras de acesso
const accessControl = require('../middleware/accessControl');
// Rota para listar usuários com paginação e filtro de status
router.get('/', accessControl(), async (req, res) => {
  try {
    let where = {};
    if (req.companyFilter) {
      where = req.companyFilter;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({ where, limit, offset });
    res.json({
      users: rows,
      total: count,
      page,
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.get('/users/:id', getUserById);

module.exports = router;
