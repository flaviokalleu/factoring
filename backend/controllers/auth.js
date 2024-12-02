const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { generateAccessToken } = require('../utils/token');


const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).send('Refresh token não encontrado');
  }

  try {
    // Verifica se o refreshToken é válido
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(403).send('Usuário não encontrado');
    }

    // Gera um novo accessToken
    const accessToken = generateAccessToken({ id: user.id, email: user.email });

    res.json({ accessToken, expiresIn: 3600 }); // 1 hora de expiração
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    res.status(403).send('Token inválido ou expirado');
  }
};





const verifyToken = (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: 'Token is valid', user });
  });
};

module.exports = { refreshAccessToken, verifyToken };
