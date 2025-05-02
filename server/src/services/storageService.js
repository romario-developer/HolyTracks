const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

// Verificar se estamos em ambiente de produção
const isProduction = process.env.NODE_ENV === 'production';

// Configuração para armazenamento local
const localStorageConfig = () => {
  // Criar diretório de uploads se não existir
  const uploadDir = path.join(__dirname, '../../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// Configuração para S3
const s3StorageConfig = () => {
  // Configurar AWS com credenciais do .env
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  // Criar instância do S3
  const s3 = new AWS.S3();

  return multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  // Verificar tipos de arquivo permitidos
  const allowedMimes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/x-m4a'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

// Configurar multer com base no ambiente
const storage = isProduction ? s3StorageConfig() : localStorageConfig();

// Configurar upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: fileFilter
});

// Função para obter URL do arquivo (compatível com local e S3)
const getFileUrl = (filename) => {
  if (isProduction) {
    // Gerar URL assinada para S3
    const s3 = new AWS.S3();
    return s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Expires: 3600 // URL válida por 1 hora
    });
  } else {
    // URL local
    return `/uploads/${filename}`;
  }
};

// Função para excluir arquivo
const deleteFile = async (filename) => {
  if (isProduction) {
    // Excluir do S3
    const s3 = new AWS.S3();
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename
    }).promise();
  } else {
    // Excluir localmente
    const filePath = path.join(__dirname, '../../../uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

module.exports = {
  upload,
  getFileUrl,
  deleteFile
};