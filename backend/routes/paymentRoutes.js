// src/routes/paymentRoutes.js

const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Rota para criar a preferencial de pagamento
router.post('/create-preference', paymentController.createPreference);

module.exports = router;
