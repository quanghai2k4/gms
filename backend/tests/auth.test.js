const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  describe('POST /api/v1/auth/login', () => {
    test('should login with valid credentials', async () => {
      const loginData = {
        username: 'admin',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.username).toBe('admin');
    });

    test('should fail with invalid credentials', async () => {
      const loginData = {
        username: 'admin',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});