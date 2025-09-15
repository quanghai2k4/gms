# 4C Model - Hệ thống Quản lý Khách mời

## 1. Context Diagram - Bối cảnh hệ thống

```mermaid
graph TB
    subgraph "Người dùng"
        BTC[Ban Tổ chức<br/>- Quản lý khách mời<br/>- Gửi thiệp mời<br/>- Check-in sự kiện]
        KM[Khách mời<br/>- Xem thiệp mời<br/>- Phản hồi RSVP<br/>- Tham dự sự kiện]
    end
    
    subgraph "Hệ thống chính"
        GMS[Guest Management System<br/>Hệ thống Quản lý Khách mời<br/>Lễ kỷ niệm 15 năm]
    end
    
    subgraph "Hệ thống bên ngoài"
        EMAIL[Email Service<br/>Gmail/Outlook]
        SMS[SMS Service<br/>Twilio/AWS SNS]
        QR[QR Code Service<br/>Google Charts API]
        STORAGE[File Storage<br/>Local/Cloud Storage]
    end
    
    %% Relationships
    BTC -->|Quản lý khách mời, Check-in| GMS
    KM -->|Truy cập QR, RSVP| GMS
    
    GMS -->|Gửi email thiệp mời| EMAIL
    GMS -->|Gửi SMS thông báo| SMS
    GMS -->|Tạo QR code| QR
    GMS -->|Lưu trữ file CSV, hình ảnh| STORAGE
    
    EMAIL -->|Thông báo gửi thành công| GMS
    SMS -->|Thông báo gửi thành công| GMS
    QR -->|QR code image/URL| GMS
    STORAGE -->|File data| GMS

    classDef userClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef systemClass fill:#f3e5f5,stroke:#4a148c,stroke-width:3px
    classDef externalClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class BTC,KM userClass
    class GMS systemClass
    class EMAIL,SMS,QR,STORAGE externalClass
```

## 2. Container Diagram - Kiến trúc containers

```mermaid
graph TB
    subgraph "Người dùng"
        BTC[Ban Tổ chức<br/>Web Browser/Mobile]
        KM[Khách mời<br/>Mobile Browser]
    end
    
    subgraph "Guest Management System"
        WEB[Web Application<br/>React.js<br/>Port: 3000<br/>- Admin Dashboard<br/>- Guest Management<br/>- Check-in Interface]
        
        API[API Application<br/>Node.js/Express<br/>Port: 8000<br/>- REST APIs<br/>- Business Logic<br/>- Authentication]
        
        DB[(SQLite Database<br/>- Guest data<br/>- RSVP responses<br/>- Check-in records<br/>- Event information)]
        
        FILES[File Storage<br/>- CSV imports<br/>- QR code images<br/>- Export files]
    end
    
    subgraph "Hệ thống bên ngoài"
        EMAIL[Email Service<br/>SMTP/Gmail API]
        SMS[SMS Service<br/>Twilio API]
        QR_SERVICE[QR Code Generator<br/>Google Charts/QRServer]
    end
    
    %% User interactions
    BTC -->|HTTPS| WEB
    KM -->|HTTPS<br/>QR Code URL| WEB
    
    %% Internal communications
    WEB -->|REST API<br/>HTTP/JSON| API
    API -->|SQLite queries| DB
    API -->|File I/O| FILES
    
    %% External integrations
    API -->|SMTP/API calls| EMAIL
    API -->|HTTP API| SMS
    API -->|HTTP requests| QR_SERVICE
    
    classDef userClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef webClass fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef apiClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef dataClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef externalClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class BTC,KM userClass
    class WEB webClass
    class API apiClass
    class DB,FILES dataClass
    class EMAIL,SMS,QR_SERVICE externalClass
```

## 3. Component Diagram - Thành phần hệ thống

