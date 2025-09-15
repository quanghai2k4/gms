const CheckIn = require('../models/CheckIn');
const { getDatabase } = require('../utils/database');

class CheckInRepository {
  constructor() {
    this.db = getDatabase();
  }

  async initialize() {
    if (!this.db.getInstance()) {
      await this.db.connect();
    }
  }

  // Check in guest by QR token
  async checkInByToken(token, checkedInBy = null, notes = null) {
    await this.initialize();

    return await this.db.transaction(async (db) => {
      // First, find guest by QR token and verify RSVP
      const guestSql = `
        SELECT g.*, qr.token, qr.is_active, qr.expires_at,
               r.response_status,
               c.id as check_in_id
        FROM guests g
        JOIN qr_codes qr ON g.id = qr.guest_id
        LEFT JOIN rsvp_responses r ON g.id = r.guest_id
        LEFT JOIN check_ins c ON g.id = c.guest_id
        WHERE qr.token = ? AND qr.is_active = 1
      `;
      
      const guestData = await db.get(guestSql, [token]);
      
      if (!guestData) {
        throw new Error('Invalid QR code or guest not found');
      }

      // Check if QR code is expired
      if (guestData.expires_at && new Date() > new Date(guestData.expires_at)) {
        throw new Error('QR code has expired');
      }

      // Check if guest already checked in
      if (guestData.check_in_id) {
        throw new Error('Guest has already checked in');
      }

      // Check RSVP status (optional - can check in even without RSVP)
      const rsvpWarning = guestData.response_status !== 'ACCEPTED' ? 
        `Guest RSVP status is ${guestData.response_status || 'PENDING'}` : null;

      // Create check-in record
      const checkInResult = await db.run(`
        INSERT INTO check_ins (guest_id, check_in_time, check_in_by, notes)
        VALUES (?, CURRENT_TIMESTAMP, ?, ?)
      `, [guestData.id, checkedInBy, notes]);

      // Get the complete check-in data
      const checkInData = await this.findById(checkInResult.id);
      
      return {
        checkIn: checkInData,
        warning: rsvpWarning
      };
    });
  }

  // Find check-in by ID
  async findById(id) {
    await this.initialize();
    
    const sql = `
      SELECT c.*, g.full_name, g.position, g.organization, g.phone_number, g.email,
             r.response_status
      FROM check_ins c
      JOIN guests g ON c.guest_id = g.id
      LEFT JOIN rsvp_responses r ON g.id = r.guest_id
      WHERE c.id = ?
    `;
    
    const row = await this.db.get(sql, [id]);
    if (!row) return null;

    return {
      ...CheckIn.fromRow(row).toJSON(),
      guest: {
        id: row.guest_id,
        fullName: row.full_name,
        position: row.position,
        organization: row.organization,
        phoneNumber: row.phone_number,
        email: row.email
      },
      rsvpStatus: row.response_status
    };
  }

