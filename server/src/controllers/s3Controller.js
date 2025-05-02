const { s3, checkBucket, getSignedUrl, deleteFile } = require('../config/s3');
const Song = require('../models/Song');
const path = require('path');

// @desc    Inicializar o bucket S3
// @route   GET /api/s3/init
// @access  Private/Admin
exports.initBucket = async (req, res, next) => {
  try {
    const bucketExists = await checkBucket(process.env.AWS_BUCKET_NAME);
    
    if (bucketExists) {
      return res.status(200).json({
        success: true,
        message: `Bucket ${process.env.AWS_BUCKET_NAME} está pronto para uso`
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Não foi possível inicializar o bucket S3'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Upload de arquivo para S3
// @route   POST /api/s3/upload
// @access  Private
exports.uploadToS3 = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }
    
    const { songId } = req.body;
    const file = req.file;
    
    // Se um songId foi fornecido, associar o arquivo à música
    if (songId) {
      const song = await Song.findById(songId);
      if (!song) {
        // Excluir o arquivo do S3 se a música não for encontrada
        await deleteFile(file.key);
        
        return res.status(404).json({
          success: false,
          error: 'Música não encontrada'
        });
      }
      
      // Adicionar o arquivo à música
      song.tracks = song.tracks || [];
      song.tracks.push({
        name: req.body.name || path.basename(file.originalname, path.extname(file.originalname)),
        type: req.body.type || 'audio',
        path: file.key,
        size: file.size
      });
      
      await song.save();
      
      return res.status(200).json({
        success: true,
        data: {
          file: {
            key: file.key,
            location: file.location,
            size: file.size
          },
          song
        }
      });
    }
    
    // Se não houver songId, apenas retornar informações do arquivo
    res.status(200).json({
      success: true,
      data: {
        file: {
          key: file.key,
          location: file.location,
          size: file.size
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter URL assinada para download
// @route   GET /api/s3/download/:songId/:trackId
// @access  Private
exports.getDownloadUrl = async (req, res, next) => {
  try {
    const { songId, trackId } = req.params;
    
    // Encontrar a música
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }
    
    // Encontrar o track na música
    const track = song.tracks.find(track => track._id.toString() === trackId);
    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }
    
    // Gerar URL assinada
    const url = getSignedUrl(track.path);
    
    res.status(200).json({
      success: true,
      data: {
        url,
        expiresIn: '1 hora'
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Excluir arquivo do S3
// @route   DELETE /api/s3/:songId/:trackId
// @access  Private
exports.deleteFromS3 = async (req, res, next) => {
  try {
    const { songId, trackId } = req.params;
    
    // Encontrar a música
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }
    
    // Encontrar o track na música
    const trackIndex = song.tracks.findIndex(track => track._id.toString() === trackId);
    if (trackIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }
    
    // Obter o caminho do arquivo
    const trackKey = song.tracks[trackIndex].path;
    
    // Excluir o arquivo do S3
    const deleted = await deleteFile(trackKey);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Não foi possível excluir o arquivo do S3'
      });
    }
    
    // Remover o track da música
    song.tracks.splice(trackIndex, 1);
    await song.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};