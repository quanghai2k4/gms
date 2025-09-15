# Guest Management System (GMS)

Hệ thống quản lý khách mời cho Lễ kỷ niệm 15 năm

## Tổng quan

Guest Management System (GMS) là một ứng dụng web toàn diện được thiết kế để quản lý khách mời cho các sự kiện, đặc biệt là Lễ kỷ niệm 15 năm. Hệ thống cung cấp các tính năng quản lý danh sách khách mời, gửi thiệp mời điện tử, theo dõi phản hồi RSVP và check-in tại sự kiện.

## Tính năng chính

### 🎯 Quản lý khách mời
- Tạo và chỉnh sửa khách mời thủ công
- Import danh sách từ file CSV
- Phát hiện và hợp nhất khách mời trùng lặp
- Xuất danh sách khách mời với trạng thái

### 🎫 Thiệp mời và QR Code
- Sinh mã QR duy nhất cho từng khách
- Tạo đường link thiệp mời cá nhân hóa
- Gửi thiệp mời qua email/SMS
- Quản lý nội dung chương trình sự kiện

### 📊 Theo dõi RSVP
- Dashboard tổng quan trạng thái RSVP
- Cập nhật RSVP thủ công và tự động
- Báo cáo và phân tích chi tiết
- Thiết lập hạn chót phản hồi

### ✅ Check-in sự kiện
- Quét mã QR để check-in
- Theo dõi check-in theo thời gian thực
- Xử lý các ngoại lệ khi check-in
- Giám sát sự kiện trực tuyến

### 👥 Trải nghiệm khách mời
- Xem thiệp mời cá nhân hóa
- Gửi phản hồi tham gia/từ chối
- Thay đổi quyết định trước hạn chót
- Check-in nhanh chóng tại cổng

## Cấu trúc tài liệu

```
docs/
├── README.md              # Tài liệu tổng quan (file này)
├── user-stories.md        # User stories chi tiết
├── acceptance-criteria.md # Acceptance criteria
├── api.md                # Tài liệu API
└── installation.md       # Hướng dẫn cài đặt
```

## Vai trò người dùng

### Ban tổ chức (ORG)
- Quản lý danh sách khách mời
- Tạo và gửi thiệp mời
- Theo dõi phản hồi RSVP
- Quản lý check-in tại sự kiện
- Xem báo cáo và phân tích

### Khách mời (GUEST)
- Xem thiệp mời cá nhân
- Gửi phản hồi tham dự
- Thay đổi quyết định
- Check-in tại sự kiện

## Công nghệ sử dụng

(Sẽ được cập nhật khi có thông tin chi tiết về stack công nghệ)

## Liên kết nhanh

- [📋 User Stories](docs/user-stories.md) - Các câu chuyện người dùng chi tiết
- [✅ Acceptance Criteria](docs/acceptance-criteria.md) - Tiêu chí nghiệm thu
- [🔧 API Documentation](docs/api.md) - Tài liệu API
- [⚙️ Installation Guide](docs/installation.md) - Hướng dẫn cài đặt

## Đóng góp

Để đóng góp vào dự án, vui lòng đọc tài liệu hướng dẫn trong thư mục docs/ và tuân theo các quy tắc coding standards của dự án.

## Giấy phép

[Thông tin giấy phép sẽ được cập nhật]