```mermaid
graph TB
    subgraph "Web Application (React.js)"
        subgraph "Admin Components"
            ADMIN_DASH[Dashboard Component<br/>- Statistics overview<br/>- RSVP summary]
            GUEST_MGT[Guest Management<br/>- Guest list<br/>- Add/Edit/Delete<br/>- CSV Import]
            RSVP_VIEW[RSVP Viewer<br/>- Response tracking<br/>- Export functions]
            CHECKIN_SCAN[Check-in Scanner<br/>- QR code scanner<br/>- Guest verification]
        end
        
        subgraph "Public Components"
            INVITATION[Invitation Page<br/>- Event details<br/>- Guest information]
            RSVP_FORM[RSVP Form<br/>- Response selection<br/>- Notes input]
            THANK_YOU[Thank You Page<br/>- Confirmation message]
        end
        
        subgraph "Shared Components"
            AUTH[Authentication<br/>- Login/Logout<br/>- Role management]
            COMMON[Common Components<br/>- Header, Footer<br/>- Loading, Error pages]
        end
    end
    
    subgraph "API Application (Node.js/Express)"
        subgraph "Controllers"
            GUEST_CTRL[Guest Controller<br/>- CRUD operations<br/>- CSV import logic]
            RSVP_CTRL[RSVP Controller<br/>- Response handling<br/>- Status updates]
            CHECKIN_CTRL[Check-in Controller<br/>- QR verification<br/>- Check-in logging]
            QR_CTRL[QR Controller<br/>- QR generation<br/>- Token validation]
        end
        
        subgraph "Services"
            GUEST_SVC[Guest Service<br/>- Business logic<br/>- Data validation]
            EMAIL_SVC[Email Service<br/>- Template rendering<br/>- SMTP integration]
            QR_SVC[QR Service<br/>- QR code generation<br/>- URL management]
            FILE_SVC[File Service<br/>- CSV processing<br/>- File uploads]
        end
        
        subgraph "Middleware"
            AUTH_MW[Auth Middleware<br/>- JWT validation<br/>- Role checking]
            CORS_MW[CORS Middleware<br/>- Cross-origin requests]
            LOG_MW[Logging Middleware<br/>- Request logging]
        end
        
        subgraph "Data Access"
            GUEST_REPO[Guest Repository<br/>- Database queries<br/>- Data mapping]
            RSVP_REPO[RSVP Repository<br/>- Response queries<br/>- Status updates]
            CHECKIN_REPO[Check-in Repository<br/>- Check-in records<br/>- Time tracking]
        end
    end
    
    %% Component relationships
    GUEST_MGT --> GUEST_CTRL
    RSVP_VIEW --> RSVP_CTRL
    CHECKIN_SCAN --> CHECKIN_CTRL
    INVITATION --> QR_CTRL
    RSVP_FORM --> RSVP_CTRL
    
    GUEST_CTRL --> GUEST_SVC
    RSVP_CTRL --> GUEST_SVC
    CHECKIN_CTRL --> GUEST_SVC
    QR_CTRL --> QR_SVC
    
    GUEST_SVC --> GUEST_REPO
    GUEST_SVC --> EMAIL_SVC
    EMAIL_SVC --> FILE_SVC
    QR_SVC --> GUEST_REPO
    
    GUEST_REPO --> RSVP_REPO
    RSVP_REPO --> CHECKIN_REPO
    
    classDef componentClass fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef controllerClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef serviceClass fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef repoClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class ADMIN_DASH,GUEST_MGT,RSVP_VIEW,CHECKIN_SCAN,INVITATION,RSVP_FORM,THANK_YOU,AUTH,COMMON componentClass
    class GUEST_CTRL,RSVP_CTRL,CHECKIN_CTRL,QR_CTRL controllerClass
    class GUEST_SVC,EMAIL_SVC,QR_SVC,FILE_SVC serviceClass
    class GUEST_REPO,RSVP_REPO,CHECKIN_REPO repoClass
```

## 4. Code Diagram - Chi tiết implementation

