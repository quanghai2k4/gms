# REST API Specifications

## Hệ thống Quản lý Khách mời - API Design

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Admin endpoints**: Require authentication
- **Public endpoints**: No authentication required (QR access, RSVP)

---

## 1. Guest Management APIs

### 1.1. GET /guests
**Mô tả**: Lấy danh sách tất cả khách mời
**Method**: GET
**Authentication**: Required (Admin)

**Query Parameters**:
```json
{
  "page": "number (optional, default: 1)",
  "limit": "number (optional, default: 20)",
  "search": "string (optional, search by name/phone)",
  "status": "string (optional: pending|accepted|declined)"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "guests": [
      {
        "id": 1,
        "fullName": "Nguyễn Văn A",
        "position": "Giám đốc",
        "organization": "Công ty ABC",
        "phoneNumber": "0123456789",
        "email": "nguyenvana@example.com",
        "qrCode": {
          "token": "abc123xyz",
          "url": "http://localhost:3000/invitation/abc123xyz",
          "isActive": true
        },
        "rsvpStatus": "pending",
        "checkInStatus": false,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    },
    "statistics": {
      "total": 100,
      "pending": 60,
      "accepted": 30,
      "declined": 10,
      "checkedIn": 0
    }
  },
  "message": "Guests retrieved successfully"
}
```

### 1.2. GET /guests/:id
**Mô tả**: Lấy thông tin chi tiết một khách mời
**Method**: GET
**Authentication**: Required (Admin)

**URL Parameters**:
- `id`: number (Guest ID)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "guest": {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "position": "Giám đốc", 
      "organization": "Công ty ABC",
      "phoneNumber": "0123456789",
      "email": "nguyenvana@example.com",
      "qrCode": {
        "token": "abc123xyz",
        "url": "http://localhost:3000/invitation/abc123xyz",
        "isActive": true,
        "expiresAt": "2024-12-31T23:59:59Z"
      },
      "rsvp": {
        "status": "accepted",
        "notes": "Tôi sẽ tham dự đúng giờ",
        "responseDate": "2024-01-16T14:30:00Z"
      },
      "checkIn": null,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-16T14:30:00Z"
    }
  },
  "message": "Guest details retrieved successfully"
}
```

### 1.3. POST /guests
**Mô tả**: Thêm khách mời mới
**Method**: POST
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "fullName": "Trần Thị B",
  "position": "Phó Giám đốc",
  "organization": "Công ty DEF", 
  "phoneNumber": "0987654321",
  "email": "tranthib@example.com"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "data": {
    "guest": {
      "id": 2,
      "fullName": "Trần Thị B",
      "position": "Phó Giám đốc",
      "organization": "Công ty DEF",
      "phoneNumber": "0987654321", 
      "email": "tranthib@example.com",
      "qrCode": {
        "token": "def456uvw",
        "url": "http://localhost:3000/invitation/def456uvw",
        "isActive": true
      },
      "createdAt": "2024-01-17T09:15:00Z"
    }
  },
  "message": "Guest created successfully"
}
```

### 1.4. PUT /guests/:id
**Mô tả**: Cập nhật thông tin khách mời
**Method**: PUT
**Authentication**: Required (Admin)

**Request Body**: (Same as POST)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "guest": {
      "id": 2,
      "fullName": "Trần Thị B Updated",
      "position": "Giám đốc",
      "organization": "Công ty DEF",
      "phoneNumber": "0987654321",
      "email": "tranthib.new@example.com", 
      "updatedAt": "2024-01-17T10:30:00Z"
    }
  },
  "message": "Guest updated successfully"
}
```

### 1.5. DELETE /guests/:id
**Mô tả**: Xóa khách mời
**Method**: DELETE  
**Authentication**: Required (Admin)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Guest deleted successfully"
}
```

### 1.6. POST /guests/import-csv
**Mô tả**: Import khách mời từ file CSV
**Method**: POST
**Authentication**: Required (Admin)
**Content-Type**: multipart/form-data

**Request Body**:
```
Form Data:
- csvFile: File (CSV file)
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "importResult": {
      "totalRows": 50,
      "successfulImports": 45,
      "failedImports": 5,
      "errors": [
        {
          "row": 3,
          "error": "Invalid phone number format",
          "data": {"fullName": "Invalid Guest", "phoneNumber": "invalid"}
        }
      ],
      "importedGuests": [
        {
          "id": 101,
          "fullName": "Imported Guest 1",
          "organization": "Company X"
        }
      ]
    }
  },
  "message": "CSV import completed"
}
```

---

## 2. RSVP Management APIs

### 2.1. GET /rsvp/:qrToken
**Mô tả**: Lấy thông tin thiệp mời qua QR token (Public)
**Method**: GET
**Authentication**: Not required

