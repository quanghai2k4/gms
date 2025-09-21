# Mô hình 4C - Guest Management System

Tài liệu này mô tả kiến trúc hệ thống Guest Management System theo mô hình 4C: Context, Container, Component và Code.

## Level 1: Context Diagram

```mermaid
C4Context
    title System Context - Guest Management System
    
    Person(organizer, "Ban tổ chức", "Quản lý khách mời, gửi thiệp mời, theo dõi phản hồi")
    Person(guest, "Khách mời", "Nhận thiệp mời, phản hồi RSVP")
    Person(staff, "Nhân viên lễ tân", "Check-in khách tại sự kiện")
    
    System(gms, "Guest Management System", "Hệ thống quản lý khách mời cho sự kiện kỷ niệm 15 năm")
    
    System_Ext(email, "Email System", "Gửi thiệp mời điện tử")
    System_Ext(print, "In ấn", "In thiệp mời giấy kèm QR code")
    
    Rel(organizer, gms, "Quản lý khách mời, tạo QR code")
    Rel(guest, gms, "Truy cập thiệp mời, phản hồi RSVP")
    Rel(staff, gms, "Check-in khách mời")
    
    Rel(gms, email, "Gửi link thiệp mời")
    Rel(gms, print, "Xuất QR code để in")
```

## Level 2: Container Diagram

```mermaid
C4Container
    title Container Diagram - Guest Management System
    
    Person(organizer, "Ban tổ chức")
    Person(guest, "Khách mời") 
    Person(staff, "Nhân viên lễ tán")
    
    Container_Boundary(gms, "Guest Management System") {
        Container(web_admin, "Admin Web App", "HTML/CSS/JS", "Giao diện quản lý khách mời cho ban tổ chức")
        Container(web_rsvp, "RSVP Web App", "HTML/CSS/JS", "Trang thiệp mời và phản hồi cho khách mời")
        Container(web_checkin, "Check-in Web App", "HTML/CSS/JS", "Giao diện check-in tại sự kiện")
        Container(api, "API Server", "Node.js/Express", "REST API xử lý business logic")
        Container(db, "Database", "SQLite", "Lưu trữ dữ liệu khách mời, RSVP, check-in")
    }
    
    Rel(organizer, web_admin, "Quản lý via HTTPS")
    Rel(guest, web_rsvp, "Truy cập via HTTPS/QR")
    Rel(staff, web_checkin, "Check-in via HTTPS")
    
    Rel(web_admin, api, "API calls", "HTTPS/JSON")
    Rel(web_rsvp, api, "API calls", "HTTPS/JSON") 
    Rel(web_checkin, api, "API calls", "HTTPS/JSON")
    Rel(api, db, "SQL queries", "SQLite")
```

## Level 3: Component Diagram - API Server

```mermaid
C4Component
    title Component Diagram - API Server
    
    Container(web_apps, "Web Applications", "HTML/CSS/JS")
    Container(db, "SQLite Database")
    
    Container_Boundary(api, "API Server") {
        Component(guest_controller, "Guest Controller", "Express Router", "Xử lý CRUD khách mời")
        Component(rsvp_controller, "RSVP Controller", "Express Router", "Xử lý phản hồi khách mời")
        Component(checkin_controller, "Check-in Controller", "Express Router", "Xử lý check-in sự kiện")
        Component(stats_controller, "Statistics Controller", "Express Router", "Cung cấp thống kê")
        
        Component(guest_service, "Guest Service", "Business Logic", "Logic quản lý khách mời")
        Component(rsvp_service, "RSVP Service", "Business Logic", "Logic xử lý RSVP")
        Component(checkin_service, "Check-in Service", "Business Logic", "Logic check-in")
        
        Component(qr_generator, "QR Generator", "QRCode Library", "Tạo mã QR duy nhất")
        Component(csv_parser, "CSV Parser", "CSV Library", "Đọc file CSV import")
        Component(validator, "Data Validator", "Validation Logic", "Validate dữ liệu đầu vào")
        
        Component(db_layer, "Database Layer", "SQLite Driver", "Truy xuất dữ liệu")
    }
    
    Rel(web_apps, guest_controller, "HTTP/JSON")
    Rel(web_apps, rsvp_controller, "HTTP/JSON") 
    Rel(web_apps, checkin_controller, "HTTP/JSON")
    Rel(web_apps, stats_controller, "HTTP/JSON")
    
    Rel(guest_controller, guest_service, "Method calls")
    Rel(rsvp_controller, rsvp_service, "Method calls")
    Rel(checkin_controller, checkin_service, "Method calls")
    Rel(stats_controller, guest_service, "Method calls")
    
    Rel(guest_service, qr_generator, "Generate QR")
    Rel(guest_service, csv_parser, "Parse CSV")
    Rel(guest_service, validator, "Validate data")
    
    Rel(guest_service, db_layer, "SQL queries")
    Rel(rsvp_service, db_layer, "SQL queries")
    Rel(checkin_service, db_layer, "SQL queries")
    
    Rel(db_layer, db, "SQLite connection")
```

