const CheckInService = require('../services/CheckInService');

class CheckInController {
  constructor() {
    this.checkInService = new CheckInService();
  }

  // POST /api/v1/checkin/qr/:token - Check in guest by QR code
  checkInByQRToken = async (req, res) => {
    try {
      const { token } = req.params;
      const { notes } = req.body;
      // TODO: Get checkedInBy from authenticated user session
      const checkedInBy = req.user?.id || null;

      if (!token || token.trim() === '') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Valid QR token is required'
          }
        });
      }

      const result = await this.checkInService.checkInByQRToken(token, checkedInBy, notes);

      if (!result.success) {
        let statusCode = 400;
        if (['INVALID_QR_CODE', 'EXPIRED_QR_CODE'].includes(result.error.code)) {
          statusCode = 404;
        } else if (result.error.code === 'ALREADY_CHECKED_IN') {
          statusCode = 409;
        }
        return res.status(statusCode).json(result);
      }

      res.status(201).json(result);

    } catch (error) {
      console.error('CheckInController.checkInByQRToken error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // POST /api/v1/admin/checkin/manual - Manual check-in (admin)
  checkInManual = async (req, res) => {
    try {
      const { guestId, notes } = req.body;
      // TODO: Get checkedInBy from authenticated user session
      const checkedInBy = req.user?.id || 1; // Default admin user for now

      if (!guestId || isNaN(parseInt(guestId))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      const result = await this.checkInService.checkInManual(
        parseInt(guestId),
        checkedInBy,
        notes
      );

      if (!result.success) {
        let statusCode = 400;
        if (result.error.code === 'GUEST_NOT_FOUND') {
          statusCode = 404;
        } else if (result.error.code === 'ALREADY_CHECKED_IN') {
          statusCode = 409;
        }
        return res.status(statusCode).json(result);
      }

      res.status(201).json(result);

    } catch (error) {
      console.error('CheckInController.checkInManual error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // GET /api/v1/admin/checkin - Get all check-ins (admin)
  getAllCheckIns = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        dateFrom = null,
        dateTo = null
      } = req.query;

      const result = await this.checkInService.getAllCheckIns({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        dateFrom,
        dateTo
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Check-ins retrieved successfully'
      });

    } catch (error) {
      console.error('CheckInController.getAllCheckIns error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // PUT /api/v1/admin/checkin/:id/notes - Update check-in notes (admin)
  updateCheckInNotes = async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      // TODO: Get updatedBy from authenticated user session
      const updatedBy = req.user?.id || null;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CHECK_IN_ID',
            message: 'Valid check-in ID is required'
          }
        });
      }

      const result = await this.checkInService.updateCheckInNotes(
        parseInt(id),
        notes,
        updatedBy
      );

      if (!result.success) {
        const statusCode = result.error.code === 'CHECK_IN_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json(result);

    } catch (error) {
      console.error('CheckInController.updateCheckInNotes error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // DELETE /api/v1/admin/checkin/:id - Delete check-in (admin)
  deleteCheckIn = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CHECK_IN_ID',
            message: 'Valid check-in ID is required'
          }
        });
      }

      const result = await this.checkInService.deleteCheckIn(parseInt(id));

      if (!result.success) {
        const statusCode = result.error.code === 'CHECK_IN_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json(result);

    } catch (error) {
      console.error('CheckInController.deleteCheckIn error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // GET /api/v1/admin/checkin/statistics - Get check-in statistics (admin)
  getCheckInStatistics = async (req, res) => {
    try {
      const { dateFrom = null, dateTo = null } = req.query;

      const result = await this.checkInService.getCheckInStatistics(dateFrom, dateTo);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Check-in statistics retrieved successfully'
      });

    } catch (error) {
      console.error('CheckInController.getCheckInStatistics error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // GET /api/v1/admin/checkin/recent - Get recent check-ins (admin)
  getRecentCheckIns = async (req, res) => {
    try {
      const { limit = 10 } = req.query;

      const result = await this.checkInService.getRecentCheckIns(parseInt(limit));

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Recent check-ins retrieved successfully'
      });

    } catch (error) {
      console.error('CheckInController.getRecentCheckIns error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };
}

module.exports = new CheckInController();