**URL Parameters**:
- `qrToken`: string (QR Code token)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "invitation": {
      "guest": {
        "fullName": "Nguyễn Văn A",
        "position": "Giám đốc",
        "organization": "Công ty ABC"
      },
      "event": {
        "name": "Lễ kỷ niệm 15 năm thành lập",
        "date": "2024-03-15T18:00:00Z",
        "venue": "Khách sạn Grand Plaza",
        "program": "18:00 - Đón khách\n18:30 - Khai mạc\n19:00 - Tiệc tối"
      },
      "rsvp": {
        "status": "pending",
        "canChange": true,
        "deadline": "2024-03-10T23:59:59Z"
      }
    }
  },
  "message": "Invitation details retrieved successfully"
}
```

### 2.2. POST /rsvp/:qrToken
**Mô tả**: Gửi phản hồi RSVP (Public)
**Method**: POST
**Authentication**: Not required

**Request Body**:
```json
{
  "response": "accepted", // "accepted" | "declined"
  "notes": "Tôi sẽ tham dự đúng giờ. Cảm ơn ban tổ chức!"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "rsvp": {
      "guestId": 1,
      "response": "accepted",
      "notes": "Tôi sẽ tham dự đúng giờ. Cảm ơn ban tổ chức!",
      "responseDate": "2024-01-18T15:45:00Z"
    }
  },
  "message": "RSVP response submitted successfully"
}
```

### 2.3. GET /rsvp/statistics
**Mô tả**: Thống kê phản hồi RSVP
**Method**: GET
**Authentication**: Required (Admin)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total": 100,
      "responses": {
        "pending": 20,
        "accepted": 65,
        "declined": 15
      },
      "responseRate": "80%",
      "timeline": [
        {
          "date": "2024-01-15",
          "accepted": 10,
          "declined": 2
        },
        {
          "date": "2024-01-16", 
          "accepted": 15,
          "declined": 3
        }
      ]
    }
  },
  "message": "RSVP statistics retrieved successfully"
}
```

---

## 3. Check-in Management APIs

### 3.1. POST /checkin/:qrToken
**Mô tả**: Check-in khách mời bằng QR code
**Method**: POST
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "checkInBy": "Staff001",
  "notes": "Check-in at main entrance"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "checkIn": {
      "id": 1,
      "guest": {
        "fullName": "Nguyễn Văn A",
        "position": "Giám đốc",
        "organization": "Công ty ABC"
      },
      "checkInTime": "2024-03-15T18:15:00Z",
      "checkInBy": "Staff001",
      "notes": "Check-in at main entrance"
    }
  },
  "message": "Guest checked in successfully"
}
```

### 3.2. GET /checkin/history
**Mô tả**: Lấy lịch sử check-in
**Method**: GET
**Authentication**: Required (Admin)

**Query Parameters**:
```json
{
  "date": "string (optional, YYYY-MM-DD)",
  "limit": "number (optional, default: 50)"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "checkIns": [
      {
        "id": 1,
        "guest": {
          "fullName": "Nguyễn Văn A",
          "organization": "Công ty ABC"
        },
        "checkInTime": "2024-03-15T18:15:00Z",
        "checkInBy": "Staff001"
      }
    ],
    "statistics": {
      "totalCheckedIn": 45,
      "expectedGuests": 65,
      "checkInRate": "69.2%"
    }
  },
  "message": "Check-in history retrieved successfully"
}
```

### 3.3. GET /checkin/statistics
**Mô tả**: Thống kê check-in
**Method**: GET
**Authentication**: Required (Admin)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalGuests": 100,
      "acceptedGuests": 65,
      "checkedInGuests": 45,
      "checkInRate": "69.2%",
      "hourlyStats": [
        {
          "hour": "18:00",
          "checkIns": 15
        },
        {
          "hour": "18:30", 
          "checkIns": 20
        }
      ]
    }
  },
  "message": "Check-in statistics retrieved successfully"
}
```

---

## 4. QR Code Management APIs

### 4.1. GET /qr/:guestId
**Mô tả**: Lấy QR code của khách mời
**Method**: GET
**Authentication**: Required (Admin)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "token": "abc123xyz",
      "url": "http://localhost:3000/invitation/abc123xyz", 
      "qrImageUrl": "http://localhost:8000/api/v1/qr/image/abc123xyz",
      "isActive": true,
      "expiresAt": "2024-12-31T23:59:59Z"
    }
  },
  "message": "QR code retrieved successfully"
}
```

### 4.2. GET /qr/image/:token
**Mô tả**: Lấy hình ảnh QR code
**Method**: GET
**Authentication**: Not required

**Response Success (200)**:
```
Content-Type: image/png
Binary data of QR code image
```

### 4.3. POST /qr/:guestId/regenerate
**Mô tả**: Tạo lại QR code cho khách mời
**Method**: POST
**Authentication**: Required (Admin)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "token": "new123token",
      "url": "http://localhost:3000/invitation/new123token",
      "qrImageUrl": "http://localhost:8000/api/v1/qr/image/new123token",
      "isActive": true
    }
  },
  "message": "QR code regenerated successfully"
}
```

---

## 5. Authentication APIs

### 5.1. POST /auth/login
**Mô tả**: Đăng nhập admin
**Method**: POST
**Authentication**: Not required

**Request Body**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "expiresIn": "24h"
  },
  "message": "Login successful"
}
```

### 5.2. POST /auth/logout
**Mô tả**: Đăng xuất
**Method**: POST
**Authentication**: Required

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "phoneNumber",
        "message": "Phone number format is invalid"
      }
    ]
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED", 
    "message": "Authentication required"
  }
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Guest not found"
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## API Testing với Postman Collection

### Environment Variables
```json
{
  "baseUrl": "http://localhost:8000/api/v1",
  "adminToken": "{{token}}",
  "sampleQRToken": "abc123xyz"
}
```

### Sample Test Cases
1. **Authentication Flow**: Login → Get Token → Use Token for protected APIs
2. **Guest Management**: Create → Read → Update → Delete
3. **CSV Import**: Upload CSV file → Validate response
4. **RSVP Flow**: Get invitation by QR → Submit RSVP → Check statistics  
5. **Check-in Flow**: Scan QR → Check-in guest → View history