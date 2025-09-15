const QRCodeService = require('../services/QRCodeService');

class QRCodeController {
  constructor() {
    this.qrCodeService = new QRCodeService();
  }

  async getQRCodeByGuestId(req, res) {
    try {
      const { guestId } = req.params;
      
      if (!guestId || isNaN(guestId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      const qrCode = await this.qrCodeService.getQRCodeByGuestId(parseInt(guestId));
      
      res.json({
        success: true,
        data: {
          qrCode: qrCode.toJSON()
        },
        message: 'QR code retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getQRCodeByGuestId:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'QR_CODE_NOT_FOUND',
            message: error.message
          }
        });
      }

      if (error.message.includes('expired')) {
        return res.status(410).json({
          success: false,
          error: {
            code: 'QR_CODE_EXPIRED',
            message: error.message
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve QR code'
        }
      });
    }
  }

  async getQRCodeImage(req, res) {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'QR code token is required'
          }
        });
      }

      const imagePath = await this.qrCodeService.getQRCodeImage(token);
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.sendFile(imagePath);
      
    } catch (error) {
      console.error('Error in getQRCodeImage:', error);
      
      if (error.message.includes('not found') || error.message.includes('inactive')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'QR_CODE_NOT_FOUND',
            message: 'QR code image not found'
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve QR code image'
        }
      });
    }
  }

  async regenerateQRCode(req, res) {
    try {
      const { guestId } = req.params;
      
      if (!guestId || isNaN(guestId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      const newQRCode = await this.qrCodeService.regenerateQRCodeForGuest(parseInt(guestId));
      
      res.json({
        success: true,
        data: {
          qrCode: newQRCode.toJSON()
        },
        message: 'QR code regenerated successfully'
      });
    } catch (error) {
      console.error('Error in regenerateQRCode:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to regenerate QR code'
        }
      });
    }
  }

  async deactivateQRCode(req, res) {
    try {
      const { guestId } = req.params;
      
      if (!guestId || isNaN(guestId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      await this.qrCodeService.deactivateQRCode(parseInt(guestId));
      
      res.json({
        success: true,
        message: 'QR code deactivated successfully'
      });
    } catch (error) {
      console.error('Error in deactivateQRCode:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to deactivate QR code'
        }
      });
    }
  }

  async generateQRCode(req, res) {
    try {
      const { guestId } = req.params;
      
      if (!guestId || isNaN(guestId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GUEST_ID',
            message: 'Valid guest ID is required'
          }
        });
      }

      const qrCode = await this.qrCodeService.generateQRCodeForGuest(parseInt(guestId));
      
      res.status(201).json({
        success: true,
        data: {
          qrCode: qrCode.toJSON()
        },
        message: 'QR code generated successfully'
      });
    } catch (error) {
      console.error('Error in generateQRCode:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate QR code'
        }
      });
    }
  }
}

module.exports = QRCodeController;