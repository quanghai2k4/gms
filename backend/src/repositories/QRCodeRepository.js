const { getDatabase } = require('../utils/database');
const QRCode = require('../models/QRCode');

class QRCodeRepository {
  constructor() {
    this.db = getDatabase();
  }

  async findByGuestId(guestId) {
    try {
      const query = `
        SELECT * FROM qr_codes 
        WHERE guest_id = ? AND is_active = 1
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      const row = await this.db.get(query, [guestId]);
      return row ? QRCode.fromDatabase(row) : null;
    } catch (error) {
      console.error('Error finding QR code by guest ID:', error);
      throw error;
    }
  }

  async findByToken(token) {
    try {
      const query = `
        SELECT qc.*, g.full_name, g.position, g.organization 
        FROM qr_codes qc
        JOIN guests g ON qc.guest_id = g.id
        WHERE qc.token = ? AND qc.is_active = 1
      `;
      
      const row = await this.db.get(query, [token]);
      if (row) {
        const qrCode = QRCode.fromDatabase(row);
        qrCode.guest = {
          fullName: row.full_name,
          position: row.position,
          organization: row.organization
        };
        return qrCode;
      }
      return null;
    } catch (error) {
      console.error('Error finding QR code by token:', error);
      throw error;
    }
  }

  async create(guestId, token, qrImagePath, expiresAt) {
    try {
      const query = `
        INSERT INTO qr_codes (guest_id, token, qr_image_path, is_active, expires_at, created_at, updated_at)
        VALUES (?, ?, ?, 1, ?, datetime('now'), datetime('now'))
      `;
      
      const result = await this.db.run(query, [guestId, token, qrImagePath, expiresAt]);
      
      if (result.lastID) {
        return await this.findById(result.lastID);
      }
      return null;
    } catch (error) {
      console.error('Error creating QR code:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const query = 'SELECT * FROM qr_codes WHERE id = ?';
      const row = await this.db.get(query, [id]);
      return row ? QRCode.fromDatabase(row) : null;
    } catch (error) {
      console.error('Error finding QR code by ID:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updates).forEach(key => {
        if (key === 'isActive') {
          fields.push('is_active = ?');
          values.push(updates[key] ? 1 : 0);
        } else if (key === 'qrImagePath') {
          fields.push('qr_image_path = ?');
          values.push(updates[key]);
        } else if (key === 'expiresAt') {
          fields.push('expires_at = ?');
          values.push(updates[key]);
        } else if (key === 'token') {
          fields.push('token = ?');
          values.push(updates[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }

      fields.push('updated_at = datetime(\'now\')');
      values.push(id);

      const query = `UPDATE qr_codes SET ${fields.join(', ')} WHERE id = ?`;
      
      await this.db.run(query, values);
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating QR code:', error);
      throw error;
    }
  }

  async deactivateByGuestId(guestId) {
    try {
      const query = `
        UPDATE qr_codes 
        SET is_active = 0, updated_at = datetime('now')
        WHERE guest_id = ? AND is_active = 1
      `;
      
      await this.db.run(query, [guestId]);
      return true;
    } catch (error) {
      console.error('Error deactivating QR codes for guest:', error);
      throw error;
    }
  }

  async deleteByGuestId(guestId) {
    try {
      const query = 'DELETE FROM qr_codes WHERE guest_id = ?';
      await this.db.run(query, [guestId]);
      return true;
    } catch (error) {
      console.error('Error deleting QR codes for guest:', error);
      throw error;
    }
  }
}

module.exports = QRCodeRepository;