```mermaid
classDiagram
    class GuestController {
        +getAllGuests(): Guest[]
        +getGuestById(id: number): Guest
        +createGuest(guestData): Guest
        +updateGuest(id: number, data): Guest
        +deleteGuest(id: number): boolean
        +importGuestsFromCSV(file): ImportResult
        +exportGuestsToCSV(): string
    }
    
    class RSVPController {
        +getRSVPByGuestId(guestId: number): RSVP
        +updateRSVP(guestId: number, response): RSVP
        +getRSVPStats(): RSVPStatistics
        +getGuestByQRToken(token: string): Guest
    }
    
    class CheckInController {
        +checkInGuest(qrToken: string, staffId): CheckIn
        +getCheckInStats(): CheckInStatistics
        +getCheckInHistory(): CheckIn[]
        +validateQRCode(token: string): boolean
    }
    
    class QRController {
        +generateQRCode(guestId: number): QRCode
        +validateQRToken(token: string): ValidationResult
        +regenerateQRCode(guestId: number): QRCode
        +getQRCodeImage(token: string): Buffer
    }
    
    class GuestService {
        -guestRepository: GuestRepository
        -emailService: EmailService
        -qrService: QRService
        +validateGuestData(data): ValidationResult
        +processCSVImport(csvData): ImportResult
        +sendInvitation(guestId: number): boolean
    }
    
    class EmailService {
        -smtpConfig: SMTPConfig
        +sendInvitationEmail(guest: Guest, qrUrl: string): boolean
        +renderEmailTemplate(template: string, data): string
        +validateEmailAddress(email: string): boolean
    }
    
    class QRService {
        -qrGenerator: QRGenerator
        +generateQRCode(data: string): QRCode
        +createUniqueToken(): string
        +buildQRUrl(token: string): string
    }
    
    class GuestRepository {
        -db: SQLiteDatabase
        +findAll(): Guest[]
        +findById(id: number): Guest
        +findByQRToken(token: string): Guest
        +create(guest: Guest): Guest
        +update(id: number, data): Guest
        +delete(id: number): boolean
    }
    
    class RSVPRepository {
        -db: SQLiteDatabase
        +findByGuestId(guestId: number): RSVP
        +create(rsvp: RSVP): RSVP
        +update(guestId: number, response): RSVP
        +getStatistics(): RSVPStats
    }
    
    class CheckInRepository {
        -db: SQLiteDatabase
        +create(checkIn: CheckIn): CheckIn
        +findByGuestId(guestId: number): CheckIn
        +getStatistics(): CheckInStats
        +findAll(): CheckIn[]
    }
    
    class Guest {
        +id: number
        +fullName: string
        +position: string
        +organization: string
        +phoneNumber: string
        +email: string
        +createdAt: Date
        +updatedAt: Date
    }
    
    class RSVP {
        +id: number
        +guestId: number
        +responseStatus: RSVPStatus
        +notes: string
        +responseDate: Date
        +createdAt: Date
    }
    
    class CheckIn {
        +id: number
        +guestId: number
        +checkInTime: Date
        +checkInBy: string
        +notes: string
        +createdAt: Date
    }
    
    class QRCode {
        +id: number
        +guestId: number
        +token: string
        +url: string
        +isActive: boolean
        +expiresAt: Date
    }
    
    %% Relationships
    GuestController --> GuestService
    RSVPController --> GuestService
    CheckInController --> GuestService
    QRController --> QRService
    
    GuestService --> GuestRepository
    GuestService --> EmailService
    GuestService --> QRService
    
    GuestRepository --> Guest
    RSVPRepository --> RSVP
    CheckInRepository --> CheckIn
    QRService --> QRCode
    
    GuestService --> RSVPRepository
    GuestService --> CheckInRepository
```

## Tóm tắt kiến trúc 4C

### 1. Context (Bối cảnh)
- **Actors**: Ban tổ chức, Khách mời
- **External Systems**: Email Service, SMS Service, QR Code Service, File Storage
- **Main System**: Guest Management System

### 2. Containers (Container)
- **Web Application**: React.js frontend (Port 3000)
- **API Application**: Node.js/Express backend (Port 8000)
- **Database**: SQLite database
- **File Storage**: Local file system

### 3. Components (Thành phần)
- **Frontend**: Admin components, Public components, Shared components
- **Backend**: Controllers, Services, Middleware, Repositories
- **Clear separation of concerns và single responsibility**

### 4. Code (Mã nguồn)
- **Detailed class structures** với methods và properties
- **Clear relationships** giữa các classes
- **Repository pattern** cho data access
- **Service pattern** cho business logic