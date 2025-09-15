const RSVPService = require('../services/RSVPService');

class RSVPController {
  constructor() {
    this.rsvpService = new RSVPService();
  }

  // GET /api/v1/rsvp/:token - Get RSVP form data (public)
  getRSVPByToken = async (req, res) => {
    try {
      const { token } = req.params;

      if (!token || token.trim() === '') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Valid QR token is required'
          }
        });
      }

      const result = await this.rsvpService.getRSVPByToken(token);

      if (!result.success) {
        const statusCode = result.error.code === 'INVALID_OR_EXPIRED_TOKEN' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        message: 'RSVP information retrieved successfully'
      });

    } catch (error) {
      console.error('RSVPController.getRSVPByToken error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // POST /api/v1/rsvp/:token - Submit RSVP response (public)
  submitRSVPResponse = async (req, res) => {
    try {
      const { token } = req.params;
      const { responseStatus, notes } = req.body;

      if (!token || token.trim() === '') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Valid QR token is required'
          }
        });
      }

      if (!responseStatus || !['ACCEPTED', 'DECLINED'].includes(responseStatus.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RESPONSE_STATUS',
            message: 'Response status must be either ACCEPTED or DECLINED'
          }
        });
      }

      const result = await this.rsvpService.submitRSVPResponse(token, {
        responseStatus,
        notes
      });

      if (!result.success) {
        const statusCode = ['INVALID_OR_EXPIRED_TOKEN', 'EXPIRED_TOKEN'].includes(result.error.code) ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json(result);

    } catch (error) {
      console.error('RSVPController.submitRSVPResponse error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // GET /api/v1/admin/rsvp - Get all RSVP responses (admin)
  getAllRSVPResponses = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        status = ''
      } = req.query;

      const result = await this.rsvpService.getAllRSVPResponses({
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
        message: 'RSVP responses retrieved successfully'
      });

    } catch (error) {
      console.error('RSVPController.getAllRSVPResponses error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // PUT /api/v1/admin/rsvp/:id - Update RSVP response (admin)
  updateRSVPResponse = async (req, res) => {
    try {
      const { id } = req.params;
      const { responseStatus, notes } = req.body;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RSVP_ID',
            message: 'Valid RSVP ID is required'
          }
        });
      }

      if (!responseStatus || !['PENDING', 'ACCEPTED', 'DECLINED'].includes(responseStatus.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RESPONSE_STATUS',
            message: 'Response status must be one of: PENDING, ACCEPTED, DECLINED'
          }
        });
      }

      const result = await this.rsvpService.updateRSVPResponse(parseInt(id), {
        responseStatus,
        notes
      });

      if (!result.success) {
        const statusCode = result.error.code === 'RSVP_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json(result);

    } catch (error) {
      console.error('RSVPController.updateRSVPResponse error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };

  // GET /api/v1/admin/rsvp/statistics - Get RSVP statistics (admin)
  getRSVPStatistics = async (req, res) => {
    try {
      const result = await this.rsvpService.getRSVPStatistics();

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        message: 'RSVP statistics retrieved successfully'
      });

    } catch (error) {
      console.error('RSVPController.getRSVPStatistics error:', error);
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

module.exports = new RSVPController();