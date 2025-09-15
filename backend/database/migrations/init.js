const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../database/gms.db');

// Create database and tables
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error creating database:', err.message);
        reject(err);
        return;
      }
      console.log('📁 Connected to SQLite database at:', DB_PATH);
    });

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create tables based on ERD
    const createTables = [
      // Events table
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT NOT NULL,
        description TEXT,
        event_date DATETIME,
        venue TEXT,
        program_details TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Guests table
      `CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        position TEXT,
        organization TEXT,
        phone_number TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // QR Codes table
      `CREATE TABLE IF NOT EXISTS qr_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        qr_image_path TEXT,
        is_active BOOLEAN DEFAULT 1,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE CASCADE
      )`,

      // RSVP Responses table
      `CREATE TABLE IF NOT EXISTS rsvp_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_id INTEGER NOT NULL,
        response_status TEXT CHECK(response_status IN ('PENDING', 'ACCEPTED', 'DECLINED')) DEFAULT 'PENDING',
        notes TEXT,
        response_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE CASCADE
      )`,

      // Check-ins table
      `CREATE TABLE IF NOT EXISTS check_ins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_id INTEGER NOT NULL,
        check_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        check_in_by TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE CASCADE
      )`,

      // Invitations table
      `CREATE TABLE IF NOT EXISTS invitations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_id INTEGER NOT NULL,
        event_id INTEGER NOT NULL,
        invitation_status TEXT CHECK(invitation_status IN ('DRAFT', 'SENT', 'DELIVERED', 'FAILED')) DEFAULT 'DRAFT',
        sent_at DATETIME,
        sent_method TEXT CHECK(sent_method IN ('EMAIL', 'SMS', 'PRINT')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
      )`,

      // System configs table
      `CREATE TABLE IF NOT EXISTS system_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        config_key TEXT UNIQUE NOT NULL,
        config_value TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Users table (for authentication)
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    // Create indexes
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone_number)',
      'CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email)',
      'CREATE INDEX IF NOT EXISTS idx_qr_token ON qr_codes(token)',
      'CREATE INDEX IF NOT EXISTS idx_qr_guest_id ON qr_codes(guest_id)',
      'CREATE INDEX IF NOT EXISTS idx_rsvp_guest_id ON rsvp_responses(guest_id)',
      'CREATE INDEX IF NOT EXISTS idx_rsvp_status ON rsvp_responses(response_status)',
      'CREATE INDEX IF NOT EXISTS idx_checkin_guest_id ON check_ins(guest_id)',
      'CREATE INDEX IF NOT EXISTS idx_checkin_time ON check_ins(check_in_time)',
      'CREATE INDEX IF NOT EXISTS idx_invitation_guest_id ON invitations(guest_id)',
      'CREATE INDEX IF NOT EXISTS idx_invitation_event_id ON invitations(event_id)',
      'CREATE INDEX IF NOT EXISTS idx_invitation_status ON invitations(invitation_status)'
    ];

    // Execute table creation
    let completed = 0;
    const totalOperations = createTables.length + createIndexes.length;

    function executeNext() {
      if (completed >= createTables.length + createIndexes.length) {
        // Insert initial data
        insertInitialData(db, resolve, reject);
        return;
      }

      let sql;
      if (completed < createTables.length) {
        sql = createTables[completed];
        console.log(`📊 Creating table ${completed + 1}/${createTables.length}`);
      } else {
        sql = createIndexes[completed - createTables.length];
        console.log(`🔍 Creating index ${completed - createTables.length + 1}/${createIndexes.length}`);
      }

      db.run(sql, (err) => {
        if (err) {
          console.error('Error executing SQL:', err.message);
          reject(err);
          return;
        }
        completed++;
        executeNext();
      });
    }

    executeNext();
  });
}

// Insert initial data
function insertInitialData(db, resolve, reject) {
  console.log('📝 Inserting initial data...');

  // Create default admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = bcrypt.hashSync(adminPassword, 12);

  // Insert default event
  db.run(`INSERT OR IGNORE INTO events (
    id, event_name, description, event_date, venue, program_details
  ) VALUES (
    1, 
    'Lễ kỷ niệm 15 năm thành lập',
    'Lễ kỷ niệm 15 năm thành lập công ty với sự tham gia của toàn thể CBNV và đối tác',
    '2024-03-15 18:00:00',
    'Khách sạn Grand Plaza, TP.HCM',
    '18:00 - Đón khách và check-in\\n18:30 - Khai mạc và phát biểu\\n19:00 - Tiệc tối và giao lưu\\n21:00 - Chương trình văn nghệ\\n22:00 - Kết thúc'
  )`, (err) => {
    if (err) {
      console.error('Error inserting default event:', err.message);
      reject(err);
      return;
    }
  });

  // Insert default admin user
  db.run(`INSERT OR IGNORE INTO users (
    username, email, password_hash, role
  ) VALUES (?, ?, ?, ?)`, 
  [process.env.ADMIN_USERNAME || 'admin', process.env.ADMIN_EMAIL || 'admin@gms.local', hashedPassword, 'admin'], 
  (err) => {
    if (err) {
      console.error('Error inserting admin user:', err.message);
      reject(err);
      return;
    }
  });

  // Insert system configs
  const configs = [
    ['event_id', '1', 'Current active event ID'],
    ['qr_expires_days', '365', 'QR code expiration in days'],
    ['rsvp_deadline', '2024-03-10 23:59:59', 'RSVP response deadline'],
    ['check_in_enabled', 'true', 'Enable check-in functionality']
  ];

  let configsCompleted = 0;
  configs.forEach(([key, value, description]) => {
    db.run(`INSERT OR IGNORE INTO system_configs (
      config_key, config_value, description
    ) VALUES (?, ?, ?)`, [key, value, description], (err) => {
      if (err) {
        console.error(`Error inserting config ${key}:`, err.message);
      }
      configsCompleted++;
      
      if (configsCompleted === configs.length) {
        console.log('✅ Database initialization completed successfully!');
        console.log(`👤 Default admin user: ${process.env.ADMIN_USERNAME || 'admin'}`);
        console.log(`🔑 Default admin password: ${adminPassword}`);
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
            return;
          }
          console.log('📁 Database connection closed.');
          resolve();
        });
      }
    });
  });
}

// Run if called directly
if (require.main === module) {
  console.log('🚀 Initializing Guest Management System Database...');
  initializeDatabase()
    .then(() => {
      console.log('✅ Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };