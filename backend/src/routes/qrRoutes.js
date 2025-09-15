const express = require('express');
const QRCodeController = require('../controllers/QRCodeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const qrCodeController = new QRCodeController();

// Public route - no auth required
router.get('/image/:token', qrCodeController.getQRCodeImage.bind(qrCodeController));

// Protected routes - auth required
router.get('/:guestId', authMiddleware, qrCodeController.getQRCodeByGuestId.bind(qrCodeController));
router.post('/:guestId/generate', authMiddleware, qrCodeController.generateQRCode.bind(qrCodeController));
router.post('/:guestId/regenerate', authMiddleware, qrCodeController.regenerateQRCode.bind(qrCodeController));
router.patch('/:guestId/deactivate', authMiddleware, qrCodeController.deactivateQRCode.bind(qrCodeController));

module.exports = router;