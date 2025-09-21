# Hướng dẫn sử dụng Guest Management System (GMS)

## Tổng quan hệ thống

GMS là hệ thống quản lý khách mời cho sự kiện Lễ kỷ niệm 15 năm thành lập công ty. Hệ thống bao gồm:

- **Backend API**: Xử lý dữ liệu và logic nghiệp vụ
- **Admin Dashboard**: Quản lý khách mời và thống kê  
- **RSVP Page**: Trang phản hồi cho khách mời
- **Check-in Page**: Trang check-in tại sự kiện

## Cài đặt và khởi chạy

### 1. Cài đặt Backend

```bash
cd backend
npm install
npm start
```

Server sẽ chạy tại: http://localhost:3000

### 2. Truy cập Frontend

- **Admin Dashboard**: `frontend/index.html`
- **RSVP Page**: `frontend/rsvp.html`  
- **Check-in Page**: `frontend/checkin.html`

Mở các file HTML trên trình duyệt hoặc dùng live server.

## Quy trình sử dụng

### Bước 1: Quản lý khách mời (Admin)

1. Mở Admin Dashboard (`frontend/index.html`)
2. **Thêm khách mời thủ công**:
   - Điền thông tin: Họ tên, chức vụ, tổ chức, số ĐT
   - Click "Thêm khách mời"
3. **Import từ CSV**:
   - Chuẩn bị file CSV với cột: name, position, organization, phone
   - Chọn file và click "Import CSV"

### Bước 2: Gửi thiệp mời

1. Trong bảng danh sách khách mời, click "QR Code"
2. Hệ thống hiển thị:
   - Mã QR code
   - Link RSVP
3. Gửi QR code/link cho khách mời qua email/tin nhắn

### Bước 3: Khách mời phản hồi (RSVP)

1. Khách mời quét QR code hoặc click link
2. Trang RSVP hiển thị:
   - Thông tin khách mời
   - Chi tiết sự kiện
   - Nút "Tôi sẽ tham gia" / "Tôi không thể tham gia"
3. Khách mời chọn phản hồi → Hệ thống cập nhật trạng thái

### Bước 4: Check-in tại sự kiện

1. Mở trang Check-in (`frontend/checkin.html`)
2. **Quét QR code**:
   - Hướng camera/máy quét vào QR code khách mời
   - Hoặc nhập mã thủ công vào ô input
3. **Thông tin hiển thị**:
   - Tên, chức vụ, tổ chức khách mời
   - Trạng thái phản hồi
   - Trạng thái check-in
4. Click "Check-in khách mời" nếu hợp lệ

## Các trang chức năng

### Admin Dashboard (`/frontend/index.html`)
- Xem thống kê tổng quan
- Thêm khách mời mới
- Import danh sách từ CSV
- Xem danh sách và trạng thái khách mời
- Tạo QR code cho từng khách mời
- Check-in thủ công

### RSVP Page (`/frontend/rsvp.html?qr=XXX`)
- Hiển thị thông tin khách mời
- Hiển thị chi tiết sự kiện
- Cho phép khách mời phản hồi tham gia/từ chối
- Xác nhận phản hồi đã gửi

### Check-in Page (`/frontend/checkin.html`)
- Thống kê real-time
- Quét QR code check-in
- Hiển thị thông tin chi tiết khách mời
- Check-in nhanh với validation
- Danh sách check-in gần đây

## Format CSV Import

File CSV cần có header và format như sau:

```csv
name,position,organization,phone
Nguyễn Văn A,Giám đốc,Công ty ABC,0123456789
Trần Thị B,Trưởng phòng,Công ty XYZ,0987654321
```

## Trạng thái khách mời

- **PENDING**: Chờ phản hồi (màu cam)
- **ACCEPTED**: Đã xác nhận tham gia (màu xanh lá)
- **DECLINED**: Từ chối tham gia (màu đỏ)
- **Check-in**: Đã check-in tại sự kiện (màu xanh dương)

## Lưu ý quan trọng

1. **Mỗi khách mời có QR code duy nhất** - không được trùng lặp
2. **Chỉ khách đã xác nhận (ACCEPTED) mới được check-in**
3. **Khách đã check-in không thể check-in lại**
4. **Dữ liệu lưu trong SQLite database** (`backend/gms.db`)
5. **API chạy trên port 3000** - đảm bảo port không bị chiếm dụng

## Xử lý sự cố

### Backend không khởi động
- Kiểm tra port 3000 có bị chiếm dụng
- Chạy `npm install` để cài đặt dependencies
- Kiểm tra log lỗi trong terminal

### Frontend không kết nối API
- Đảm bảo backend đang chạy
- Kiểm tra CORS settings
- Mở Developer Tools để xem lỗi network

### QR code không hoạt động  
- Kiểm tra format URL trong QR
- Đảm bảo khách mời tồn tại trong database
- Kiểm tra QR code không bị hỏng/mờ

## Liên hệ hỗ trợ

Nếu gặp vấn đề, vui lòng liên hệ ban tổ chức kỹ thuật.