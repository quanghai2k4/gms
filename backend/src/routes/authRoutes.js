const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const authController = new AuthController();

// Public auth routes
router.post('/login', authController.login.bind(authController));

// Protected auth routes
router.post('/logout', authMiddleware, authController.logout.bind(authController));
router.post('/verify-token', authController.verifyToken.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.post('/change-password', authMiddleware, authController.changePassword.bind(authController));
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));

module.exports = router;