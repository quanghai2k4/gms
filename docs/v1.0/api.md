# API Documentation

## REST API Endpoints

### Guest Management

#### 1. Get All Guests
- **Endpoint**: `GET /api/guests`
- **Description**: Lấy danh sách tất cả khách mời
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Văn A",
      "position": "Giám đốc",
      "organization": "Công ty ABC",
      "phone": "0123456789",
      "qr_code": "QR001",
      "status": "PENDING",
      "checked_in": false
    }
  ]
}
```

#### 2. Create Guest
- **Endpoint**: `POST /api/guests`
- **Description**: Thêm khách mời mới
- **Input**:
```json
{
  "name": "Nguyễn Văn A",
  "position": "Giám đốc", 
  "organization": "Công ty ABC",
  "phone": "0123456789"
}
```

#### 3. Import Guests from CSV
- **Endpoint**: `POST /api/guests/import`
- **Description**: Import khách mời từ file CSV
- **Input**: Form-data with CSV file

#### 4. Get Guest by QR Code
- **Endpoint**: `GET /api/guests/qr/:qrCode`
- **Description**: Lấy thông tin khách mời qua QR code

### RSVP Management

#### 5. Submit RSVP
- **Endpoint**: `POST /api/rsvp`
- **Description**: Khách mời phản hồi tham gia/từ chối
- **Input**:
```json
{
  "qr_code": "QR001",
  "response": "ACCEPTED"
}
```

### Check-in Management

#### 6. Check-in Guest
- **Endpoint**: `POST /api/checkin`
- **Description**: Check-in khách mời tại sự kiện
- **Input**:
```json
{
  "qr_code": "QR001",
  "checkin_by": "Admin"
}
```

#### 7. Get Check-in Stats
- **Endpoint**: `GET /api/stats`
- **Description**: Thống kê tổng quan
- **Response**:
```json
{
  "total_guests": 100,
  "accepted": 80,
  "declined": 15,
  "pending": 5,
  "checked_in": 75
}
```