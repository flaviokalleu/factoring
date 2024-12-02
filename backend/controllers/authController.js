const User = require('../models/User');
const UserPlan = require('../models/UserPlan'); // Importa o modelo UserPlan
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

const register = async (req, res) => {
  const { email, senha, username, firstName, lastName, cpf, whatsapp, empresa, subdomain, planoId } = req.body;

  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }

    // Gerar hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Criar novo usuário
    const newUser = await User.create({
      email,
      senha: hashedPassword,
      username,
      firstName,
      lastName,
      cpf,
      whatsapp,
      empresa,
      subdomain,
    });

    // Associar o plano ao usuário
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    await UserPlan.create({
      userId: newUser.id,
      planId: planoId,
      expiresAt: validUntil,
    });

    res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso', 
      userId: newUser.id 
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Verificar se o plano do usuário expirou
    const userPlan = await UserPlan.findOne({
      where: { userId: user.id },
      order: [['expiresAt', 'DESC']] // Para garantir que pegamos o plano mais recente
    });

    if (userPlan && userPlan.expiresAt < new Date()) {
      return res.status(403).json({ message: 'Seu plano expirou. Por favor, renove-o para continuar.' });
    }

    // Gerar os tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Salvar o refreshToken no banco de dados
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    user.accessTokenExpiresAt = new Date(Date.now() + 3600 * 1000);  // Define a expiração do accessToken para 1 hora
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      userId: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

module.exports = {
  register,
  login
};
