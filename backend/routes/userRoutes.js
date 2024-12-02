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
router.post('/register', async (req, res) => {
  const { username, firstName, lastName, whatsapp, empresa, cpf, email, senha, subdomain, planoId } = req.body;

  try {
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
      empresa,
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

    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Nome de usuário já existe' });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Rota para obter o usuário a partir do refreshToken


router.get('/users/:id', getUserById);




module.exports = router;
