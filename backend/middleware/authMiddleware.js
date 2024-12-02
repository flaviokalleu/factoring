// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/token');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido' });
  }

  req.userId = decoded.id;
  next();
};

module.exports = {
  authenticateToken
};