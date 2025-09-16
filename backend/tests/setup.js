const { getDatabase } = require('../src/utils/database');

// Test database setup
beforeAll(async () => {
  // Use test database
  process.env.DB_PATH = ':memory:';
  process.env.NODE_ENV = 'test';
  
  const db = getDatabase();
  await db.connect();
});

afterAll(async () => {
  const db = getDatabase();
  if (db.close) {
    await db.close();
  }
});