const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDatabase } = require('./utils/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Guest Management System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
const guestRoutes = require('./routes/guestRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const qrRoutes = require('./routes/qrRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/v1/guests', guestRoutes);
app.use('/api/v1/rsvp', rsvpRoutes);
app.use('/api/v1/checkin', checkinRoutes);
app.use('/api/v1/qr', qrRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Start server
if (require.main === module) {
  // Initialize database connection
  const db = getDatabase();
  
  db.connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Guest Management System API`);
        console.log(`📡 Server running on http://localhost:${PORT}`);
        console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📂 Database: ${process.env.DB_PATH || './database/gms.db'}`);
        console.log(`🌐 CORS Origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        console.log(`⏰ Started at: ${new Date().toISOString()}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to database:', error);
      process.exit(1);
    });
}

module.exports = app;