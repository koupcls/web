const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const {authenticate, requireAdmin, requireModerator} = require('../middleware/index');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/otp', authController.verifyOtpToken);
router.post('/resend-email', authController.resendConfirmationEmail);
router.post('/refresh', authController.refresh); 

router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getUser);
router.patch('/profile', authenticate, authController.updateProfile);
router.delete('/delete', authenticate, authController.deleteProfile);

router.delete('/hard-delete', authenticate, requireAdmin, authController.hardDeleteProfile);
router.get('/users', authenticate, requireAdmin, authController.getAllUsers);

module.exports = router;