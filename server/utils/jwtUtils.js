const jwt = require('jsonwebtoken');

/**
 * Gera um token JWT
 * @param {Object} payload - Dados a serem incluídos no token
 * @returns {string} Token JWT
 */
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/**
 * Verifica um token JWT
 * @param {string} token - Token JWT a ser verificado
 * @returns {Object|null} Payload decodificado ou null se o token for inválido
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Extrai token do cabeçalho de autorização
 * @param {Object} req - Objeto de requisição Express
 * @returns {string|null} Token JWT ou null se não encontrado
 */
exports.extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};