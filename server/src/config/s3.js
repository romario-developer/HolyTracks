const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configurar AWS com credenciais do .env
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Criar instância do S3
const s3 = new AWS.S3();

// Verificar se o bucket existe, caso contrário, criar
const checkBucket = async (bucketName) => {
  try {
    await s3.headBucket({ Bucket: bucketName }).promise();
    console.log(`Bucket ${bucketName} já existe`);
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`Bucket ${bucketName} não existe, criando...`);
      try {
        await s3.createBucket({
          Bucket: bucketName,
          ACL: 'private'
        }).promise();
        console.log(`Bucket ${bucketName} criado com sucesso`);
        return true;
      } catch (createError) {
        console.error(`Erro ao criar bucket: ${createError.message}`);
        return false;
      }
    } else {
      console.error(`Erro ao verificar bucket: ${error.message}`);
      return false;
    }
  }
};

// Configurar multer para upload no S3
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${path.basename(file.originalname)}`;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: function (req, file, cb) {
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
  }
});

// Função para gerar URL de download assinada
const getSignedUrl = (key, expires = 3600) => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: expires
  });
};

// Função para excluir arquivo do S3
const deleteFile = async (key) => {
  try {
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    }).promise();
    return true;
  } catch (error) {
    console.error(`Erro ao excluir arquivo: ${error.message}`);
    return false;
  }
};

module.exports = {
  s3,
  checkBucket,
  uploadS3,
  getSignedUrl,
  deleteFile
};