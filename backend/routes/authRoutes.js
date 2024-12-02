const express = require('express');
const { register, login } = require('../controllers/authController'); // Funções de login e cadastro
const { refreshAccessToken, verifyToken } = require('../controllers/auth'); // Certifique-se de importar corretamente
const router = express.Router();

const { User } = require('../models');  // Modelo de User (usuário)
const jwt = require('jsonwebtoken');

// Rota para registro (cadastro)
router.post('/register', register);

// Rota para login
router.post('/login', login);

// Rota para refresh token
router.post('/refresh-token', async (req, res) => {
  const { userId, refreshToken } = req.body;

  // Validação de dados
  if (!refreshToken || !userId) {
    return res.status(400).json({ message: 'Refresh token ou ID de usuário não fornecidos' });
  }

  try {
    // Encontre o usuário no banco de dados (Usando Sequelize ou Mongoose)
    const user = await User.findByPk(userId);  // Sequelize (findByPk) ou similar para MongoDB
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifique se o refreshToken corresponde ao que está armazenado no banco de dados
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }

    // Verifique a validade do refreshToken
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (!decoded) {
        return res.status(403).json({ message: 'Refresh token expirado ou inválido' });
      }

      // Gere um novo accessToken com base nas informações do usuário
      const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      // Retorne o novo accessToken e seu tempo de expiração (em segundos)
      return res.json({ accessToken, expiresIn: 3600 }); // 1 hora = 3600 segundos
    } catch (error) {
      console.error('Erro ao verificar o refresh token:', error);
      return res.status(403).json({ message: 'Refresh token expirado ou inválido' });
    }

  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    return res.status(500).json({ message: 'Erro ao renovar o token' });
  }
});

// Rota para verificar o token (deve verificar a validade do accessToken)
router.post('/verify-token', verifyToken);

module.exports = router;
