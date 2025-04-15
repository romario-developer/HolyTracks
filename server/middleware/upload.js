const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { s3 } = require('../config/aws');

// Verificar tipos de arquivo permitidos
const checkFileType = (file, cb) => {
  // Tipos permitidos
  const filetypes = /wav|mp3|aac|m4a|ogg/;
  // Verificar extensão
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Verificar mime type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Erro: Apenas arquivos de áudio são permitidos!');
  }
};

// Configuração para upload usando multer com armazenamento no S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'private', // Arquivos privados, acesso apenas via URL pré-assinada
    metadata: function (req, file, cb) {
      cb(null, { 
        fieldName: file.fieldname,
        userId: req.user.id
      });
    },
    key: function (req, file, cb) {
      // Gerar nome de arquivo único com timestamp e ID do usuário
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const userId = req.user.id;
      cb(null, `uploads/${userId}/${uniqueSuffix}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;