# Acceptance Criteria

Tiêu chí nghiệm thu cho từng user story theo định dạng Given/When/Then

## Nhóm ORG - Quản lý dữ liệu khách mời

### ORG-01 — Tạo khách mời thủ công

**Kịch bản thành công:**
- **Given** tôi mở màn hình "Thêm khách mời"
- **When** tôi nhập họ tên, chức vụ, tổ chức, số điện thoại hợp lệ và lưu
- **Then** hệ thống tạo bản ghi khách mời mới với trạng thái mặc định:
  - RSVP = Chưa phản hồi
  - Check-in = Chưa check-in

**Kịch bản validation lỗi:**
- **Given** số điện thoại bị bỏ trống hoặc sai định dạng
- **When** tôi bấm lưu
- **Then** hệ thống hiển thị lỗi và không lưu bản ghi

**Kịch bản phát hiện trùng:**
- **Given** số điện thoại trùng với một bản ghi hiện có
- **When** tôi bấm lưu
- **Then** hệ thống cảnh báo trùng và đề xuất xem/hợp nhất (liên kết sang ORG-04)

---

### ORG-02 — Import danh sách từ CSV

**Kịch bản import thành công:**
- **Given** tôi tải lên file CSV đúng mẫu (có cột: full_name, title, organization, phone)
- **When** tôi chạy import
- **Then** hệ thống tạo n bản ghi hợp lệ và báo cáo số dòng thành công/thất bại

**Kịch bản dữ liệu không hợp lệ:**
- **Given** dòng dữ liệu thiếu phone hoặc sai định dạng
- **When** import
- **Then** dòng đó bị skip và được ghi vào báo cáo lỗi (tải được)

**Kịch bản phát hiện trùng:**
- **Given** CSV có bản ghi trùng phone với hệ thống
- **When** import
- **Then** hệ thống gắn cờ "nghi trùng" và không tạo mới (trừ khi tôi chọn tùy chọn "ghi đè/cập nhật")

**Kịch bản thiết lập trạng thái mặc định:**
- **Given** import thành công
- **When** hoàn tất
- **Then** tất cả bản ghi mới có:
  - RSVP = Chưa phản hồi
  - Check-in = Chưa check-in

---

### ORG-03 — Chỉnh sửa / xóa khách mời

**Kịch bản chỉnh sửa:**
- **Given** tôi mở hồ sơ khách mời
- **When** tôi chỉnh sửa trường thông tin hợp lệ và lưu
- **Then** dữ liệu được cập nhật và lịch sử thay đổi (ngày/giờ, người sửa) được ghi lại

**Kịch bản xóa:**
- **Given** tôi xóa một khách mời
- **When** xác nhận xóa
- **Then** bản ghi chuyển sang trạng thái "đã lưu trữ/ẩn" (không mất dữ liệu check-in/RSVP lịch sử) và không còn hiển thị trong danh sách mặc định

---

### ORG-04 — Phát hiện & hợp nhất trùng lặp

**Kịch bản phát hiện trùng:**
- **Given** trong danh sách có nhiều bản ghi cùng phone
- **When** tôi chạy chức năng phát hiện trùng
- **Then** hệ thống liệt kê các nhóm nghi trùng

**Kịch bản hợp nhất:**
- **Given** tôi chọn hợp nhất một nhóm
- **When** xác nhận bản ghi "giữ lại"
- **Then** dữ liệu được gộp theo quy tắc (giữ trường không rỗng ưu tiên bản ghi chính), QR/link cũ của bản ghi bị gộp trở về QR/link của bản ghi chính

**Kịch bản sau khi hợp nhất:**
- **Given** đã hợp nhất
- **When** tôi tìm bằng phone
- **Then** chỉ còn một khách mời duy nhất

---

### ORG-05 — Xuất danh sách

**Kịch bản xuất file:**
- **Given** tôi chọn "Xuất CSV/XLSX"
- **When** tôi bấm xuất
- **Then** file chứa các cột dữ liệu và cột trạng thái (RSVP, Thời gian phản hồi, Check-in, Thời gian check-in) được tải về

---

## Nhóm ORG - QR & Thiệp mời

### ORG-06 — Sinh QR duy nhất cho mỗi khách

