const RSVPRepository = require('../repositories/RSVPRepository');

class RSVPService {
  constructor() {
    this.rsvpRepository = new RSVPRepository();
  }

  // Get RSVP form data by QR token (public)
  async getRSVPByToken(token) {
    try {
      if (!token || token.trim() === '') {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Valid QR token is required'
          }
        };
      }

      const rsvpData = await this.rsvpRepository.findByQRToken(token);
      
      if (!rsvpData) {
        return {
          success: false,
          error: {
            code: 'INVALID_OR_EXPIRED_TOKEN',
            message: 'QR code is invalid or has expired'
          }
        };
      }

      return {
        success: true,
        data: {
          rsvp: rsvpData.rsvp.toJSON(),
          guest: rsvpData.guest,
          qrCode: rsvpData.qrCode
        }
      };

    } catch (error) {
      console.error('RSVPService.getRSVPByToken error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_RSVP_ERROR',
          message: 'Failed to retrieve RSVP information'
        }
      };
    }
  }

  // Submit RSVP response (public)
  async submitRSVPResponse(token, responseData) {
    try {
      const { responseStatus, notes } = responseData;

      // Validate required fields
      if (!token || token.trim() === '') {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Valid QR token is required'
          }
        };
      }

      if (!responseStatus || !['ACCEPTED', 'DECLINED'].includes(responseStatus.toUpperCase())) {
        return {
          success: false,
          error: {
            code: 'INVALID_RESPONSE_STATUS',
            message: 'Response status must be either ACCEPTED or DECLINED'
          }
        };
      }

      // Validate notes length
      if (notes && notes.length > 500) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Notes cannot exceed 500 characters'
          }
        };
      }

      const updatedRSVP = await this.rsvpRepository.updateResponse(token, {
        response_status: responseStatus,
        notes: notes
      });

      return {
        success: true,
        data: {
          rsvp: updatedRSVP.rsvp.toJSON(),
          guest: updatedRSVP.guest
        },
        message: 'RSVP response submitted successfully'
      };

    } catch (error) {
      console.error('RSVPService.submitRSVPResponse error:', error);
      
      if (error.message.includes('not found') || error.message.includes('invalid')) {
        return {
          success: false,
          error: {
            code: 'INVALID_OR_EXPIRED_TOKEN',
            message: 'QR code is invalid or has expired'
          }
        };
      }

      if (error.message.includes('expired')) {
        return {
          success: false,
          error: {
            code: 'EXPIRED_TOKEN',
            message: 'QR code has expired'
          }
        };
      }

      return {
        success: false,
        error: {
          code: 'SUBMIT_RSVP_ERROR',
          message: 'Failed to submit RSVP response'
        }
      };
    }
  }

  // Get all RSVP responses (admin)
  async getAllRSVPResponses({ page = 1, limit = 20, search = '', status = '' }) {
    try {
      const result = await this.rsvpRepository.findAll({ page, limit, search, status });
      
      return {
        success: true,
        data: {
          ...result,
          statistics: await this.rsvpRepository.getStatistics()
        }
      };

    } catch (error) {
      console.error('RSVPService.getAllRSVPResponses error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_RSVP_RESPONSES_ERROR',
          message: 'Failed to fetch RSVP responses'
        }
      };
    }
  }

  // Update RSVP response by ID (admin)
  async updateRSVPResponse(id, updateData) {
    try {
      const { responseStatus, notes } = updateData;

      if (!id || isNaN(parseInt(id))) {
        return {
          success: false,
          error: {
            code: 'INVALID_RSVP_ID',
            message: 'Valid RSVP ID is required'
          }
        };
      }

      if (!responseStatus || !['PENDING', 'ACCEPTED', 'DECLINED'].includes(responseStatus.toUpperCase())) {
        return {
          success: false,
          error: {
            code: 'INVALID_RESPONSE_STATUS',
            message: 'Response status must be one of: PENDING, ACCEPTED, DECLINED'
          }
        };
      }

      // Validate notes length
      if (notes && notes.length > 500) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Notes cannot exceed 500 characters'
          }
        };
      }

      const updatedRSVP = await this.rsvpRepository.updateById(parseInt(id), {
        response_status: responseStatus,
        notes: notes
      });

      if (!updatedRSVP) {
        return {
          success: false,
          error: {
            code: 'RSVP_NOT_FOUND',
            message: 'RSVP response not found'
          }
        };
      }

      return {
        success: true,
        data: { rsvp: updatedRSVP },
        message: 'RSVP response updated successfully'
      };

    } catch (error) {
      console.error('RSVPService.updateRSVPResponse error:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_RSVP_ERROR',
          message: 'Failed to update RSVP response'
        }
      };
    }
  }

  // Get RSVP statistics (admin)
  async getRSVPStatistics() {
    try {
      const statistics = await this.rsvpRepository.getStatistics();
      
      return {
        success: true,
        data: { statistics }
      };

    } catch (error) {
      console.error('RSVPService.getRSVPStatistics error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_STATISTICS_ERROR',
          message: 'Failed to fetch RSVP statistics'
        }
      };
    }
  }
}

module.exports = RSVPService;