const express = require('express');
const RSVPController = require('../controllers/RSVPController');

const router = express.Router();

// Public RSVP endpoints
router.get('/:token', RSVPController.getRSVPByToken);
router.post('/:token', RSVPController.submitRSVPResponse);

module.exports = router;