**Kịch bản sinh QR tự động:**
- **Given** có bản ghi khách mời mới
- **When** lưu thành công
- **Then** hệ thống gán một mã định danh duy nhất và QR code tương ứng (dùng chung cho RSVP & check-in)

**Kịch bản tạo lại QR:**
- **Given** khách đã có QR
- **When** tôi yêu cầu "tạo lại QR"
- **Then** hệ thống không tạo QR mới trừ khi tôi xác nhận "thu hồi QR cũ" (QR cũ trở nên vô hiệu)

---

### ORG-07 — Tạo đường link thiệp mời cá nhân hóa

**Kịch bản tạo link:**
- **Given** mỗi khách có mã định danh
- **When** hệ thống tạo link thiệp mời
- **Then** link chứa token/bí danh đủ để định danh khách không cần đăng nhập

**Kịch bản bảo mật:**
- **Given** link bị chia sẻ nhầm
- **When** người khác mở
- **Then** trang vẫn hiển thị thông tin của khách tương ứng nhưng không lộ dữ liệu nhạy cảm ngoài các trường: họ tên, tổ chức, chức vụ

---

### ORG-08 — Gửi thiệp mời

**Kịch bản gửi tự động:**
- **Given** tôi chọn một hoặc nhiều khách
- **When** bấm "Gửi thiệp mời"
- **Then** hệ thống gửi email/SMS (nếu đã cấu hình kênh) kèm link/QR và ghi nhận Trạng thái gửi = Đã gửi + dấu thời gian

**Kịch bản xử lý lỗi:**
- **Given** lỗi gửi (hộp thư sai, SMS thất bại)
- **When** gửi
- **Then** hệ thống đánh dấu Gửi thất bại và hiển thị lý do trong nhật ký

**Kịch bản gửi thủ công:**
- **Given** tôi không dùng kênh tích hợp
- **When** bấm sao chép link
- **Then** hệ thống hiển thị/copy được link để gửi thủ công

---

### ORG-09 — Quản lý nội dung chương trình cơ bản

**Kịch bản soạn thảo:**
- **Given** tôi mở phần "Chương trình"
- **When** tôi soạn thảo nội dung (tiêu đề, thời gian, các mục chính) và lưu
- **Then** trang thiệp mời của khách hiển thị đúng nội dung đó

**Kịch bản cập nhật:**
- **Given** tôi cập nhật chương trình
- **When** lưu
- **Then** tất cả thiệp mời phản ánh nội dung mới ngay lập tức (hoặc theo phiên bản đã chọn)

---

### ORG-10 — Thiết lập hạn chót RSVP & thông điệp

**Kịch bản sau hạn chót:**
- **Given** tôi cấu hình hạn chót
- **When** đến thời điểm đó
- **Then** trang thiệp mời khóa thao tác thay đổi RSVP và hiển thị thông điệp tôi đã thiết lập

**Kịch bản trước hạn chót:**
- **Given** hạn chót chưa đến
- **When** khách mở trang
- **Then** khách vẫn có thể gửi/chỉnh sửa RSVP

---

## Nhóm ORG - Theo dõi RSVP & báo cáo

### ORG-11 — Bảng điều khiển trạng thái RSVP

**Kịch bản dashboard:**
- **Given** có dữ liệu khách
- **When** tôi mở dashboard
- **Then** tôi thấy tổng số và tỉ lệ Chưa phản hồi / Tham gia / Từ chối, có thể lọc theo tổ chức/nhóm

**Kịch bản drill-down:**
- **Given** tôi bấm vào một trạng thái
- **When** drill-down
- **Then** tôi thấy danh sách khách trong trạng thái đó

---

### ORG-12 — Cập nhật RSVP thủ công

**Kịch bản cập nhật:**
- **Given** khách xác nhận qua điện thoại
- **When** tôi cập nhật RSVP = Tham gia hoặc Từ chối
- **Then** trạng thái và thời điểm cập nhật được ghi lại với người thao tác

**Kịch bản lưu lịch sử:**
- **Given** tôi đổi từ Tham gia → Từ chối (hoặc ngược lại)
- **When** lưu
- **Then** lịch sử thay đổi lưu phiên bản trước

---

### ORG-13 — Báo cáo & phân tích

