const Track = require('../models/Track');
const Song = require('../models/Song');
const { validationResult } = require('express-validator');
const { s3 } = require('../config/aws');

// @desc    Upload de um arquivo de áudio
// @route   POST /api/upload
// @access  Private
exports.uploadTrack = async (req, res, next) => {
  try {
    // Verificar se há um arquivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, envie um arquivo'
      });
    }

    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { songId, name, type } = req.body;

    // Verificar se a música existe
    if (songId) {
      const song = await Song.findById(songId);
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
          error: 'Não autorizado a adicionar tracks a esta música'
        });
      }
    }

    // Informações do arquivo
    const { originalname, mimetype, size, key } = req.file;
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Criar nova track
    const track = await Track.create({
      name: name || originalname.split('.')[0],
      type: type || 'other',
      fileUrl,
      fileKey: key,
      fileSize: size,
      mimeType: mimetype,
      duration: 0, // Será atualizado posteriormente após processamento
      song: songId || null,
      user: req.user.id
    });

    // Se a track está associada a uma música, adicionar à lista de tracks da música
    if (songId) {
      await Song.findByIdAndUpdate(
        songId,
        { $push: { tracks: track._id } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      data: track
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload múltiplo de arquivos de áudio
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultipleTracks = async (req, res, next) => {
  try {
    // Verificar se há arquivos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, envie pelo menos um arquivo'
      });
    }

    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { songId } = req.body;

    // Verificar se a música existe
    if (songId) {
      const song = await Song.findById(songId);
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
          error: 'Não autorizado a adicionar tracks a esta música'
        });
      }
    }

    // Processar cada arquivo
    const tracks = [];
    for (const file of req.files) {
      const { originalname, mimetype, size, key } = file;
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // Determinar tipo a partir do nome do arquivo
      let type = 'other';
      const fileName = originalname.toLowerCase();
      
      if (fileName.includes('drum') || fileName.includes('bateria')) {
        type = 'drums';
      } else if (fileName.includes('bass') || fileName.includes('baixo')) {
        type = 'bass';
      } else if (fileName.includes('guitar') || fileName.includes('guitarra')) {
        type = 'guitar';
      } else if (fileName.includes('piano') || fileName.includes('teclado') || fileName.includes('keys')) {
        type = 'keys';
      } else if (fileName.includes('viol') || fileName.includes('acoustic')) {
        type = 'acoustic';
      } else if (fileName.includes('voc') || fileName.includes('voz')) {
        type = 'vocals';
      } else if (fileName.includes('pad')) {
        type = 'pads';
      } else if (fileName.includes('fx') || fileName.includes('efeito')) {
        type = 'fx';
      }

      // Criar track
      const track = await Track.create({
        name: originalname.split('.')[0],
        type,
        fileUrl,
        fileKey: key,
        fileSize: size,
        mimeType: mimetype,
        duration: 0, // Será atualizado posteriormente após processamento
        song: songId || null,
        user: req.user.id
      });

      tracks.push(track);

      // Se a track está associada a uma música, adicionar à lista de tracks da música
      if (songId) {
        await Song.findByIdAndUpdate(
          songId,
          { $push: { tracks: track._id } },
          { new: true }
        );
      }
    }

    res.status(201).json({
      success: true,
      count: tracks.length,
      data: tracks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Excluir um arquivo de áudio
// @route   DELETE /api/upload/:id
// @access  Private
exports.deleteTrack = async (req, res, next) => {
  try {
    // Buscar track
    const track = await Track.findById(req.params.id);

    // Verificar se a track existe
    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Track não encontrada'
      });
    }

    // Verificar se o usuário é o proprietário da track
    if (track.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a excluir esta track'
      });
      }

    // Parâmetros para excluir o arquivo do S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: track.fileKey
    };

    // Excluir arquivo do S3
    await s3.deleteObject(params).promise();

    // Se a track está associada a uma música, remover da lista de tracks da música
    if (track.song) {
      await Song.findByIdAndUpdate(
        track.song,
        { $pull: { tracks: track._id } },
        { new: true }
      );
    }

    // Excluir a track do banco de dados
    await track.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Gerar URL pré-assinada para download
// @route   GET /api/upload/:id/download
// @access  Private
exports.getDownloadUrl = async (req, res, next) => {
  try {
    // Buscar track
    const track = await Track.findById(req.params.id);

    // Verificar se a track existe
    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Track não encontrada'
      });
    }

    // Verificar se o usuário tem acesso à track
    if (track.user.toString() !== req.user.id) {
      // Se a track está associada a uma música, verificar se é pública
      if (track.song) {
        const song = await Song.findById(track.song);
        if (!song || (!song.isPublic && song.user.toString() !== req.user.id)) {
          return res.status(403).json({
            success: false,
            error: 'Não autorizado a acessar esta track'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          error: 'Não autorizado a acessar esta track'
        });
      }
    }

    // Parâmetros para gerar URL pré-assinada do S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: track.fileKey,
      Expires: 60 * 5 // URL válida por 5 minutos
    };

    // Gerar URL pré-assinada
    const url = await s3.getSignedUrlPromise('getObject', params);

    res.status(200).json({
      success: true,
      url
    });
  } catch (err) {
    next(err);
  }
};