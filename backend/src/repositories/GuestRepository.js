const Guest = require('../models/Guest');
const { getDatabase } = require('../utils/database');

class GuestRepository {
  constructor() {
    this.db = getDatabase();
  }

  async initialize() {
    if (!this.db.getInstance()) {
      await this.db.connect();
    }
  }

  // Get all guests with pagination
  async findAll({ page = 1, limit = 20, search = '', status = '' }) {
    await this.initialize();
    
    let sql = `
      SELECT g.*, 
             r.response_status,
             CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END as checked_in
      FROM guests g
      LEFT JOIN rsvp_responses r ON g.id = r.guest_id
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

    sql += ` ORDER BY g.created_at DESC`;

    // Count total for pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM guests g
      LEFT JOIN rsvp_responses r ON g.id = r.guest_id
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
    const guests = rows.map(row => ({
      ...Guest.fromRow(row).toJSON(),
      rsvpStatus: row.response_status || 'PENDING',
      checkedIn: Boolean(row.checked_in)
    }));

    return {
      guests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  // Find guest by ID
  async findById(id) {
    await this.initialize();
    
    const sql = `
      SELECT g.*, 
             r.response_status, r.notes as rsvp_notes, r.response_date,
             CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END as checked_in,
             c.check_in_time
      FROM guests g
      LEFT JOIN rsvp_responses r ON g.id = r.guest_id
      LEFT JOIN check_ins c ON g.id = c.guest_id
      WHERE g.id = ?
    `;
    
    const row = await this.db.get(sql, [id]);
    if (!row) return null;

    return {
      ...Guest.fromRow(row).toJSON(),
      rsvp: row.response_status ? {
        status: row.response_status,
        notes: row.rsvp_notes,
        responseDate: row.response_date
      } : null,
      checkIn: row.checked_in ? {
        checkInTime: row.check_in_time
      } : null
    };
  }

  // Find guest by QR token
  async findByQRToken(token) {
    await this.initialize();
    
    const sql = `
      SELECT g.*, 
              qr.token, qr.qr_image_path, qr.is_active, qr.expires_at,
             r.response_status, r.notes as rsvp_notes, r.response_date
      FROM guests g
      JOIN qr_codes qr ON g.id = qr.guest_id
      LEFT JOIN rsvp_responses r ON g.id = r.guest_id
       WHERE qr.token = ? AND qr.is_active = 1
    `;
    
    const row = await this.db.get(sql, [token]);
    if (!row) return null;

    return {
      ...Guest.fromRow(row).toJSON(),
      qrCode: {
        token: row.token,
        url: row.qr_image_path,
        isActive: Boolean(row.is_active),
        expiresAt: row.expires_at
      },
      rsvp: row.response_status ? {
        status: row.response_status,
        notes: row.rsvp_notes,
        responseDate: row.response_date
      } : null
    };
  }

  // Create new guest
  async create(guestData) {
    await this.initialize();
    
    const guest = new Guest(guestData);
    const validation = guest.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return await this.db.transaction(async (db) => {
      // Insert guest
      const result = await db.run(`
        INSERT INTO guests (full_name, position, organization, phone_number, email)
        VALUES (?, ?, ?, ?, ?)
      `, [guest.full_name, guest.position, guest.organization, guest.phone_number, guest.email]);

      const guestId = result.id;

      // Create QR code
      const qrToken = await this.generateQRToken();
      const qrUrl = `${process.env.QR_BASE_URL}/${qrToken}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(process.env.QR_EXPIRES_DAYS || 365));

      await db.run(`
        INSERT INTO qr_codes (guest_id, token, qr_image_path, expires_at)
        VALUES (?, ?, ?, ?)
      `, [guestId, qrToken, qrUrl, expiresAt.toISOString()]);

      // Create initial RSVP record
      await db.run(`
        INSERT INTO rsvp_responses (guest_id, response_status)
        VALUES (?, 'PENDING')
      `, [guestId]);

      return await this.findById(guestId);
    });
  }

  // Update guest
  async update(id, guestData) {
    await this.initialize();
    
    const existingGuest = await this.findById(id);
    if (!existingGuest) {
      return null;
    }

    const guest = new Guest({ ...existingGuest, ...guestData });
    const validation = guest.validate();
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    await this.db.run(`
      UPDATE guests 
      SET full_name = ?, position = ?, organization = ?, phone_number = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [guest.full_name, guest.position, guest.organization, guest.phone_number, guest.email, id]);

    return await this.findById(id);
  }

  // Delete guest
  async delete(id) {
    await this.initialize();
    
    const result = await this.db.run('DELETE FROM guests WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Get statistics
  async getStatistics() {
    await this.initialize();
    
    const stats = await this.db.get(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN r.response_status = 'ACCEPTED' THEN 1 END) as accepted,
        COUNT(CASE WHEN r.response_status = 'DECLINED' THEN 1 END) as declined,
        COUNT(CASE WHEN r.response_status = 'PENDING' THEN 1 END) as pending,
        COUNT(c.id) as checked_in
      FROM guests g
      LEFT JOIN rsvp_responses r ON g.id = r.guest_id
      LEFT JOIN check_ins c ON g.id = c.guest_id
    `);

    return {
      total: stats.total,
      responses: {
        pending: stats.pending,
        accepted: stats.accepted,
        declined: stats.declined
      },
      responseRate: stats.total > 0 ? `${Math.round(((stats.accepted + stats.declined) / stats.total) * 100)}%` : '0%',
      checkedIn: stats.checked_in
    };
  }

  // Generate unique QR token
  async generateQRToken() {
    const { v4: uuidv4 } = require('uuid');
    
    let token;
    let exists = true;
    
    while (exists) {
      token = uuidv4().replace(/-/g, '').substring(0, 12);
      const existing = await this.db.get('SELECT id FROM qr_codes WHERE token = ?', [token]);
      exists = !!existing;
    }
    
    return token;
  }
}

module.exports = GuestRepository;