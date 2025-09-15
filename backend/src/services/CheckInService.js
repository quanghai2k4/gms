const CheckInRepository = require('../repositories/CheckInRepository');

class CheckInService {
  constructor() {
    this.checkInRepository = new CheckInRepository();
  }

  // Check in guest by QR code scan
  async checkInByQRToken(token, checkedInBy = null, notes = null) {
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

      const result = await this.checkInRepository.checkInByToken(token, checkedInBy, notes);

      return {
        success: true,
        data: {
          checkIn: result.checkIn,
          warning: result.warning
        },
        message: result.warning ? 
          'Guest checked in successfully with warning' : 
          'Guest checked in successfully'
      };

    } catch (error) {
      console.error('CheckInService.checkInByQRToken error:', error);
      
      if (error.message.includes('Invalid QR code')) {
        return {
          success: false,
          error: {
            code: 'INVALID_QR_CODE',
            message: 'QR code is invalid or guest not found'
          }
        };
      }

      if (error.message.includes('expired')) {
        return {
          success: false,
          error: {
            code: 'EXPIRED_QR_CODE',
            message: 'QR code has expired'
          }
        };
      }

      if (error.message.includes('already checked in')) {
        return {
          success: false,
          error: {
            code: 'ALREADY_CHECKED_IN',
            message: 'Guest has already checked in'
          }
        };
      }

      return {
        success: false,
        error: {
          code: 'CHECK_IN_ERROR',
          message: 'Failed to check in guest'
        }
      };
    }
  }

  // Manual check-in (admin)
  async checkInManual(guestId, checkedInBy, notes = null) {
    try {
      if (!guestId || isNaN(parseInt(guestId))) {
        return {
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        };
      }

      if (!checkedInBy || isNaN(parseInt(checkedInBy))) {
        return {
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'Valid user ID is required for manual check-in'
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

      const checkIn = await this.checkInRepository.checkInManual(
        parseInt(guestId), 
        parseInt(checkedInBy), 
        notes
      );

      return {
        success: true,
        data: { checkIn },
        message: 'Guest checked in manually'
      };

    } catch (error) {
      console.error('CheckInService.checkInManual error:', error);
      
      if (error.message.includes('Guest not found')) {
        return {
          success: false,
          error: {
            code: 'GUEST_NOT_FOUND',
            message: 'Guest not found'
          }
        };
      }

      if (error.message.includes('already checked in')) {
        return {
          success: false,
          error: {
            code: 'ALREADY_CHECKED_IN',
            message: 'Guest has already checked in'
          }
        };
      }

      return {
        success: false,
        error: {
          code: 'MANUAL_CHECK_IN_ERROR',
          message: 'Failed to check in guest manually'
        }
      };
    }
  }

  // Get all check-ins (admin)
  async getAllCheckIns({ page = 1, limit = 20, search = '', dateFrom = null, dateTo = null }) {
    try {
      // Validate date formats
      if (dateFrom && isNaN(Date.parse(dateFrom))) {
        return {
          success: false,
          error: {
            code: 'INVALID_DATE_FROM',
            message: 'Invalid date format for dateFrom'
          }
        };
      }

      if (dateTo && isNaN(Date.parse(dateTo))) {
        return {
          success: false,
          error: {
            code: 'INVALID_DATE_TO',
            message: 'Invalid date format for dateTo'
          }
        };
      }

      const result = await this.checkInRepository.findAll({
        page,
        limit,
        search,
        dateFrom,
        dateTo
      });

      return {
        success: true,
        data: {
          ...result,
          statistics: await this.checkInRepository.getStatistics(dateFrom, dateTo)
        }
      };

    } catch (error) {
      console.error('CheckInService.getAllCheckIns error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_CHECK_INS_ERROR',
          message: 'Failed to fetch check-ins'
        }
      };
    }
  }

  // Update check-in notes (admin)
  async updateCheckInNotes(id, notes, updatedBy = null) {
    try {
      if (!id || isNaN(parseInt(id))) {
        return {
          success: false,
          error: {
            code: 'INVALID_CHECK_IN_ID',
            message: 'Valid check-in ID is required'
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

      const checkIn = await this.checkInRepository.updateNotes(
        parseInt(id), 
        notes, 
        updatedBy
      );

      if (!checkIn) {
        return {
          success: false,
          error: {
            code: 'CHECK_IN_NOT_FOUND',
            message: 'Check-in record not found'
          }
        };
      }

      return {
        success: true,
        data: { checkIn },
        message: 'Check-in notes updated successfully'
      };

    } catch (error) {
      console.error('CheckInService.updateCheckInNotes error:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_CHECK_IN_ERROR',
          message: 'Failed to update check-in notes'
        }
      };
    }
  }

  // Delete check-in (admin)
  async deleteCheckIn(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        return {
          success: false,
          error: {
            code: 'INVALID_CHECK_IN_ID',
            message: 'Valid check-in ID is required'
          }
        };
      }

      const deleted = await this.checkInRepository.delete(parseInt(id));

      if (!deleted) {
        return {
          success: false,
          error: {
            code: 'CHECK_IN_NOT_FOUND',
            message: 'Check-in record not found'
          }
        };
      }

      return {
        success: true,
        message: 'Check-in deleted successfully'
      };

    } catch (error) {
      console.error('CheckInService.deleteCheckIn error:', error);
      return {
        success: false,
        error: {
          code: 'DELETE_CHECK_IN_ERROR',
          message: 'Failed to delete check-in'
        }
      };
    }
  }

  // Get check-in statistics (admin)
  async getCheckInStatistics(dateFrom = null, dateTo = null) {
    try {
      // Validate date formats
      if (dateFrom && isNaN(Date.parse(dateFrom))) {
        return {
          success: false,
          error: {
            code: 'INVALID_DATE_FROM',
            message: 'Invalid date format for dateFrom'
          }
        };
      }

      if (dateTo && isNaN(Date.parse(dateTo))) {
        return {
          success: false,
          error: {
            code: 'INVALID_DATE_TO',
            message: 'Invalid date format for dateTo'
          }
        };
      }

      const statistics = await this.checkInRepository.getStatistics(dateFrom, dateTo);

      return {
        success: true,
        data: { statistics }
      };

    } catch (error) {
      console.error('CheckInService.getCheckInStatistics error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_STATISTICS_ERROR',
          message: 'Failed to fetch check-in statistics'
        }
      };
    }
  }

  // Get recent check-ins (admin)
  async getRecentCheckIns(limit = 10) {
    try {
      if (limit && (isNaN(parseInt(limit)) || parseInt(limit) <= 0 || parseInt(limit) > 50)) {
        return {
          success: false,
          error: {
            code: 'INVALID_LIMIT',
            message: 'Limit must be a number between 1 and 50'
          }
        };
      }

      const recentCheckIns = await this.checkInRepository.getRecentCheckIns(parseInt(limit) || 10);

      return {
        success: true,
        data: { recentCheckIns }
      };

    } catch (error) {
      console.error('CheckInService.getRecentCheckIns error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_RECENT_CHECK_INS_ERROR',
          message: 'Failed to fetch recent check-ins'
        }
      };
    }
  }
}

module.exports = CheckInService;