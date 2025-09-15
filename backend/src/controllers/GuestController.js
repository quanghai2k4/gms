const GuestService = require('../services/GuestService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

class GuestController {
  constructor() {
    this.guestService = new GuestService();
  }

  // GET /api/v1/guests
  getAllGuests = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        status = ''
      } = req.query;

      const result = await this.guestService.getAllGuests({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Guests retrieved successfully'
      });

    } catch (error) {
      console.error('GuestController.getAllGuests error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // GET /api/v1/guests/:id
  getGuestById = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      const result = await this.guestService.getGuestById(parseInt(id));

      if (!result.success) {
        const statusCode = result.error.code === 'GUEST_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Guest details retrieved successfully'
      });

    } catch (error) {
      console.error('GuestController.getGuestById error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // POST /api/v1/guests
  createGuest = async (req, res) => {
    try {
      console.log('Creating guest with data:', req.body);
      const { fullName, position, organization, phoneNumber, email } = req.body;

      if (!fullName || fullName.trim() === '') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Full name is required'
          }
        });
      }

      const guestData = {
        full_name: fullName,
        position: position || null,
        organization: organization || null,
        phone_number: phoneNumber || null,
        email: email || null
      };

      console.log('Calling guestService.createGuest...');
      const result = await this.guestService.createGuest(guestData);
      console.log('Create guest result:', result);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);

    } catch (error) {
      console.error('GuestController.createGuest error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // PUT /api/v1/guests/:id
  updateGuest = async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, position, organization, phoneNumber, email } = req.body;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      if (!fullName || fullName.trim() === '') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Full name is required'
          }
        });
      }

      const guestData = {
        full_name: fullName,
        position: position || null,
        organization: organization || null,
        phone_number: phoneNumber || null,
        email: email || null
      };

      const result = await this.guestService.updateGuest(parseInt(id), guestData);

      if (!result.success) {
        const statusCode = result.error.code === 'GUEST_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json(result);

    } catch (error) {
      console.error('GuestController.updateGuest error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // DELETE /api/v1/guests/:id
  deleteGuest = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      const result = await this.guestService.deleteGuest(parseInt(id));

      if (!result.success) {
        const statusCode = result.error.code === 'GUEST_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json(result);

    } catch (error) {
      console.error('GuestController.deleteGuest error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // POST /api/v1/guests/import-csv
  importCSV = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE_UPLOADED',
            message: 'CSV file is required'
          }
        });
      }

      const result = await this.guestService.importGuestsFromCSV(req.file.buffer);
      
      res.json(result);

    } catch (error) {
      console.error('GuestController.importCSV error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // GET /api/v1/guests/export-csv
  exportCSV = async (req, res) => {
    try {
      const result = await this.guestService.exportGuestsToCSV();

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${result.data.filename}"`);
      res.send(result.data.csv);

    } catch (error) {
      console.error('GuestController.exportCSV error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // Multer middleware for CSV upload
  static csvUpload = upload.single('csvFile');
}

module.exports = new GuestController();