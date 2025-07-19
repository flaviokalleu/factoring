// routes/paymentGatewayRoutes.js
const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');

mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// Endpoint para criar pagamento MercadoPago
router.post('/mercadopago', async (req, res) => {
  try {
    const { value, description } = req.body;
    const preference = {
      items: [
        {
          title: description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: parseFloat(value)
        }
      ]
    };
    const response = await mercadopago.preferences.create(preference);
    res.json({ url: response.body.init_point });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pagamento MercadoPago' });
  }
});

module.exports = router;
