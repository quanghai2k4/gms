const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'gms.db'));
    this.init();
  }

  init() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS guests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          position TEXT,
          organization TEXT,
          phone TEXT,
          qr_code TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'PENDING',
          checked_in INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS rsvp_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guest_id INTEGER,
          response TEXT NOT NULL,
          response_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          ip_address TEXT,
          FOREIGN KEY (guest_id) REFERENCES guests (id)
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS checkin_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guest_id INTEGER,
          checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          checkin_by TEXT,
          FOREIGN KEY (guest_id) REFERENCES guests (id)
        )
      `);
    });
  }

  getAllGuests() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM guests ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getGuestByQR(qrCode) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM guests WHERE qr_code = ?", [qrCode], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  createGuest(guest) {
    return new Promise((resolve, reject) => {
      const { name, position, organization, phone, qr_code } = guest;
      this.db.run(
        "INSERT INTO guests (name, position, organization, phone, qr_code) VALUES (?, ?, ?, ?, ?)",
        [name, position, organization, phone, qr_code],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...guest });
        }
      );
    });
  }

  updateGuestStatus(qrCode, status) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE guests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE qr_code = ?",
        [status, qrCode],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  checkinGuest(qrCode) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE guests SET checked_in = 1, updated_at = CURRENT_TIMESTAMP WHERE qr_code = ?",
        [qrCode],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  logRSVP(guestId, response, ipAddress) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO rsvp_log (guest_id, response, ip_address) VALUES (?, ?, ?)",
        [guestId, response, ipAddress],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  logCheckin(guestId, checkinBy) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO checkin_log (guest_id, checkin_by) VALUES (?, ?)",
        [guestId, checkinBy],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  getStats() {
    return new Promise((resolve, reject) => {
      const stats = {};
      
      this.db.get("SELECT COUNT(*) as total FROM guests", (err, row) => {
        if (err) return reject(err);
        stats.total_guests = row.total;
        
        this.db.get("SELECT COUNT(*) as accepted FROM guests WHERE status = 'ACCEPTED'", (err, row) => {
          if (err) return reject(err);
          stats.accepted = row.accepted;
          
          this.db.get("SELECT COUNT(*) as declined FROM guests WHERE status = 'DECLINED'", (err, row) => {
            if (err) return reject(err);
            stats.declined = row.declined;
            
            this.db.get("SELECT COUNT(*) as pending FROM guests WHERE status = 'PENDING'", (err, row) => {
              if (err) return reject(err);
              stats.pending = row.pending;
              
              this.db.get("SELECT COUNT(*) as checked_in FROM guests WHERE checked_in = 1", (err, row) => {
                if (err) return reject(err);
                stats.checked_in = row.checked_in;
                resolve(stats);
              });
            });
          });
        });
      });
    });
  }
}

module.exports = Database;