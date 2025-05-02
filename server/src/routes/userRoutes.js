const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Controlador de usuários (a ser implementado)
const {
  getUsers,
  getUser,
  updateProfile,
  updatePassword
} = require('../controllers/userController');

// Rotas protegidas para usuários comuns
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

// Rotas protegidas apenas para administradores
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);

module.exports = router;
