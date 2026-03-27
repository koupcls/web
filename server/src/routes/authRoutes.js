const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const {authMiddleware} = require('../middleware/index');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.patch('/profile', authMiddleware, authController.updateProfile);

module.exports = router;