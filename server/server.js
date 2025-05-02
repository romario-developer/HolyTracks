const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./src/config/db');
const { checkBucket } = require('./src/config/s3');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const songRoutes = require('./src/routes/songRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const s3Routes = require('./src/routes/s3Routes');

// Inicializar a aplicação Express
const app = express();

// Middleware para processar requisições JSON
app.use(express.json());

// Middleware para processar cookies
app.use(cookieParser());

// Habilitar CORS
app.use(cors());

// Logging para desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Servir arquivos estáticos da pasta uploads (para desenvolvimento local)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Montar rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/upload', uploadRoutes); // Upload local (para desenvolvimento)
app.use('/api/s3', s3Routes); // Upload S3 (para produção)

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'API do HolyTracks funcionando!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Erro no servidor'
  });
});

// Definir porta
const PORT = process.env.PORT || 8000;

// Iniciar servidor
const server = app.listen(PORT, async () => {
  console.log(`Servidor rodando no modo ${process.env.NODE_ENV} na porta ${PORT}`);
  
  // Verificar se o bucket S3 existe
  if (process.env.NODE_ENV === 'production') {
    try {
      await checkBucket(process.env.AWS_BUCKET_NAME);
    } catch (error) {
      console.error(`Erro ao verificar bucket S3: ${error.message}`);
    }
  }
});

// Tratamento de exceções não capturadas
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erro: ${err.message}`);
  // Fechar servidor e sair do processo
  server.close(() => process.exit(1));
});