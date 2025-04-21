const Song = require('../models/Song');
const Track = require('../models/Track');
const { validationResult } = require('express-validator');

// @desc    Criar uma nova música
// @route   POST /api/songs
// @access  Private
exports.createSong = async (req, res, next) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Adicionar usuário ao corpo da requisição
    req.body.user = req.user.id;

    // Criar música
    const song = await Song.create(req.body);

    res.status(201).json({
      success: true,
      data: song
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter todas as músicas do usuário
// @route   GET /api/songs
// @access  Private
exports.getSongs = async (req, res, next) => {
  try {
    // Aplicar paginação
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Construir query
    let query = { user: req.user.id };

    // Filtrar por tempo litúrgico
    if (req.query.tempo) {
      query.tempo = req.query.tempo;
    }

    // Pesquisa por título
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Contar total de documentos
    const total = await Song.countDocuments(query);

    // Executar consulta com paginação
    const songs = await Song.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Informações de paginação
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: songs.length,
      pagination,
      data: songs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter uma música pelo ID
// @route   GET /api/songs/:id
// @access  Private
exports.getSongById = async (req, res, next) => {
  try {
    // Buscar música com tracks populados
    const song = await Song.findById(req.params.id).populate('tracks');

    // Verificar se a música existe
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }

    // Verificar se o usuário é o proprietário da música ou se ela é pública
    if (song.user.toString() !== req.user.id && !song.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a acessar esta música'
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

// @desc    Atualizar uma música
// @route   PUT /api/songs/:id
// @access  Private
exports.updateSong = async (req, res, next) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Buscar música
    let song = await Song.findById(req.params.id);

    // Verificar se a música existe
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }

    // Verificar se o usuário é o proprietário da música
    if (song.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a atualizar esta música'
      });
    }

    // Atualizar música
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
    // Buscar música
    const song = await Song.findById(req.params.id);

    // Verificar se a música existe
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }

    // Verificar se o usuário é o proprietário da música
    if (song.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a excluir esta música'
      });
    }

    // Obter todas as tracks associadas à música
    const tracks = await Track.find({ song: song._id });

    // Excluir as tracks do S3 (implementar posteriormente)
    // Isso requer um serviço adicional para remover arquivos do S3

    // Excluir todas as tracks associadas à música
    await Track.deleteMany({ song: song._id });

    // Excluir a música
    await song.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Adicionar marcador a uma música
// @route   POST /api/songs/:id/markers
// @access  Private
exports.addMarker = async (req, res, next) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Buscar música
    let song = await Song.findById(req.params.id);

    // Verificar se a música existe
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }

    // Verificar se o usuário é o proprietário da música
    if (song.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a modificar esta música'
      });
    }

    // Adicionar marcador
    song.markers.push(req.body);
    await song.save();

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remover marcador de uma música
// @route   DELETE /api/songs/:id/markers/:markerId
// @access  Private
exports.removeMarker = async (req, res, next) => {
  try {
    // Buscar música
    let song = await Song.findById(req.params.id);

    // Verificar se a música existe
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Música não encontrada'
      });
    }

    // Verificar se o usuário é o proprietário da música
    if (song.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a modificar esta música'
      });
    }

    // Remover marcador
    song.markers = song.markers.filter(
      marker => marker._id.toString() !== req.params.markerId
    );

    await song.save();

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (err) {
    next(err);
  }
};