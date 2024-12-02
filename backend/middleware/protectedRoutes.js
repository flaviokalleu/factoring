const express = require('express');
const verifyToken = require('../middleware/authMiddleware'); // Middleware para verificar o token
const router = express.Router();

// Rota protegida que exige autenticação
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Acesso permitido', user: req.user });
});

module.exports = router;
