const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware básicos
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
const connectDB = require('./connectMongo');
connectDB();

// Configuração do Redis
const redis = require('./redis');

// Middleware de autenticação do Clerk
const { setupClerkMiddleware, protectRoute } = require('./middleware/auth.middleware');
app.use(setupClerkMiddleware());

// Importar rotas
const businessRoutes = require('./routes/business.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const webhookRoutes = require('./routes/webhook.routes');

// Rota pública para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

// Rotas da API
app.use('/api/v1/businesses', protectRoute(), businessRoutes);
app.use('/api/v1/analytics', protectRoute(), analyticsRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// Middleware de tratamento de erros
const errorHandler = require('./utils/error-handler');
app.use(errorHandler);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});