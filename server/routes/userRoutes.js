const express = require('express');
const { check } = require('express-validator');
const { 
  updateProfile, 
  updatePassword, 
  getUserById, 
  getUsers 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Rotas protegidas (login necessário)
router.use(protect);

// Atualizar perfil
router.put(
  '/profile',
  [
    check('name', 'Nome é obrigatório').not().isEmpty()
  ],
  updateProfile
);

// Atualizar senha
router.put(
  '/password',
  [
    check('currentPassword', 'Senha atual é obrigatória').exists(),
    check('newPassword', 'Nova senha deve ter pelo menos 6 caracteres').isLength({ min: 6 })
  ],
  updatePassword
);

// Rotas de administrador
router.use(authorize('admin'));

// Obter todos os usuários
router.get('/', getUsers);

// Obter usuário pelo ID
router.get('/:id', getUserById);

module.exports = router;