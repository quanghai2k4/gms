const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username and password are required',
            details: [
              { field: 'username', message: 'Username is required' },
              { field: 'password', message: 'Password is required' }
            ]
          }
        });
      }

      const result = await this.authService.login(username, password);

      res.json({
        success: true,
        data: result,
        message: 'Login successful'
      });

    } catch (error) {
      console.error('Error in login:', error);

      if (error.message.includes('Invalid username or password')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid username or password'
          }
        });
      }

      if (error.message.includes('inactive')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Account is inactive'
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Login failed'
        }
      });
    }
  }

  async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Error in logout:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Logout failed'
        }
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_REQUIRED',
            message: 'Authorization token is required'
          }
        });
      }

      const result = await this.authService.verifyToken(token);

      res.json({
        success: true,
        data: {
          user: result.user
        },
        message: 'Token is valid'
      });

    } catch (error) {
      console.error('Error in verifyToken:', error);

      if (error.message.includes('Invalid token') || error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: error.message
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Token verification failed'
        }
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Old password and new password are required',
            details: [
              { field: 'oldPassword', message: 'Current password is required' },
              { field: 'newPassword', message: 'New password is required' }
            ]
          }
        });
      }

      const result = await this.authService.changePassword(userId, oldPassword, newPassword);

      res.json({
        success: true,
        data: result,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Error in changePassword:', error);

      if (error.message.includes('Current password is incorrect')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Current password is incorrect'
          }
        });
      }

      if (error.message.includes('at least 6 characters')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'New password must be at least 6 characters long'
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to change password'
        }
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_REQUIRED',
            message: 'Authorization token is required'
          }
        });
      }

      const result = await this.authService.refreshToken(token);

      res.json({
        success: true,
        data: result,
        message: 'Token refreshed successfully'
      });

    } catch (error) {
      console.error('Error in refreshToken:', error);

      if (error.message.includes('Invalid token') || error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: error.message
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Token refresh failed'
        }
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = req.user;

      res.json({
        success: true,
        data: {
          user: {
            id: user.userId,
            username: user.username,
            role: user.role
          }
        },
        message: 'Profile retrieved successfully'
      });

    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get profile'
        }
      });
    }
  }
}

module.exports = AuthController;