const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  async login(username, password) {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      let user = await this.userRepository.findByUsername(username);
      
      if (!user) {
        user = await this.userRepository.findByEmail(username);
      }

      if (!user) {
        throw new Error('Invalid username or password');
      }

      if (!user.isActive) {
        throw new Error('Account is inactive');
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValidPassword) {
        throw new Error('Invalid username or password');
      }

      const token = jwt.sign(
        { 
          userId: user.id,
          username: user.username,
          role: user.role
        },
        this.jwtSecret,
        { expiresIn: this.jwtExpiresIn }
      );

      return {
        token,
        user: user.toPublicJSON(),
        expiresIn: this.jwtExpiresIn
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('Token is required');
      }

      const decoded = jwt.verify(token, this.jwtSecret);
      
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid token or user not found');
      }

      return {
        user: user.toPublicJSON(),
        decoded
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      if (!oldPassword || !newPassword) {
        throw new Error('Old password and new password are required');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const isValidOldPassword = await bcrypt.compare(oldPassword, user.passwordHash);
      
      if (!isValidOldPassword) {
        throw new Error('Current password is incorrect');
      }

      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      await this.userRepository.update(userId, {
        passwordHash: newPasswordHash
      });

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const { username, email, password, role = 'admin' } = userData;

      if (!username || !email || !password) {
        throw new Error('Username, email, and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const existingEmail = await this.userRepository.findByEmail(email);
      if (existingEmail) {
        throw new Error('Email already exists');
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await this.userRepository.create({
        username,
        email,
        passwordHash,
        role
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  async refreshToken(token) {
    try {
      const { user, decoded } = await this.verifyToken(token);
      
      const newToken = jwt.sign(
        { 
          userId: user.id,
          username: user.username,
          role: user.role
        },
        this.jwtSecret,
        { expiresIn: this.jwtExpiresIn }
      );

      return {
        token: newToken,
        user,
        expiresIn: this.jwtExpiresIn
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;