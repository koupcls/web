const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const {authenticate, requireAdmin, requireModerator} = require('../middleware/index');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/otp/', authController.verifyOtpCode);
router.get('/resend-email/:email', authController.resendConfirmationEmail);
router.post('/refresh', authController.refresh); 
router.post('/logout', authenticate, authController.logout);

router.get('/user', authenticate, authController.getUser);
router.patch('/user', authenticate, authController.updateProfile);
router.get('/user/:id', authenticate, authController.getUser);
router.patch('/user/:id', authenticate, requireAdmin, authController.updateProfile);
router.delete('/user/:id', authenticate, authController.delete);
router.delete('/user/:id/hard', authenticate, requireAdmin, authController.hardDelete);
router.delete('/user/:id/hard/admin', authController.hardDelete);

router.get('/users', authenticate, requireAdmin, authController.getAllUsers);

module.exports = router;