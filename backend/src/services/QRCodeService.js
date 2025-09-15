const QRCodeRepository = require('../repositories/QRCodeRepository');
const QRCodeGenerator = require('qrcode');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class QRCodeService {
  constructor() {
    this.qrCodeRepository = new QRCodeRepository();
    this.qrImageDir = path.join(process.cwd(), 'uploads', 'qr-codes');
    this.ensureQRImageDir();
  }

  async ensureQRImageDir() {
    try {
      await fs.access(this.qrImageDir);
    } catch (error) {
      await fs.mkdir(this.qrImageDir, { recursive: true });
    }
  }

  async getQRCodeByGuestId(guestId) {
    try {
      const qrCode = await this.qrCodeRepository.findByGuestId(guestId);
      
      if (!qrCode) {
        throw new Error('QR code not found for this guest');
      }

      if (this.isExpired(qrCode.expiresAt)) {
        throw new Error('QR code has expired');
      }

      return qrCode;
    } catch (error) {
      console.error('Error getting QR code by guest ID:', error);
      throw error;
    }
  }

  async getQRCodeByToken(token) {
    try {
      const qrCode = await this.qrCodeRepository.findByToken(token);
      
      if (!qrCode) {
        throw new Error('Invalid QR code token');
      }

      if (!qrCode.isActive) {
        throw new Error('QR code is inactive');
      }

      if (this.isExpired(qrCode.expiresAt)) {
        throw new Error('QR code has expired');
      }

      return qrCode;
    } catch (error) {
      console.error('Error getting QR code by token:', error);
      throw error;
    }
  }

  async generateQRCodeForGuest(guestId) {
    try {
      const token = uuidv4().replace(/-/g, '').substring(0, 12);
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      
      const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invitation/${token}`;
      
      const qrImageFileName = `qr_${token}.png`;
      const qrImagePath = path.join(this.qrImageDir, qrImageFileName);
      
      await QRCodeGenerator.toFile(qrImagePath, invitationUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const relativePath = path.join('uploads', 'qr-codes', qrImageFileName);
      
      const qrCode = await this.qrCodeRepository.create(
        guestId,
        token,
        relativePath,
        expiresAt.toISOString()
      );

      return qrCode;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  async regenerateQRCodeForGuest(guestId) {
    try {
      await this.qrCodeRepository.deactivateByGuestId(guestId);
      
      const newQRCode = await this.generateQRCodeForGuest(guestId);
      
      return newQRCode;
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      throw error;
    }
  }

  async getQRCodeImage(token) {
    try {
      const qrCode = await this.qrCodeRepository.findByToken(token);
      
      if (!qrCode || !qrCode.isActive) {
        throw new Error('QR code not found or inactive');
      }

      // Check if qrImagePath is a URL or file path
      let imagePath;
      if (qrCode.qrImagePath.startsWith('http://') || qrCode.qrImagePath.startsWith('https://')) {
        // It's a URL, generate proper file path
        const qrImageFileName = `qr_${token}.png`;
        imagePath = path.join(this.qrImageDir, qrImageFileName);
      } else {
        // It's already a file path
        imagePath = path.join(process.cwd(), qrCode.qrImagePath);
      }
      
      try {
        await fs.access(imagePath);
        return imagePath;
      } catch (error) {
        console.log('QR image file not found, regenerating...');
        
        const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invitation/${token}`;
        
        await QRCodeGenerator.toFile(imagePath, invitationUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        return imagePath;
      }
    } catch (error) {
      console.error('Error getting QR code image:', error);
      throw error;
    }
  }

  async deactivateQRCode(guestId) {
    try {
      await this.qrCodeRepository.deactivateByGuestId(guestId);
      return { success: true, message: 'QR code deactivated successfully' };
    } catch (error) {
      console.error('Error deactivating QR code:', error);
      throw error;
    }
  }

  isExpired(expiresAt) {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  }
}

module.exports = QRCodeService;