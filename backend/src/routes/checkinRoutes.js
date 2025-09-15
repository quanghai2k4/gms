const express = require('express');
const CheckInController = require('../controllers/CheckInController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected check-in endpoint (QR code scan) - requires auth for staff
router.post('/qr/:token', authMiddleware, CheckInController.checkInByQRToken);

module.exports = router;