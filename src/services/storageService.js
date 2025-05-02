// src/services/storageService.js
const { s3, bucketName, multerS3 } = require('../config/s3Config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Variável para controlar qual armazenamento usar
const useS3 = process.env.STORAGE_TYPE === 's3';

// Configuração para armazenamento local
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configuração para S3
const s3Storage = multerS3({
  s3: s3,
  bucket: bucketName,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, `tracks/${Date.now()}-${file.originalname}`);
  }
});

// Função para obter o storage apropriado
const getStorage = () => {
  return useS3 ? s3Storage : localStorage;
};

// Middleware para upload
const upload = multer({ 
  storage: getStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Limite de 50MB
});

// Função para obter URL do arquivo
const getFileUrl = (filename) => {
  if (useS3) {
    return `https://${bucketName}.s3.amazonaws.com/${filename}`;
  } else {
    return `/uploads/${path.basename(filename)}`;
  }
};

module.exports = { 
  upload, 
  getFileUrl,
  // Funções para migração
  useS3,
  s3,
  bucketName
};