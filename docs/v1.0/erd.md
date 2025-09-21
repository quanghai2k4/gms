# Database Schema (ERD)

## Entity Relationship Diagram

```mermaid
erDiagram
    GUESTS {
        int id PK "Primary key"
        string name "Họ tên"
        string position "Chức vụ"
        string organization "Tổ chức/công ty"
        string phone "Số điện thoại"
        string qr_code UK "Mã QR duy nhất"
        string status "PENDING|ACCEPTED|DECLINED"
        boolean checked_in "Đã check-in hay chưa"
        datetime created_at "Thời gian tạo"
        datetime updated_at "Thời gian cập nhật"
    }
    
    RSVP_LOG {
        int id PK "Primary key"
        int guest_id FK "Foreign key to GUESTS"
        string response "ACCEPTED|DECLINED"
        datetime response_time "Thời gian phản hồi"
        string ip_address "IP address phản hồi"
    }
    
    CHECKIN_LOG {
        int id PK "Primary key"
        int guest_id FK "Foreign key to GUESTS"
        datetime checkin_time "Thời gian check-in"
        string checkin_by "Người thực hiện check-in"
    }
    
    GUESTS ||--o{ RSVP_LOG : "has responses"
    GUESTS ||--o{ CHECKIN_LOG : "has checkins"
```

## Tables Description

### GUESTS
Bảng chính chứa thông tin khách mời:
- `id`: Khóa chính
- `name`: Họ tên khách mời
- `position`: Chức vụ
- `organization`: Tổ chức/công ty
- `phone`: Số điện thoại
- `qr_code`: Mã QR duy nhất cho mỗi khách mời
- `status`: Trạng thái phản hồi (PENDING/ACCEPTED/DECLINED)
- `checked_in`: Boolean xác định đã check-in chưa
- `created_at`, `updated_at`: Timestamps

### RSVP_LOG
Log phản hồi của khách mời:
- Ghi lại lịch sử phản hồi
- Có thể theo dõi thời gian và IP phản hồi

### CHECKIN_LOG
Log check-in tại sự kiện:
- Ghi lại thời gian check-in
- Người thực hiện check-in