**Kịch bản tạo báo cáo:**
- **Given** tôi yêu cầu báo cáo
- **When** chọn kỳ và tiêu chí
- **Then** hệ thống tạo báo cáo (tỉ lệ phản hồi, phân nhóm theo tổ chức/chức vụ) có thể tải về (CSV/XLSX/PDF)

---

## Nhóm ORG - Check-in sự kiện

### ORG-14 — Quét QR để check-in

**Kịch bản quét thành công:**
- **Given** thiết bị có camera
- **When** tôi mở màn hình check-in và quét QR hợp lệ
- **Then** khách được đánh dấu Đã check-in và lưu thời gian check-in

**Kịch bản mạng không ổn định:**
- **Given** internet chập chờn
- **When** quét QR
- **Then** hệ thống lưu đệm cục bộ và đồng bộ lên server khi kết nối lại (nếu có chế độ offline được bật trong phạm vi dự án)

---

### ORG-15 — Xử lý ngoại lệ khi check-in

**Kịch bản QR đã check-in:**
- **Given** QR đã được check-in trước đó
- **When** quét lại
- **Then** màn hình cảnh báo "Đã check-in vào [thời gian]" và không tạo bản ghi mới

**Kịch bản QR không hợp lệ:**
- **Given** QR không tồn tại/đã thu hồi
- **When** quét
- **Then** hiển thị "QR không hợp lệ" và không ghi nhận

**Kịch bản lời mời bị hủy:**
- **Given** khách bị hủy lời mời (nếu có quy trình)
- **When** quét
- **Then** hiển thị "Lời mời đã bị hủy" và không check-in

---

### ORG-16 — Theo dõi check-in theo thời gian thực

**Kịch bản giám sát:**
- **Given** sự kiện đang diễn ra
- **When** tôi mở màn hình giám sát
- **Then** tôi thấy số người đã check-in, danh sách gần nhất, và biểu đồ theo thời gian (tự động cập nhật)

---

## Nhóm GUEST - Thiệp mời & RSVP

### GUEST-01 — Xem thiệp mời & chương trình

**Kịch bản xem thiệp mời:**
- **Given** tôi có link/QR hợp lệ
- **When** tôi mở trên trình duyệt
- **Then** tôi thấy thiệp mời hiển thị họ tên, tổ chức, chức vụ của tôi và chương trình cơ bản của buổi lễ

**Kịch bản link không hợp lệ:**
- **Given** link hết hạn hoặc không hợp lệ
- **When** mở
- **Then** hiển thị thông điệp phù hợp (ví dụ: "Thiệp mời không hợp lệ hoặc đã bị thu hồi")

---

### GUEST-02 — Gửi phản hồi Tham gia/Từ chối

**Kịch bản gửi RSVP:**
- **Given** trang thiệp mời hiển thị nút Tham gia và Từ chối
- **When** tôi chọn một trong hai
- **Then** hệ thống gửi phản hồi lên backend và hiển thị trạng thái hiện tại của tôi

**Kịch bản lỗi kết nối:**
- **Given** mất kết nối tạm thời
- **When** tôi bấm gửi
- **Then** hệ thống thông báo lỗi nhẹ và cho phép thử lại

---

### GUEST-03 — Nhận xác nhận phản hồi

**Kịch bản xác nhận:**
- **Given** tôi vừa gửi RSVP
- **When** cập nhật thành công
- **Then** trang hiển thị thông điệp xác nhận và (nếu cấu hình) gửi email/SMS xác nhận tới số/email của tôi

---

### GUEST-04 — Thay đổi quyết định trước hạn chót

**Kịch bản thay đổi trong hạn:**
- **Given** hạn chót chưa đến
- **When** tôi mở lại trang thiệp mời
- **Then** tôi có thể đổi từ Tham gia ↔ Từ chối và hệ thống ghi lại lần cập nhật mới nhất

**Kịch bản quá hạn chót:**
- **Given** đã quá hạn chót
- **When** tôi mở trang
- **Then** tôi không thể đổi lựa chọn và thấy thông điệp do ban tổ chức thiết lập (ORG-10)

---

### GUEST-05 — Dùng QR để check-in tại cổng

**Kịch bản check-in thành công:**
- **Given** tôi đã nhận QR của mình
- **When** tôi tới sự kiện và đưa QR cho ban tổ chức quét
- **Then** hệ thống ghi nhận check-in và (nếu có) hiển thị lời chào/điểm chỉ vị trí đón tiếp