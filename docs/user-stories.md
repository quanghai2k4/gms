# User Stories

User Stories cho Hệ thống quản lý khách mời Lễ kỷ niệm 15 năm

## Tổng quan

### Vai trò người dùng
- **Ban tổ chức (ORG)**: Nhân viên quản lý sự kiện, có quyền quản lý khách mời và theo dõi sự kiện
- **Khách mời (GUEST)**: Người được mời tham dự sự kiện

### Thuật ngữ
- **RSVP**: Phản hồi tham dự (Responding to an invitation)
- **QR**: Mã QR code duy nhất cho mỗi khách mời
- **Thiệp mời**: Trang/đường link cá nhân hóa cho khách mời

---

## Nhóm ORG - Quản lý dữ liệu khách mời

### ORG-01 — Tạo khách mời thủ công
**Là ban tổ chức**, tôi muốn nhập thủ công thông tin khách mời (họ tên, chức vụ, tổ chức, số điện thoại) **để có thể** thêm từng người riêng lẻ một cách chính xác.

**Giá trị kinh doanh**: Cho phép quản lý chi tiết từng khách mời quan trọng

---

### ORG-02 — Import danh sách từ CSV
**Là ban tổ chức**, tôi muốn import file CSV chứa danh sách khách mời **để tiết kiệm** thời gian nhập liệu khi có số lượng lớn khách mời.

**Giá trị kinh doanh**: Tăng hiệu quả xử lý với danh sách lớn

---

### ORG-03 — Chỉnh sửa / xóa khách mời
**Là ban tổ chức**, tôi muốn chỉnh sửa hoặc xóa hồ sơ khách mời **để đảm bảo** dữ liệu luôn chính xác và sạch.

**Giá trị kinh doanh**: Đảm bảo chất lượng dữ liệu và tính linh hoạt

---

### ORG-04 — Phát hiện & hợp nhất trùng lặp
**Là ban tổ chức**, tôi muốn hệ thống phát hiện các bản ghi trùng (ví dụ trùng số điện thoại) và hỗ trợ hợp nhất **để tránh** gửi thiệp mời nhiều lần cho cùng một người.

**Giá trị kinh doanh**: Tránh nhầm lẫn và tạo ấn tượng chuyên nghiệp

---

### ORG-05 — Xuất danh sách
**Là ban tổ chức**, tôi muốn xuất danh sách khách mời (CSV/XLSX) kèm trạng thái RSVP và check-in **để chia sẻ** nội bộ hoặc lưu trữ.

**Giá trị kinh doanh**: Hỗ trợ báo cáo và chia sẻ thông tin với các bên liên quan

---

## Nhóm ORG - QR & Thiệp mời

### ORG-06 — Sinh QR duy nhất cho mỗi khách
**Là ban tổ chức**, tôi muốn hệ thống tự sinh một mã QR duy nhất cho mỗi khách **để dùng** cho cả RSVP và check-in.

**Giá trị kinh doanh**: Đơn giản hóa quy trình và tăng tính bảo mật

---

### ORG-07 — Tạo đường link thiệp mời cá nhân hóa
**Là ban tổ chức**, tôi muốn có một đường link duy nhất trỏ tới trang thiệp mời của khách (chứa/đi kèm QR) **để gửi** cho họ.

**Giá trị kinh doanh**: Tạo trải nghiệm cá nhân hóa cho khách mời

---

### ORG-08 — Gửi thiệp mời
**Là ban tổ chức**, tôi muốn gửi thiệp mời (email/SMS) kèm link/QR hoặc sao chép link để gửi thủ công, và theo dõi trạng thái đã gửi.

**Giá trị kinh doanh**: Tự động hóa quy trình gửi thiệp và theo dõi tiến độ

---

### ORG-09 — Quản lý nội dung chương trình cơ bản
**Là ban tổ chức**, tôi muốn soạn thảo nội dung chương trình cơ bản hiển thị trên trang thiệp mời **để khách** nắm được lịch trình sự kiện.

**Giá trị kinh doanh**: Cung cấp thông tin đầy đủ cho khách mời

---

### ORG-10 — Thiết lập hạn chót RSVP & thông điệp
**Là ban tổ chức**, tôi muốn đặt hạn chót phản hồi và tùy chỉnh thông điệp hiển thị sau hạn chót.

**Giá trị kinh doanh**: Kiểm soát thời gian và quản lý kỳ vọng khách mời

---

## Nhóm ORG - Theo dõi RSVP & báo cáo

