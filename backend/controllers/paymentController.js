const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Definir o token de acesso do Mercado Pago
const accessToken = 'TEST-1009706296130807-073110-bde4927878c6ba6c2443ddbdb8f187e4-1488073343';

// Função para criar a preferência de pagamento
const createPreference = async (req, res) => {
    const { planId, price } = req.body;
    
    // Verificar se price é um número válido
    console.log('Preço recebido:', price);  // Verifique o valor do preço
  
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'Preço do plano inválido' });
    }
  
    // Definir os dados do item (plano)
    const preference = {
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      auto_return: 'approved',
      items: [
        {
          title: 'Plano ' + planId, // Exemplo de título
          quantity: 1,
          currency_id: 'BRL',
          unit_price: parseFloat(price), // Garantir que price seja um número válido
        },
      ],
    };
  
    try {
      const response = await axios.post('https://api.mercadopago.com/checkout/preferences', preference, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      const urlMcPg = response.data.init_point;
      return res.json({ urlMcPg });
    } catch (error) {
      console.error('Erro ao criar preferencial de pagamento:', error);
      res.status(500).send('Erro ao criar preferencial de pagamento');
    }
  };
  
  

module.exports = {
  createPreference,
};
