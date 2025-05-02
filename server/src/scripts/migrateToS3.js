const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { s3 } = require('../config/s3');
const Song = require('../models/Song');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const uploadDir = path.join(__dirname, '../../../uploads');

const migrateFile = async (filePath, fileName) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ACL: 'private',
      ContentType: 'audio/mpeg' // Ajuste conforme necessário
    };
    
    const result = await s3.upload(params).promise();
    return result.Key;
  } catch (error) {
    console.error(`Erro ao migrar arquivo ${filePath}: ${error.message}`);
    return null;
  }
};

const migrateToS3 = async () => {
  try {
    // Obter todas as músicas
    const songs = await Song.find();
    
    for (const song of songs) {
      if (song.tracks && song.tracks.length > 0) {
        for (let i = 0; i < song.tracks.length; i++) {
          const track = song.tracks[i];
          
          // Verificar se o arquivo está armazenado localmente
          if (track.path.startsWith('/uploads/')) {
            const fileName = path.basename(track.path);
            const filePath = path.join(uploadDir, fileName);
            
            // Verificar se o arquivo existe
            if (fs.existsSync(filePath)) {
              console.log(`Migrando arquivo: ${filePath}`);
              
              // Migrar arquivo para S3
              const s3Key = await migrateFile(filePath, fileName);
              
              if (s3Key) {
                // Atualizar caminho no banco de dados
                song.tracks[i].path = s3Key;
                console.log(`Arquivo migrado com sucesso: ${s3Key}`);
              }
            } else {
              console.error(`Arquivo não encontrado: ${filePath}`);
            }
          }
        }
        
        // Salvar alterações
        await song.save();
      }
    }
    
    console.log('Migração concluída!');
    process.exit(0);
  } catch (error) {
    console.error(`Erro durante a migração: ${error.message}`);
    process.exit(1);
  }
};

migrateToS3();