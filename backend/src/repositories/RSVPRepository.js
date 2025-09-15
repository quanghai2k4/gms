const RSVP = require('../models/RSVP');
const { getDatabase } = require('../utils/database');

class RSVPRepository {
  constructor() {
    this.db = getDatabase();
  }

  async initialize() {
    if (!this.db.getInstance()) {
      await this.db.connect();
    }
  }

  // Find RSVP by guest QR token
  async findByQRToken(token) {
    await this.initialize();
    
    const sql = `
      SELECT r.*, g.full_name, g.position, g.organization, g.phone_number, g.email,
              qr.token, qr.is_active as qr_active, qr.expires_at
      FROM rsvp_responses r
      JOIN guests g ON r.guest_id = g.id
      JOIN qr_codes qr ON g.id = qr.guest_id
       WHERE qr.token = ? AND qr.is_active = 1
    `;
    
    const row = await this.db.get(sql, [token]);
    if (!row) return null;

    return {
      rsvp: RSVP.fromRow(row),
      guest: {
        id: row.guest_id,
        fullName: row.full_name,
        position: row.position,
        organization: row.organization,
        phoneNumber: row.phone_number,
        email: row.email
      },
      qrCode: {
        token: row.token,
        isActive: Boolean(row.qr_active),
        expiresAt: row.expires_at
      }
    };
  }

  // Update RSVP response
  async updateResponse(token, responseData) {
    await this.initialize();

    const { response_status, notes } = responseData;
    
    return await this.db.transaction(async (db) => {
      // First, find the RSVP by QR token
      const existing = await this.findByQRToken(token);
      if (!existing) {
        throw new Error('RSVP not found or QR code is invalid');
      }

      // Check if QR code is expired
      if (existing.qrCode.expiresAt && new Date() > new Date(existing.qrCode.expiresAt)) {
        throw new Error('QR code has expired');
      }

      // Update the RSVP response
      const sql = `
        UPDATE rsvp_responses 
        SET response_status = ?, notes = ?, response_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE guest_id = ?
      `;
      
      const result = await db.run(sql, [response_status.toUpperCase(), notes || null, existing.guest.id]);
      
      if (result.changes === 0) {
        throw new Error('Failed to update RSVP response');
      }

      // Return updated RSVP data
      return await this.findByQRToken(token);
    });
  }

  // Get all RSVP responses (admin)
  async findAll({ page = 1, limit = 20, search = '', status = '' }) {
    await this.initialize();
    
    let sql = `
      SELECT r.*, g.full_name, g.position, g.organization, g.phone_number, g.email,
             CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END as checked_in
      FROM rsvp_responses r
      JOIN guests g ON r.guest_id = g.id
      LEFT JOIN check_ins c ON g.id = c.guest_id
    `;
    
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(g.full_name LIKE ? OR g.phone_number LIKE ? OR g.organization LIKE ?)`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (status) {
      conditions.push(`r.response_status = ?`);
      params.push(status.toUpperCase());
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY r.updated_at DESC`;

    // Count total for pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM rsvp_responses r
      JOIN guests g ON r.guest_id = g.id
    `;
    
    if (conditions.length > 0) {
      countSql += ` WHERE ${conditions.join(' AND ')}`;
    }

    const countResult = await this.db.get(countSql, params);
    const total = countResult.total;

    // Add pagination
    const offset = (page - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = await this.db.all(sql, params);
    const rsvpResponses = rows.map(row => ({
      ...RSVP.fromRow(row).toJSON(),
      guest: {
        id: row.guest_id,
        fullName: row.full_name,
        position: row.position,
        organization: row.organization,
        phoneNumber: row.phone_number,
        email: row.email
      },
      checkedIn: Boolean(row.checked_in)
    }));

    return {
      rsvpResponses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  // Update RSVP by ID (admin)
  async updateById(id, updateData) {
    await this.initialize();
    
    const { response_status, notes } = updateData;
    
    const sql = `
      UPDATE rsvp_responses 
      SET response_status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await this.db.run(sql, [response_status.toUpperCase(), notes || null, id]);
    
    if (result.changes === 0) {
      return null;
    }

    // Return updated RSVP with guest info
    const updatedSql = `
      SELECT r.*, g.full_name, g.position, g.organization, g.phone_number, g.email
      FROM rsvp_responses r
      JOIN guests g ON r.guest_id = g.id
      WHERE r.id = ?
    `;
    
    const row = await this.db.get(updatedSql, [id]);
    
    return {
      ...RSVP.fromRow(row).toJSON(),
      guest: {
        id: row.guest_id,
        fullName: row.full_name,
        position: row.position,
        organization: row.organization,
        phoneNumber: row.phone_number,
        email: row.email
      }
    };
  }

  // Get RSVP statistics
  async getStatistics() {
    await this.initialize();
    
    const stats = await this.db.get(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN response_status = 'ACCEPTED' THEN 1 END) as accepted,
        COUNT(CASE WHEN response_status = 'DECLINED' THEN 1 END) as declined,
        COUNT(CASE WHEN response_status = 'PENDING' THEN 1 END) as pending,
        COUNT(CASE WHEN response_date IS NOT NULL THEN 1 END) as responded
      FROM rsvp_responses
    `);

    return {
      total: stats.total,
      responses: {
        pending: stats.pending,
        accepted: stats.accepted,
        declined: stats.declined
      },
      responseRate: stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 0,
      acceptanceRate: stats.responded > 0 ? Math.round((stats.accepted / stats.responded) * 100) : 0
    };
  }
}

module.exports = RSVPRepository;