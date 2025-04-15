const AWS = require('aws-sdk');

// Configurar AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Criar instância do S3
const s3 = new AWS.S3();

module.exports = { s3 };