const GuestRepository = require('../repositories/GuestRepository');
const QRCodeService = require('./QRCodeService');
const csv = require('csv-parse/sync');

class GuestService {
  constructor() {
    this.guestRepository = new GuestRepository();
    this.qrCodeService = new QRCodeService();
  }

  // Get all guests with filtering and pagination
  async getAllGuests({ page = 1, limit = 20, search = '', status = '' }) {
    try {
      const result = await this.guestRepository.findAll({ page, limit, search, status });
      return {
        success: true,
        data: {
          ...result,
          statistics: await this.guestRepository.getStatistics()
        }
      };
    } catch (error) {
      console.error('GuestService.getAllGuests error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_GUESTS_ERROR',
          message: 'Failed to fetch guests'
        }
      };
    }
  }

  // Get guest by ID
  async getGuestById(id) {
    try {
      const guest = await this.guestRepository.findById(id);
      if (!guest) {
        return {
          success: false,
          error: {
            code: 'GUEST_NOT_FOUND',
            message: 'Guest not found'
          }
        };
      }

      return {
        success: true,
        data: { guest }
      };
    } catch (error) {
      console.error('GuestService.getGuestById error:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_GUEST_ERROR',
          message: 'Failed to fetch guest details'
        }
      };
    }
  }

  // Create new guest
  async createGuest(guestData) {
    try {
      const guest = await this.guestRepository.create(guestData);
      return {
        success: true,
        data: { guest },
        message: 'Guest created successfully'
      };
    } catch (error) {
      console.error('GuestService.createGuest error:', error);
      
      if (error.message.includes('Validation failed')) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        };
      }

      return {
        success: false,
        error: {
          code: 'CREATE_GUEST_ERROR',
          message: 'Failed to create guest'
        }
      };
    }
  }

  // Update guest
  async updateGuest(id, guestData) {
    try {
      const guest = await this.guestRepository.update(id, guestData);
      if (!guest) {
        return {
          success: false,
          error: {
            code: 'GUEST_NOT_FOUND',
            message: 'Guest not found'
          }
        };
      }

      return {
        success: true,
        data: { guest },
        message: 'Guest updated successfully'
      };
    } catch (error) {
      console.error('GuestService.updateGuest error:', error);
      
      if (error.message.includes('Validation failed')) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        };
      }

      return {
        success: false,
        error: {
          code: 'UPDATE_GUEST_ERROR',
          message: 'Failed to update guest'
        }
      };
    }
  }

  // Delete guest
  async deleteGuest(id) {
    try {
      const deleted = await this.guestRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: {
            code: 'GUEST_NOT_FOUND',
            message: 'Guest not found'
          }
        };
      }

      return {
        success: true,
        message: 'Guest deleted successfully'
      };
    } catch (error) {
      console.error('GuestService.deleteGuest error:', error);
      return {
        success: false,
        error: {
          code: 'DELETE_GUEST_ERROR',
          message: 'Failed to delete guest'
        }
      };
    }
  }

  // Import guests from CSV
  async importGuestsFromCSV(csvBuffer) {
    try {
      const csvContent = csvBuffer.toString('utf8');
      const records = csv.parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      const importResult = {
        totalRows: records.length,
        successfulImports: 0,
        failedImports: 0,
        errors: [],
        importedGuests: []
      };

      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const rowNumber = i + 2; // +2 because CSV starts from row 2 (after header)

        try {
          // Map CSV columns to guest data
          const guestData = {
            full_name: record['Full Name'] || record['fullName'] || record['name'] || '',
            position: record['Position'] || record['position'] || record['title'] || '',
            organization: record['Organization'] || record['organization'] || record['company'] || '',
            phone_number: record['Phone'] || record['phone'] || record['phoneNumber'] || '',
            email: record['Email'] || record['email'] || ''
          };

          // Validate required fields
          if (!guestData.full_name.trim()) {
            throw new Error('Full name is required');
          }

          const guest = await this.guestRepository.create(guestData);
          importResult.successfulImports++;
          importResult.importedGuests.push({
            id: guest.id,
            fullName: guest.fullName,
            organization: guest.organization
          });

        } catch (error) {
          importResult.failedImports++;
          importResult.errors.push({
            row: rowNumber,
            error: error.message,
            data: record
          });
        }
      }

      return {
        success: true,
        data: { importResult },
        message: 'CSV import completed'
      };

    } catch (error) {
      console.error('GuestService.importGuestsFromCSV error:', error);
      return {
        success: false,
        error: {
          code: 'CSV_IMPORT_ERROR',
          message: 'Failed to process CSV file: ' + error.message
        }
      };
    }
  }

  // Get guest by QR token (for public RSVP access)
  async getGuestByQRToken(token) {
    try {
      const guest = await this.guestRepository.findByQRToken(token);
      if (!guest) {
        return {
          success: false,
          error: {
            code: 'INVALID_QR_TOKEN',
            message: 'Invalid or expired QR code'
          }
        };
      }

      // Check if QR code is expired
      if (guest.qrCode.expiresAt && new Date() > new Date(guest.qrCode.expiresAt)) {
        return {
          success: false,
          error: {
            code: 'QR_CODE_EXPIRED',
            message: 'QR code has expired'
          }
        };
      }

      return {
        success: true,
        data: { guest }
      };
    } catch (error) {
      console.error('GuestService.getGuestByQRToken error:', error);
      return {
        success: false,
        error: {
          code: 'QR_VALIDATION_ERROR',
          message: 'Failed to validate QR code'
        }
      };
    }
  }

  // Export guests to CSV
  async exportGuestsToCSV() {
    try {
      const result = await this.guestRepository.findAll({ page: 1, limit: 10000 }); // Get all
      const guests = result.guests;

      const csvHeader = 'Full Name,Position,Organization,Phone,Email,RSVP Status,Checked In,Created At\n';
      const csvRows = guests.map(guest => {
        return [
          `"${guest.fullName || ''}"`,
          `"${guest.position || ''}"`,
          `"${guest.organization || ''}"`,
          `"${guest.phoneNumber || ''}"`,
          `"${guest.email || ''}"`,
          `"${guest.rsvpStatus || 'PENDING'}"`,
          `"${guest.checkedIn ? 'Yes' : 'No'}"`,
          `"${guest.createdAt || ''}"`
        ].join(',');
      }).join('\n');

      return {
        success: true,
        data: {
          csv: csvHeader + csvRows,
          filename: `guests_export_${new Date().toISOString().split('T')[0]}.csv`
        }
      };

    } catch (error) {
      console.error('GuestService.exportGuestsToCSV error:', error);
      return {
        success: false,
        error: {
          code: 'CSV_EXPORT_ERROR',
          message: 'Failed to export guests to CSV'
        }
      };
    }
  }
}

module.exports = GuestService;