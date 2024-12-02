require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes');
const plansRouter = require('./routes/plans');
const userRoutes = require('./routes/userRoutes');
const historicoRoutes = require('./routes/historico');
const afiliadosRoutes = require('./routes/afiliados');  // Importa as rotas de afiliados
const atualizarJurosClientes = require('./utils/calculodejuros');  // Importa o cron job
const afiliadoHistoricoRoutes = require('./routes/afiliadoHistoricoRoutes');
const dashboardRoutes = require('./routes/dashboard');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Configuração de CORS e body parser
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas de cliente
app.use('/api/clients', clientRoutes);
app.use('/api', userRoutes);
app.use('/api', paymentRoutes);

// Usando as rotas de autenticação (login e cadastro)
app.use('/api/auth', authRoutes); // Rotas de login e cadastro agora estão em /api/auth
app.use('/api/plans', plansRouter);
app.use('/api', dashboardRoutes);
// Usando as rotas de histórico de cliente
app.use('/api/historico', historicoRoutes); // A rota de histórico será acessada em /api/historico
app.use('/api', afiliadoHistoricoRoutes);
// Usando as rotas de afiliados
app.use('/api/afiliados', afiliadosRoutes);  // Nova rota para os afiliados

// Inicializa o cron job para calcular juros
atualizarJurosClientes();  // Isso fará com que o cron job inicie automaticamente

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });
