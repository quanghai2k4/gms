# Entity Relationship Diagram (ERD)

## Hệ thống Quản lý Khách mời

### Database Schema (SQLite)

```mermaid
erDiagram
    GUESTS {
        integer id PK
        text full_name NOT_NULL
        text position
        text organization
        text phone_number
        text email
        text qr_code UNIQUE
        datetime created_at
        datetime updated_at
    }
    
    RSVP_RESPONSES {
        integer id PK
        integer guest_id FK
        text response_status "PENDING, ACCEPTED, DECLINED"
        text notes
        datetime response_date
        datetime created_at
        datetime updated_at
    }
    
    CHECK_INS {
        integer id PK
        integer guest_id FK
        datetime check_in_time
        text check_in_by
        text notes
        datetime created_at
    }
    
    EVENTS {
        integer id PK
        text event_name
        text description
        datetime event_date
        text venue
        text program_details
        boolean is_active
        datetime created_at
        datetime updated_at
    }
    
    QR_CODES {
        integer id PK
        integer guest_id FK
        text qr_token UNIQUE
        text qr_url
        boolean is_active
        datetime expires_at
        datetime created_at
        datetime updated_at
    }
    
    INVITATIONS {
        integer id PK
        integer guest_id FK
        integer event_id FK
        text invitation_status "DRAFT, SENT, DELIVERED, FAILED"
        datetime sent_at
        text sent_method "EMAIL, SMS, PRINT"
        datetime created_at
        datetime updated_at
    }
    
    SYSTEM_CONFIGS {
        integer id PK
        text config_key
        text config_value
        text description
        datetime created_at
        datetime updated_at
    }

    %% Relationships
    GUESTS ||--o{ RSVP_RESPONSES : "has"
    GUESTS ||--o{ CHECK_INS : "has"
    GUESTS ||--|| QR_CODES : "has"
    GUESTS ||--o{ INVITATIONS : "receives"
    EVENTS ||--o{ INVITATIONS : "for"
    
    %% Indexes and Constraints
    GUESTS {
        index idx_guests_qr_code "qr_code"
        index idx_guests_phone "phone_number"
        index idx_guests_email "email"
    }
    
    RSVP_RESPONSES {
        index idx_rsvp_guest_id "guest_id"
        index idx_rsvp_status "response_status"
    }
    
    CHECK_INS {
        index idx_checkin_guest_id "guest_id"
        index idx_checkin_time "check_in_time"
    }
    
    QR_CODES {
        index idx_qr_token "qr_token"
        index idx_qr_guest_id "guest_id"
    }
    
    INVITATIONS {
        index idx_invitation_guest_id "guest_id"
        index idx_invitation_event_id "event_id"
        index idx_invitation_status "invitation_status"
    }
```

### Bảng chi tiết

#### 1. GUESTS - Thông tin khách mời
- **id**: Primary key, auto increment
- **full_name**: Họ và tên khách mời (bắt buộc)
- **position**: Chức vụ
- **organization**: Tên công ty/tổ chức
- **phone_number**: Số điện thoại
- **email**: Email (để gửi thiệp mời)
- **qr_code**: Mã QR duy nhất (deprecated, moved to QR_CODES table)
- **created_at**: Thời gian tạo
- **updated_at**: Thời gian cập nhật

#### 2. RSVP_RESPONSES - Phản hồi tham gia
- **id**: Primary key, auto increment  
- **guest_id**: Foreign key tham chiếu đến GUESTS
- **response_status**: Trạng thái phản hồi (PENDING, ACCEPTED, DECLINED)
- **notes**: Ghi chú kèm theo từ khách mời
- **response_date**: Thời gian phản hồi
- **created_at**: Thời gian tạo
- **updated_at**: Thời gian cập nhật

#### 3. CHECK_INS - Thông tin check-in
- **id**: Primary key, auto increment
- **guest_id**: Foreign key tham chiếu đến GUESTS
- **check_in_time**: Thời gian check-in
- **check_in_by**: Người thực hiện check-in
- **notes**: Ghi chú
- **created_at**: Thời gian tạo

#### 4. EVENTS - Thông tin sự kiện
- **id**: Primary key, auto increment
- **event_name**: Tên sự kiện
- **description**: Mô tả sự kiện
- **event_date**: Ngày giờ tổ chức sự kiện
- **venue**: Địa điểm
- **program_details**: Chi tiết chương trình
- **is_active**: Trạng thái hoạt động
- **created_at**: Thời gian tạo
- **updated_at**: Thời gian cập nhật

#### 5. QR_CODES - Quản lý mã QR
- **id**: Primary key, auto increment
- **guest_id**: Foreign key tham chiếu đến GUESTS
- **qr_token**: Token duy nhất cho QR code
- **qr_url**: URL đầy đủ của QR code
- **is_active**: Trạng thái hoạt động
- **expires_at**: Thời gian hết hạn
- **created_at**: Thời gian tạo
- **updated_at**: Thời gian cập nhật

#### 6. INVITATIONS - Quản lý thiệp mời
- **id**: Primary key, auto increment
- **guest_id**: Foreign key tham chiếu đến GUESTS
- **event_id**: Foreign key tham chiếu đến EVENTS
- **invitation_status**: Trạng thái thiệp mời (DRAFT, SENT, DELIVERED, FAILED)
- **sent_at**: Thời gian gửi
- **sent_method**: Phương thức gửi (EMAIL, SMS, PRINT)
- **created_at**: Thời gian tạo
- **updated_at**: Thời gian cập nhật

#### 7. SYSTEM_CONFIGS - Cấu hình hệ thống
- **id**: Primary key, auto increment
- **config_key**: Khóa cấu hình
- **config_value**: Giá trị cấu hình
- **description**: Mô tả
- **created_at**: Thời gian tạo
- **updated_at**: Thời gian cập nhật

### Business Rules

1. **Mỗi khách mời có duy nhất một QR code hoạt động**
2. **QR code có thời gian hết hạn**
3. **Khách mời chỉ có thể check-in một lần**
4. **Phản hồi RSVP có thể được cập nhật nhiều lần trước thời hạn**
5. **Email và số điện thoại phải có định dạng hợp lệ**
6. **Tên khách mời là trường bắt buộc**