  // Get all check-ins with filtering and pagination
  async findAll({ page = 1, limit = 20, search = '', dateFrom = null, dateTo = null }) {
    await this.initialize();
    
    let sql = `
      SELECT c.*, g.full_name, g.position, g.organization, g.phone_number, g.email,
             r.response_status
      FROM check_ins c
      JOIN guests g ON c.guest_id = g.id
      LEFT JOIN rsvp_responses r ON g.id = r.guest_id
    `;
    
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(g.full_name LIKE ? OR g.phone_number LIKE ? OR g.organization LIKE ?)`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (dateFrom) {
      conditions.push(`DATE(c.check_in_time) >= ?`);
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push(`DATE(c.check_in_time) <= ?`);
      params.push(dateTo);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY c.check_in_time DESC`;

    // Count total for pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM check_ins c
      JOIN guests g ON c.guest_id = g.id
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
    const checkIns = rows.map(row => ({
      ...CheckIn.fromRow(row).toJSON(),
      guest: {
        id: row.guest_id,
        fullName: row.full_name,
        position: row.position,
        organization: row.organization,
        phoneNumber: row.phone_number,
        email: row.email
      },
      rsvpStatus: row.response_status
    }));

    return {
      checkIns,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  // Manual check-in (admin)
  async checkInManual(guestId, checkedInBy, notes = null) {
    await this.initialize();

    return await this.db.transaction(async (db) => {
      // Check if guest exists
      const guest = await db.get('SELECT id FROM guests WHERE id = ?', [guestId]);
      if (!guest) {
        throw new Error('Guest not found');
      }

      // Check if already checked in
      const existingCheckIn = await db.get('SELECT id FROM check_ins WHERE guest_id = ?', [guestId]);
      if (existingCheckIn) {
        throw new Error('Guest has already checked in');
      }

      // Create check-in record
      const result = await db.run(`
        INSERT INTO check_ins (guest_id, check_in_time, check_in_by, notes)
        VALUES (?, CURRENT_TIMESTAMP, ?, ?)
      `, [guestId, checkedInBy, notes]);

      return await this.findById(result.id);
    });
  }

  // Update check-in notes
  async updateNotes(id, notes, updatedBy = null) {
    await this.initialize();
    
    const result = await this.db.run(`
      UPDATE check_ins 
      SET notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [notes, id]);
    
    if (result.changes === 0) {
      return null;
    }

    return await this.findById(id);
  }

  // Delete check-in (admin)
  async delete(id) {
    await this.initialize();
    
    const result = await this.db.run('DELETE FROM check_ins WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Get check-in statistics
  async getStatistics(dateFrom = null, dateTo = null) {
    await this.initialize();
    
    let sql = `
      SELECT 
        COUNT(*) as total_checked_in,
        COUNT(CASE WHEN r.response_status = 'ACCEPTED' THEN 1 END) as checked_in_with_rsvp,
        COUNT(CASE WHEN r.response_status != 'ACCEPTED' OR r.response_status IS NULL THEN 1 END) as checked_in_without_rsvp,
        MIN(c.check_in_time) as first_check_in,
        MAX(c.check_in_time) as last_check_in
      FROM check_ins c
      LEFT JOIN rsvp_responses r ON c.guest_id = r.guest_id
    `;

    const params = [];
    const conditions = [];

    if (dateFrom) {
      conditions.push(`DATE(c.check_in_time) >= ?`);
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push(`DATE(c.check_in_time) <= ?`);
      params.push(dateTo);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    const stats = await this.db.get(sql, params);

    // Get hourly check-in distribution
    let hourlySql = `
      SELECT 
        strftime('%H', c.check_in_time) as hour,
        COUNT(*) as count
      FROM check_ins c
    `;

    if (conditions.length > 0) {
      hourlySql += ` WHERE ${conditions.join(' AND ')}`;
    }

    hourlySql += ` GROUP BY strftime('%H', c.check_in_time) ORDER BY hour`;

    const hourlyStats = await this.db.all(hourlySql, params);

    return {
      totalCheckedIn: stats.total_checked_in,
      checkedInWithRSVP: stats.checked_in_with_rsvp,
      checkedInWithoutRSVP: stats.checked_in_without_rsvp,
      firstCheckIn: stats.first_check_in,
      lastCheckIn: stats.last_check_in,
      hourlyDistribution: hourlyStats.map(row => ({
        hour: `${row.hour}:00`,
        count: row.count
      }))
    };
  }

  // Get recent check-ins
  async getRecentCheckIns(limit = 10) {
    await this.initialize();
    
    const sql = `
      SELECT c.*, g.full_name, g.position, g.organization
      FROM check_ins c
      JOIN guests g ON c.guest_id = g.id
      ORDER BY c.check_in_time DESC
      LIMIT ?
    `;
    
    const rows = await this.db.all(sql, [limit]);
    
    return rows.map(row => ({
      ...CheckIn.fromRow(row).toJSON(),
      guest: {
        fullName: row.full_name,
        position: row.position,
        organization: row.organization
      }
    }));
  }
}

module.exports = CheckInRepository;