# GMS (Guest Management System) - Agent Guide

## Commands
- Development: `cd backend && npm run dev`
- Tests: `cd backend && npm test` (Jest)
- Test Watch: `cd backend && npm run test:watch`
- Migrations: `cd backend && npm run migrate`

## Code Style
- Node.js backend with Express.js framework
- Use `require()` for imports (CommonJS)
- Classes with PascalCase, methods with camelCase
- Arrow functions for class methods (`method = async (req, res) => {}`)
- Service layer pattern: Controllers → Services → Repositories
- Database: SQLite with custom repository pattern

## Error Handling
- Always return structured response: `{ success: boolean, data/error: object, message: string }`
- Use try-catch in all async methods
- Log errors with `console.error('MethodName error:', error)`
- HTTP status codes: 200 (success), 201 (created), 400 (validation), 404 (not found), 500 (server error)

## File Structure
- `/backend/src/controllers/` - HTTP request handlers
- `/backend/src/services/` - Business logic
- `/backend/src/repositories/` - Data access layer
- `/backend/src/models/` - Data models
- `/backend/src/routes/` - Route definitions
- `/backend/tests/` - Test files (empty directory)