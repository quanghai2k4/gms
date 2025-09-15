const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/gms.db');
  }

  // Initialize database connection
  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database connection error:', err.message);
          reject(err);
          return;
        }
        // Enable foreign keys
        this.db.run('PRAGMA foreign_keys = ON');
        console.log('📁 Connected to SQLite database');
        resolve(this.db);
      });
    });
  }

  // Close database connection
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
            return;
          }
          console.log('📁 Database connection closed');
          this.db = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Execute a single query
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Database run error:', err.message);
          reject(err);
          return;
        }
        resolve({ 
          id: this.lastID, 
          changes: this.changes 
        });
      });
    });
  }

  // Get single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Database get error:', err.message);
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Get all rows
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Database all error:', err.message);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Get database instance
  getInstance() {
    return this.db;
  }

  // Transaction helper
  async transaction(callback) {
    try {
      await this.run('BEGIN TRANSACTION');
      const result = await callback(this);
      await this.run('COMMIT');
      return result;
    } catch (error) {
      await this.run('ROLLBACK');
      throw error;
    }
  }
}

// Singleton instance
let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
}

module.exports = {
  Database,
  getDatabase
};