## Level 4: Code Diagram - Guest Service

```mermaid
classDiagram
    class GuestService {
        -dbLayer: DatabaseLayer
        -qrGenerator: QRGenerator
        -csvParser: CSVParser
        -validator: Validator
        
        +createGuest(guestData): Promise~Guest~
        +importGuestsFromCSV(filePath): Promise~Guest[]~
        +getAllGuests(): Promise~Guest[]~
        +getGuestByQR(qrCode): Promise~Guest~
        +generateQRCode(guestId): string
        +validateGuestData(data): ValidationResult
    }
    
    class Guest {
        +id: number
        +name: string
        +position: string
        +organization: string
        +phone: string
        +qr_code: string
        +status: GuestStatus
        +created_at: Date
        
        +toJSON(): object
        +isValid(): boolean
    }
    
    class DatabaseLayer {
        -db: SQLiteDatabase
        
        +createGuest(guest): Promise~Guest~
        +findGuestByQR(qrCode): Promise~Guest~
        +getAllGuests(): Promise~Guest[]~
        +updateGuestStatus(id, status): Promise~void~
        +getStatistics(): Promise~Stats~
    }
    
    class QRGenerator {
        +generateUniqueCode(): string
        +createQRImage(code): Promise~Buffer~
    }
    
    class CSVParser {
        +parseFile(filePath): Promise~GuestData[]~
        +validateHeaders(headers): boolean
    }
    
    class Validator {
        +validateGuestData(data): ValidationResult
        +isValidPhone(phone): boolean
        +isValidName(name): boolean
    }
    
    <<enumeration>> GuestStatus
    GuestStatus : PENDING
    GuestStatus : ACCEPTED  
    GuestStatus : DECLINED
    GuestStatus : CHECKED_IN
    
    GuestService --> Guest
    GuestService --> DatabaseLayer
    GuestService --> QRGenerator
    GuestService --> CSVParser
    GuestService --> Validator
    Guest --> GuestStatus
```

## Luồng dữ liệu chính

### 1. Thêm khách mời mới
```mermaid
sequenceDiagram
    participant Admin as Admin Web App
    participant API as API Server
    participant QR as QR Generator
    participant DB as Database
    
    Admin->>+API: POST /api/guests
    API->>API: Validate data
    API->>+QR: Generate unique QR code
    QR-->>-API: QR code string
    API->>+DB: INSERT guest with QR
    DB-->>-API: Guest record
    API-->>-Admin: Success response with QR
```

### 2. Phản hồi RSVP
```mermaid
sequenceDiagram
    participant Guest as Guest Web App
    participant API as API Server  
    participant DB as Database
    
    Guest->>+API: GET /api/guests/qr/{code}
    API->>+DB: SELECT guest by QR
    DB-->>-API: Guest info
    API-->>-Guest: Guest details
    
    Guest->>+API: POST /api/rsvp
    API->>+DB: UPDATE guest status + log
    DB-->>-API: Success
    API-->>-Guest: RSVP confirmed
```

### 3. Check-in sự kiện
```mermaid
sequenceDiagram
    participant Staff as Check-in App
    participant API as API Server
    participant DB as Database
    
    Staff->>+API: POST /api/checkin
    API->>+DB: SELECT guest by QR
    DB-->>-API: Guest info
    API->>API: Validate status
    API->>+DB: UPDATE to CHECKED_IN + log
    DB-->>-API: Success
    API-->>-Staff: Check-in confirmed
```

## Deployment Architecture

```mermaid
deployment
    node "Server Environment" {
        node "Node.js Runtime" {
            artifact "GMS API Server"
            artifact "Static File Server"
        }
        
        node "File System" {
            artifact "SQLite Database"
            artifact "Static Assets"
            artifact "QR Code Images"
        }
    }
    
    node "Client Devices" {
        node "Admin Browser" {
            artifact "Admin Web App"
        }
        
        node "Guest Mobile/Browser" {
            artifact "RSVP Web App"  
        }
        
        node "Staff Device" {
            artifact "Check-in Web App"
        }
    }
```

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Simple, no framework dependencies |
| **Backend** | Node.js + Express.js | Fast development, JSON native |
| **Database** | SQLite | Lightweight, embedded, no server setup |
| **QR Generation** | qrcode npm package | Simple, reliable QR generation |
| **CSV Parsing** | csv-parser npm package | Handle CSV import efficiently |
| **Styling** | Pure CSS with Flexbox/Grid | Responsive without frameworks |
| **Hosting** | Single server deployment | All-in-one solution |

## Security Considerations

1. **Input Validation**: Server-side validation for all inputs
2. **QR Code Security**: UUID-based codes prevent guessing
3. **Rate Limiting**: Prevent brute force attacks
4. **CORS Policy**: Restrict cross-origin requests
5. **Data Sanitization**: Clean user inputs before database storage