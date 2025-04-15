const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Inicializar a aplicação Express
const app = express();

// Middleware para processar requisições JSON
app.use(express.json());

// Habilitar CORS
app.use(cors());

// Logging para desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Montar rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/upload', uploadRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'API do App Missa funcionando!' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Definir porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando no modo ${process.env.NODE_ENV} na porta ${PORT}`);
});

// Tratamento de exceções não capturadas
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erro: ${err.message}`);
  // Fechar servidor e sair do processo
  server.close(() => process.exit(1));
});