### ORG-11 — Bảng điều khiển trạng thái RSVP
**Là ban tổ chức**, tôi muốn xem tổng quan số lượng Chưa phản hồi / Tham gia / Từ chối **để theo dõi** tiến độ mời.

**Giá trị kinh doanh**: Có cái nhìn tổng quan về tình hình phản hồi

---

### ORG-12 — Cập nhật RSVP thủ công
**Là ban tổ chức**, tôi muốn cập nhật trạng thái RSVP cho khách (ví dụ khách báo qua điện thoại) **để dữ liệu** đồng nhất.

**Giá trị kinh doanh**: Đảm bảo tính chính xác của dữ liệu từ mọi kênh

---

### ORG-13 — Báo cáo & phân tích
**Là ban tổ chức**, tôi muốn xem và tải báo cáo tổng hợp (tỉ lệ phản hồi, tỉ lệ tham gia theo nhóm tổ chức, v.v.) **để đánh giá** hiệu quả mời.

**Giá trị kinh doanh**: Cung cấp insights cho việc cải thiện sự kiện

---

## Nhóm ORG - Check-in sự kiện

### ORG-14 — Quét QR để check-in
**Là ban tổ chức**, tôi muốn dùng thiết bị (điện thoại/máy quét) quét QR của khách tại cổng **để ghi nhận** check-in tự động.

**Giá trị kinh doanh**: Tăng tốc độ xử lý tại cổng vào

---

### ORG-15 — Xử lý ngoại lệ khi check-in
**Là ban tổ chức**, tôi muốn hệ thống cảnh báo các trường hợp QR không hợp lệ/đã check-in/đã hủy **để xử lý** nhanh tại cổng.

**Giá trị kinh doanh**: Giảm thiểu gián đoạn và xử lý mượt mà

---

### ORG-16 — Theo dõi check-in theo thời gian thực
**Là ban tổ chức**, tôi muốn xem số khách đã check-in theo thời gian thực **để điều phối** sự kiện (đón tiếp, F&B, chỗ ngồi).

**Giá trị kinh doanh**: Hỗ trợ điều phối sự kiện hiệu quả

---

## Nhóm GUEST - Thiệp mời & RSVP

### GUEST-01 — Xem thiệp mời & chương trình
**Là khách mời**, tôi muốn mở link/QR **để xem** thiệp mời cá nhân hóa và chương trình cơ bản của buổi lễ.

**Giá trị kinh doanh**: Tạo trải nghiệm thuận tiện cho khách mời

---

### GUEST-02 — Gửi phản hồi Tham gia/Từ chối
**Là khách mời**, tôi muốn chọn Tham gia hoặc Từ chối ngay trên trang thiệp mời **để báo** cho ban tổ chức.

**Giá trị kinh doanh**: Đơn giản hóa quy trình phản hồi

---

### GUEST-03 — Nhận xác nhận phản hồi
**Là khách mời**, tôi muốn thấy thông điệp/xác nhận (và email/SMS nếu có) sau khi gửi RSVP **để biết** đã được ghi nhận.

**Giá trị kinh doanh**: Tăng sự tin tưởng và rõ ràng

---

### GUEST-04 — Thay đổi quyết định trước hạn chót
**Là khách mời**, tôi muốn có thể thay đổi từ Tham gia ↔ Từ chối trước hạn chót **nếu lịch** của tôi thay đổi.

**Giá trị kinh doanh**: Linh hoạt cho khách mời, dữ liệu chính xác hơn

---

### GUEST-05 — Dùng QR để check-in tại cổng
**Là khách mời**, tôi muốn đưa QR của mình **để được** check-in nhanh chóng khi đến sự kiện.

**Giá trị kinh doanh**: Tăng trải nghiệm khách mời tại sự kiện

---

## Tổng kết

### Tính năng cốt lõi theo độ ưu tiên:

#### 🔥 Cao (MVP)
- ORG-01, ORG-02: Quản lý danh sách khách mời
- ORG-06, ORG-07, ORG-08: Tạo và gửi thiệp mời
- GUEST-01, GUEST-02: Xem thiệp và phản hồi RSVP
- ORG-11: Dashboard theo dõi RSVP

#### 📈 Trung bình
- ORG-03, ORG-04, ORG-05: Quản lý dữ liệu nâng cao
- ORG-09, ORG-10: Quản lý nội dung
- ORG-14, ORG-15: Check-in cơ bản
- GUEST-03, GUEST-04: Trải nghiệm RSVP nâng cao

#### 🎯 Thấp (Nice to have)
- ORG-12, ORG-13: Báo cáo và phân tích
- ORG-16: Theo dõi thời gian thực
- GUEST-05: Check-in QR cho khách