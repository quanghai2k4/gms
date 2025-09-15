# Guest Management System (GMS)

A comprehensive guest management system for the 15th Anniversary Celebration event.

## Overview

The Guest Management System (GMS) is a full-stack web application designed to streamline guest management for events. It provides complete functionality for managing guest lists, sending digital invitations, tracking RSVP responses, and handling event check-ins through QR code technology.

## Key Features

### 🎯 Guest Management
- Create and edit guests manually
- Import guest lists from CSV files
- Export guest data with status information
- Real-time guest statistics and filtering

### 🎫 QR Code & Invitations
- Generate unique QR codes for each guest
- Personalized invitation links
- Digital invitation delivery
- Event program information management

### 📊 RSVP Tracking
- Real-time RSVP dashboard
- Manual and automatic RSVP updates
- Detailed reporting and analytics
- Response deadline management

### ✅ Event Check-in
- QR code scanning for check-in
- Real-time check-in monitoring
- Exception handling for check-in issues
- Live event monitoring

### 👥 Guest Experience
- View personalized invitations
- Submit attendance responses
- Update decisions before deadline
- Quick check-in at event entrance

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT with bcrypt
- **File Uploads**: Multer
- **QR Generation**: qrcode library
- **CSV Processing**: csv-parse
- **Testing**: Jest + Supertest

### Architecture
- **Pattern**: Service Layer Architecture (Controllers → Services → Repositories)
- **Module System**: CommonJS
- **Database**: Custom repository pattern with SQLite

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd gms

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run migrate

# Start development server
npm run dev
```

### Available Commands
```bash
# Development
npm run dev          # Start with nodemon
npm start           # Production start

# Testing
npm test            # Run all tests
npm run test:watch  # Watch mode

# Database
npm run migrate     # Initialize/migrate database
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── models/          # Data models
│   ├── routes/          # Route definitions
│   ├── middlewares/     # Custom middleware
│   └── utils/           # Utility functions
├── database/
│   └── migrations/      # Database migrations
├── uploads/             # File uploads
└── tests/              # Test files
docs/                   # Project documentation
```

## API Endpoints

### Guest Management
- `GET /api/v1/guests` - List guests with pagination/filtering
- `POST /api/v1/guests` - Create new guest
- `GET /api/v1/guests/:id` - Get guest details
- `PUT /api/v1/guests/:id` - Update guest
- `DELETE /api/v1/guests/:id` - Delete guest
- `POST /api/v1/guests/import-csv` - Import from CSV
- `GET /api/v1/guests/export-csv` - Export to CSV

### RSVP Management
- `GET /api/v1/rsvp/:guestId` - Get RSVP status
- `POST /api/v1/rsvp/:guestId` - Submit RSVP response

### Check-in Management
- `POST /api/v1/checkin/:guestId` - Check-in guest
- `GET /api/v1/checkin/stats` - Check-in statistics

### QR Code Management
- `GET /api/v1/qr/:guestId` - Get QR code
- `POST /api/v1/qr/generate` - Generate QR codes

## User Roles

### Event Organizers (ORG)
- Manage guest lists
- Create and send invitations
- Track RSVP responses
- Monitor event check-ins
- View reports and analytics

### Guests (GUEST)
- View personalized invitations
- Submit attendance responses
- Update responses before deadline
- Check-in at event venue

## Documentation

- [📋 Requirements](docs/requirements.md) - Business requirements
- [🏗️ Architecture](docs/v1.0/4c-model/) - System architecture
- [🔧 API Documentation](docs/v1.0/api/) - API reference
- [📊 Database Schema](docs/v1.0/erd/) - ERD and database design
- [✅ Development Checklist](docs/v1.0/development-checklist.md) - Development progress

## Development

### Code Style
- Use CommonJS (`require()`) for imports
- Classes with PascalCase, methods with camelCase
- Arrow functions for class methods
- Structured error responses: `{ success: boolean, data/error: object, message: string }`

### Error Handling
- Always use try-catch in async methods
- Log errors with `console.error('MethodName error:', error)`
- Return consistent HTTP status codes (200, 201, 400, 404, 500)

## Contributing

1. Follow the existing code style and architecture patterns
2. Write tests for new features
3. Update documentation for API changes
4. Use structured commit messages

## License

MIT License - see LICENSE file for details