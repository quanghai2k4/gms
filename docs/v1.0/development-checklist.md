# Development Checklist - Guest Management System

## Phần 3: Phát triển hệ thống

### 🎯 Overview
Xây dựng hệ thống theo thiết kế từ Phần 1 & 2 sử dụng:
- **Backend**: Node.js + Express + SQLite
- **Frontend**: React.js
- **Architecture**: REST API + SPA

---

## 📋 Development Phases

### Phase 1: Project Setup & Backend Core ⏳
- [ ] 1.1. Setup project structure (backend/frontend)
- [ ] 1.2. Initialize backend with Node.js/Express
- [ ] 1.3. Setup development environment (.env, scripts)
- [ ] 1.4. Configure SQLite database connection
- [ ] 1.5. Create database schema from ERD
- [ ] 1.6. Setup basic middleware (CORS, logging, error handling)

### Phase 2: Core APIs Development ⏳
- [ ] 2.1. Implement Authentication APIs (login/logout)
- [ ] 2.2. Implement Guest Management APIs (CRUD + CSV import)
- [ ] 2.3. Implement QR Code Management APIs (generation + validation)
- [ ] 2.4. Implement RSVP Management APIs (public access + admin stats)
- [ ] 2.5. Implement Check-in Management APIs (QR scanning + history)

### Phase 3: Frontend Development ⏳
- [ ] 3.1. Setup React.js project with routing
- [ ] 3.2. Create shared components (Header, Layout, Loading)
- [ ] 3.3. Implement Authentication pages (Login/Logout)
- [ ] 3.4. Implement Admin Dashboard (Statistics overview)
- [ ] 3.5. Implement Guest Management pages (List, Add, Edit, Import)
- [ ] 3.6. Implement RSVP Management pages (Responses, Stats)
- [ ] 3.7. Implement Check-in pages (Scanner, History)
- [ ] 3.8. Implement Public RSVP pages (Invitation, Response form)

### Phase 4: Integration & Testing ⏳
- [ ] 4.1. Backend API testing (Postman/curl)
- [ ] 4.2. Frontend component testing
- [ ] 4.3. End-to-end workflow testing
- [ ] 4.4. Error handling & validation testing
- [ ] 4.5. Performance testing
- [ ] 4.6. Security testing

---

## 🚀 Implementation Priority

### High Priority (MVP Features)
1. **Guest CRUD operations**
2. **QR code generation**
3. **Public RSVP form**
4. **Basic check-in functionality**
5. **Admin authentication**

### Medium Priority
1. **CSV import/export**
2. **Advanced statistics**
3. **Email notifications**
4. **Mobile-responsive design**

### Low Priority (Future Enhancements)
1. **SMS notifications**
2. **Advanced reporting**
3. **Multiple events support**
4. **User roles management**

---

## 📁 Project Structure

```
gms/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── controllers/        # API controllers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── middleware/        # Express middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utilities
│   │   └── app.js            # Express app setup
│   ├── database/
│   │   ├── migrations/       # Database migrations
│   │   └── gms.db           # SQLite database
│   ├── tests/               # Backend tests
│   ├── package.json
│   └── .env
├── frontend/               # React.js SPA
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   ├── utils/         # Utilities
│   │   ├── styles/        # CSS/Styling
│   │   └── App.js
│   ├── package.json
│   └── .env
├── docs/                  # Documentation (existing)
└── README.md             # Project README
```

---

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite3 + sqlite3 npm package
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: joi or express-validator
- **File Upload**: multer
- **QR Code**: qrcode npm package
- **Testing**: Jest + Supertest

### Frontend  
- **Framework**: React.js 18+
- **Routing**: React Router v6
- **State Management**: React Context + useState
- **HTTP Client**: Axios
- **UI Components**: Basic HTML/CSS + React components
- **QR Scanner**: react-qr-scanner
- **Testing**: React Testing Library + Jest

### Development Tools
- **API Testing**: Postman
- **Code Editor**: VS Code with extensions
- **Version Control**: Git
- **Package Manager**: npm

---

## 📝 Development Workflow

### Per Feature Development
1. **📋 Plan**: Review user story + acceptance criteria
2. **🏗️ Backend**: Implement API endpoint
3. **🧪 Test**: Test API with Postman/curl
4. **🎨 Frontend**: Implement UI component
5. **🔗 Integration**: Connect frontend to backend
6. **✅ Validate**: Test against acceptance criteria
7. **📝 Document**: Update documentation if needed

### Quality Gates
- ✅ **API Response Format**: Follow documented API specs
- ✅ **Error Handling**: Proper HTTP status codes + error messages
- ✅ **Validation**: Input validation on both frontend/backend
- ✅ **Security**: JWT authentication, SQL injection prevention
- ✅ **User Experience**: Responsive design, loading states, error states

---

## 🎯 Success Criteria

### Functional Requirements ✅
- [x] **Guest Management**: Add, edit, delete, import CSV
- [ ] **QR Generation**: Unique QR per guest with expiration
- [ ] **RSVP Process**: Public access, response submission
- [ ] **Check-in Process**: QR scanning, duplicate prevention
- [ ] **Admin Dashboard**: Statistics, guest management
- [ ] **Authentication**: Secure admin access

### Non-Functional Requirements
- [ ] **Performance**: API response < 500ms
- [ ] **Security**: Input validation, SQL injection protection
- [ ] **Usability**: Mobile-friendly interface
- [ ] **Reliability**: Error handling, graceful failures

### Acceptance Testing
- [ ] **User Story Validation**: Test each acceptance criteria
- [ ] **End-to-End Workflows**: Complete user journeys
- [ ] **Edge Cases**: Error scenarios, invalid inputs
- [ ] **Cross-browser Testing**: Chrome, Firefox, Safari, Mobile

---

## 📅 Development Timeline (Estimated)

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1 | 1 day | Project setup + Database |
| Phase 2 | 2 days | Backend APIs development |
| Phase 3 | 2 days | Frontend development |
| Phase 4 | 1 day | Testing + Integration |
| **Total** | **6 days** | **Full MVP** |

---

## 🚀 Getting Started

1. **Clone & Setup**
   ```bash
   cd /home/merrill/workspace/gms
   mkdir -p backend frontend
   ```

2. **Backend First**
   ```bash
   cd backend
   npm init -y
   npm install express sqlite3 cors dotenv jsonwebtoken bcryptjs multer qrcode joi
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend  
   npx create-react-app .
   npm install axios react-router-dom
   ```

4. **Start Development** 🎯
   - Begin with Phase 1: Project Setup
   - Follow checklist item by item
   - Test each component before moving to next

---

**Next Step**: Begin Phase 1 - Project Setup & Backend Core