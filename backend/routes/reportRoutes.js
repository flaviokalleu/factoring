// routes/reportRoutes.js
const express = require('express');
const { exportToCSV } = require('../utils/exportReport');
const { User } = require('../models');
const accessControl = require('../middleware/accessControl');
const router = express.Router();
const path = require('path');

// Endpoint para exportar usuários em CSV
router.get('/users/export', accessControl(), async (req, res) => {
  try {
    let where = {};
    if (req.companyFilter) {
      where = req.companyFilter;
    }
    const users = await User.findAll({ where });
    const fields = ['id', 'username', 'email', 'role', 'companyId', 'status'];
    const filePath = path.join(__dirname, '../../exports/users.csv');
    exportToCSV(users.map(u => u.dataValues), fields, filePath);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao exportar usuários' });
  }
});

module.exports = router;
