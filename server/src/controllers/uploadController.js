const path = require('path');
const fs = require('fs');
const Song = require('../models/Song');

// @desc    Upload de um único arquivo
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    // Verificar se o arquivo foi enviado
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }

    const file = req.files.file;
    const songId = req.body.songId;
    
    // Verificar se o formato do arquivo é permitido
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
    const fileExt = path.extname(file.name).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de arquivo não permitido'
      });
    }
    
    // Criar diretório de upload se não existir
    const uploadDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Gerar nome de arquivo único
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Mover o arquivo para o diretório de upload
    await file.mv(filePath);
    
    // Se um songId foi fornecido, associar o arquivo à música
    let song = null;
    if (songId) {
      song = await Song.findById(songId);
      if (!song) {
        return res.status(404).json({
          success: false,
          error: 'Música não encontrada'
        });
      }
      
      // Adicionar o arquivo à música
      song.tracks = song.tracks || [];
      song.tracks.push({
        name: req.body.name || file.name.replace(/\.[^/.]+$/, ""),
        type: req.body.type || 'audio',
        path: `/uploads/${fileName}`,
        size: file.size
      });
      
      await song.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        fileName,
        filePath: `/uploads/${fileName}`,
        size: file.size,
        song: song
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload de múltiplos arquivos
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultipleFiles = async (req, res, next) => {
  try {
    // Verificar se os arquivos foram enviados
    if (!req.files || !req.files.files || req.files.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }
    
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const songId = req.body.songId;
    
    // Criar diretório de upload se não existir
    const uploadDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Processar cada arquivo
    const uploadedFiles = [];
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
    
    for (const file of files) {
      const fileExt = path.extname(file.name).toLowerCase();
      
      if (!allowedExtensions.includes(fileExt)) {
        continue; // Pular arquivos com formato não permitido
      }
      
      // Gerar nome de arquivo único
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Mover o arquivo para o diretório de upload
      await file.mv(filePath);
      
      uploadedFiles.push({
        name: file.name.replace(/\.[^/.]+$/, ""),
        type: 'audio',
        path: `/uploads/${fileName}`,
        size: file.size
      });
    }
    
    // Se um songId foi fornecido, associar os arquivos à música
    let song = null;
    if (songId && uploadedFiles.length > 0) {
      song = await Song.findById(songId);
      if (!song) {
        return res.status(404).json({
          success: false,
          error: 'Música não encontrada'
        });
      }
      
      // Adicionar os arquivos à música
      song.tracks = song.tracks || [];
      song.tracks.push(...uploadedFiles);
      
      await song.save();
    }
    
    res.status(200).json({
      success: true,
      count: uploadedFiles.length,
      data: {
        files: uploadedFiles,
        song: song
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Excluir um arquivo
// @route   DELETE /api/upload/:trackId
// @access  Private
exports.deleteFile = async (req, res, next) => {
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
    const trackPath = song.tracks[trackIndex].path;
    const fullPath = path.join(__dirname, '../../../', trackPath);
    
    // Remover o arquivo do sistema de arquivos
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
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

// @desc    Obter URL de download para um arquivo
// @route   GET /api/upload/download/:songId/:trackId
// @access  Public
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
    
    res.status(200).json({
      success: true,
      data: {
        url: track.path
      }
    });
  } catch (err) {
    next(err);
  }
};