// routes/companyRoutes.js
const express = require('express');
const { Company, User } = require('../models');
const bcrypt = require('bcrypt');
const accessControl = require('../middleware/accessControl');
const router = express.Router();

// Superadmin cria empresa e vincula admin
router.post('/create', accessControl('superadmin'), async (req, res) => {
  try {
    const { name, adminData } = req.body;
    const company = await Company.create({ name });
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await User.create({
      ...adminData,
      password: hashedPassword,
      role: 'admin',
      companyId: company.id
    });
    res.status(201).json({ company, admin });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar empresa/admin' });
  }
});

module.exports = router;
