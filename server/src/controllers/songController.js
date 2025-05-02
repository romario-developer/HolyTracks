const Song = require('../models/Song');

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