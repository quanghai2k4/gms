const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  test('GET /health should return success', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Guest Management System API is running',
      version: '1.0.0'
    });
    expect(response.body.timestamp).toBeDefined();
  });
});