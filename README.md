# Guest Management System (GMS)

Hệ thống quản lý khách mời cho Lễ kỷ niệm 15 năm thành lập công ty A.

## Cấu trúc dự án

```
gms/
├── backend/          # API server (Node.js + Express)
├── frontend/         # Web interface (HTML/CSS/JS)
├── docs/            # Tài liệu
│   ├── requirement.md
│   └── v1.0/        # Phân tích và thiết kế hệ thống
├── gms.sh           # Script quản lý tổng hợp
└── README.md
```

## Chức năng chính

1. **Quản lý khách mời**: Thêm, sửa, xóa thông tin khách mời
2. **Tạo QR Code**: Mỗi khách mời có mã QR duy nhất
3. **RSVP**: Khách mời phản hồi tham gia/từ chối
4. **Check-in**: Quét QR tại sự kiện để ghi nhận check-in

## Cài đặt và chạy

### Script quản lý tổng hợp

#### Hiển thị hướng dẫn
```bash
./gms.sh help
```

#### Khởi động hệ thống
```bash
./gms.sh start
```
- Kiểm tra môi trường và dependencies
- Khởi động backend server
- Hiển thị đầy đủ thông tin truy cập localhost
- Hiển thị thống kê realtime và hướng dẫn sử dụng

#### Dừng hệ thống  
```bash
./gms.sh stop
```
- Dừng graceful server process
- Kiểm tra và giải phóng port 3000
- Xác nhận hệ thống đã dừng hoàn toàn

#### Kiểm tra trạng thái
```bash
./gms.sh status
```
- Kiểm tra backend server có đang chạy
- Hiển thị thống kê khách mời realtime
- Kiểm tra tình trạng các file hệ thống
- Liệt kê process đang chạy

#### Chạy test
```bash
./gms.sh test
```
- Test đầy đủ API endpoints
- Kiểm tra workflow từ tạo guest đến check-in

#### Khởi động lại hệ thống
```bash
./gms.sh restart
```
- Dừng và khởi động lại hệ thống

### Thủ công

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
Tất cả giao diện frontend đều chạy trên localhost thông qua backend server:

**Admin Dashboard:**
```
http://localhost:3000/
http://localhost:3000/admin
```
- Quản lý khách mời, import CSV, tạo QR code

**RSVP Page:**
```
http://localhost:3000/rsvp
http://localhost:3000/rsvp?qr=[QR_CODE]
```
- Khách mời xác nhận tham dự

**Check-in Interface:**
```
http://localhost:3000/checkin
```
- Quét QR code trong ngày sự kiện

> **Lưu ý:** Tất cả frontend đều chạy trên localhost:3000. Backend server sẽ tự động serve các file frontend.

## Tài liệu

- **API Documentation**: `docs/v1.0/api.md`
- **Database ERD**: `docs/v1.0/erd.md` 
- **User Guide**: `docs/v1.0/user-guide.md`
- **Sample CSV**: `docs/sample-guests.csv`

## Quy trình sử dụng

1. **Thêm khách mời** → Admin Dashboard
2. **Gửi QR code** → Tạo và gửi cho khách mời
3. **Khách phản hồi** → RSVP page
4. **Check-in** → Check-in page tại sự kiện

## Demo

Chạy `./gms.sh start` và truy cập:
- Admin: http://localhost:3000/
- Import mẫu: Dùng file `docs/sample-guests.csv`