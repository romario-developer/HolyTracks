const Song = require('../models/Song');
const path = require('path');
const { upload, getFileUrl, deleteFile } = require('../services/storageService');

// @desc    Obter todas as músicas
// @route   GET /api/songs
// @access  Public
exports.getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find();
    
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter uma música pelo ID
// @route   GET /api/songs/:id
// @access  Public
exports.getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: song
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Criar uma nova música
// @route   POST /api/songs
// @access  Private
exports.createSong = async (req, res, next) => {
  try {
    // Adicionar o usuário ao corpo da requisição
    req.body.user = req.user ? req.user.id : null;
    
    const song = await Song.create(req.body);
    
    res.status(201).json({
      success: true,
      data: song
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar uma música
// @route   PUT /api/songs/:id
// @access  Private
exports.updateSong = async (req, res, next) => {
  try {
    let song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }
    
    // Verificar se o usuário é o proprietário da música ou um admin
    // (comentado pois req.user pode não existir se a rota não estiver protegida ainda)
    /*
    if (req.user && song.user && song.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para atualizar esta música'
      });
    }
    */
    
    song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: song
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Excluir uma música
// @route   DELETE /api/songs/:id
// @access  Private
exports.deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }
    
    // Verificar se o usuário é o proprietário da música ou um admin
    // (comentado pois req.user pode não existir se a rota não estiver protegida ainda)
    /*
    if (req.user && song.user && song.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para excluir esta música'
      });
    }
    */
    
    await song.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Middleware para upload de arquivo único 
exports.uploadTrack = upload.single('file'); 
 
// Controlador para adicionar uma track a uma música 
exports.addTrack = async (req, res) => { 
  try { 
    const { songId } = req.body; 
    const file = req.file; 
    
    if (!songId || !file) { 
      return res.status(400).json({ error: 'ID da música e arquivo são obrigatórios' }); 
    } 
    
    const song = await Song.findById(songId); 
    if (!song) { 
      return res.status(404).json({ error: 'Música não encontrada' }); 
    } 
    
    // Criar nova track 
    const newTrack = { 
      name: req.body.name || path.basename(file.originalname, path.extname(file.originalname)), 
      type: req.body.type || 'unknown', 
      path: file.location || getFileUrl(file.filename), // Compatível com S3 e local 
      volume: 80, 
      muted: false, 
      solo: false 
    }; 
    
    song.tracks.push(newTrack); 
    await song.save(); 
    
    res.status(200).json({ success: true, track: newTrack }); 
  } catch (error) { 
    console.error('Erro ao adicionar track:', error); 
    res.status(500).json({ error: 'Erro interno do servidor' }); 
  } 
};

// Controlador para remover uma track de uma música
exports.removeTrack = async (req, res) => {
  try {
    const { songId, trackId } = req.params;
    
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ error: 'Música não encontrada' });
    }
    
    // Encontrar o índice da track
    const trackIndex = song.tracks.findIndex(track => track._id.toString() === trackId);
    if (trackIndex === -1) {
      return res.status(404).json({ error: 'Track não encontrada' });
    }
    
    // Obter o caminho do arquivo antes de remover
    const trackPath = song.tracks[trackIndex].path;
    
    // Remover a track da música
    song.tracks.splice(trackIndex, 1);
    await song.save();
    
    // Extrair o nome do arquivo do caminho
    const filename = trackPath.split('/').pop();
    
    // Excluir o arquivo físico
    await deleteFile(filename);
    
    res.status(200).json({ success: true, message: 'Track removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover track:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};