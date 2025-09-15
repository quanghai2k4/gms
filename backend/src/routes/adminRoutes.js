const express = require('express');
const RSVPController = require('../controllers/RSVPController');
const CheckInController = require('../controllers/CheckInController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authMiddleware);

// Admin RSVP endpoints
router.get('/rsvp/statistics', RSVPController.getRSVPStatistics);
router.get('/rsvp', RSVPController.getAllRSVPResponses);
router.put('/rsvp/:id', RSVPController.updateRSVPResponse);

// Admin Check-in endpoints
router.get('/checkin/statistics', CheckInController.getCheckInStatistics);
router.get('/checkin/recent', CheckInController.getRecentCheckIns);
router.get('/checkin', CheckInController.getAllCheckIns);
router.post('/checkin/manual', CheckInController.checkInManual);
router.put('/checkin/:id/notes', CheckInController.updateCheckInNotes);
router.delete('/checkin/:id', CheckInController.deleteCheckIn);

module.exports = router;