const express = require('express');
const multer = require('multer');
const path = require('path');
const GuestController = require('../controllers/GuestController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `guests-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.get('/', GuestController.getAllGuests);
router.get('/:id', GuestController.getGuestById);
router.post('/', GuestController.createGuest);
router.put('/:id', GuestController.updateGuest);
router.delete('/:id', GuestController.deleteGuest);
router.get('/export/csv', GuestController.exportCSV);
router.post('/import/csv', upload.single('csvFile'), GuestController.importCSV);

module.exports = router;