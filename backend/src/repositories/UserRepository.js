const { getDatabase } = require('../utils/database');
const User = require('../models/User');

class UserRepository {
  constructor() {
    this.db = getDatabase();
  }

  async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = ? AND is_active = 1';
      const row = await this.db.get(query, [username]);
      return row ? User.fromDatabase(row) : null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
      const row = await this.db.get(query, [email]);
      return row ? User.fromDatabase(row) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ? AND is_active = 1';
      const row = await this.db.get(query, [id]);
      return row ? User.fromDatabase(row) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async create(userData) {
    try {
      const { username, email, passwordHash, role = 'admin' } = userData;
      
      const query = `
        INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
      `;
      
      const result = await this.db.run(query, [username, email, passwordHash, role]);
      
      if (result.lastID) {
        return await this.findById(result.lastID);
      }
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updates).forEach(key => {
        if (key === 'passwordHash') {
          fields.push('password_hash = ?');
          values.push(updates[key]);
        } else if (key === 'isActive') {
          fields.push('is_active = ?');
          values.push(updates[key] ? 1 : 0);
        } else if (['username', 'email', 'role'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }

      fields.push('updated_at = datetime(\'now\')');
      values.push(id);

      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      
      await this.db.run(query, values);
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      await this.db.run(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const query = 'SELECT * FROM users WHERE is_active = 1 ORDER BY created_at DESC';
      const rows = await this.db.all(query);
      return rows.map(row => User.fromDatabase(row));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }
}

module.exports = UserRepository;