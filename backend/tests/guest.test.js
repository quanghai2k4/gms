const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

describe('Guest API', () => {
  let authToken;

  beforeAll(() => {
    // Create a test JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    authToken = jwt.sign(
      { userId: 1, username: 'testuser' },
      jwtSecret,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/v1/guests', () => {
    test('should create a new guest with auth', async () => {
      const guestData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '0912345678', // Vietnamese phone format
        position: 'Developer',
        organization: 'Test Company'
      };

      const response = await request(app)
        .post('/api/v1/guests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(guestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.guest).toMatchObject({
        fullName: guestData.fullName,
        email: guestData.email,
        phoneNumber: guestData.phoneNumber
      });
      expect(response.body.data.guest.id).toBeDefined();
    });

    test('should fail without authorization', async () => {
      const guestData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '0912345678'
      };

      const response = await request(app)
        .post('/api/v1/guests')
        .send(guestData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    test('should fail with missing fullName', async () => {
      const guestData = {
        email: 'john@example.com',
        phoneNumber: '0912345678'
      };

      const response = await request(app)
        .post('/api/v1/guests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(guestData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Full name is required');
    });

    test('should fail with invalid phone number', async () => {
      const guestData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123' // Invalid format
      };

      const response = await request(app)
        .post('/api/v1/guests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(guestData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid phone number format');
    });
  });

  describe('GET /api/v1/guests', () => {
    test('should return list of guests with auth', async () => {
      const response = await request(app)
        .get('/api/v1/guests')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.guests).toBeDefined();
      expect(Array.isArray(response.body.data.guests)).toBe(true);
    });

    test('should fail without authorization', async () => {
      const response = await request(app)
        .get('/api/v1/guests')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});