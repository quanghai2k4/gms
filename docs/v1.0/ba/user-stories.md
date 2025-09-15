# Business Analysis - User Stories

## Hệ thống Quản lý Khách mời - Lễ kỷ niệm 15 năm

### Vai trò: Ban Tổ chức

#### User Story 1: Quản lý danh sách khách mời
**Là** Ban tổ chức  
**Tôi muốn** có thể thêm, sửa, xóa thông tin khách mời  
**Để** quản lý danh sách khách mời tham dự sự kiện

**Acceptance Criteria:**
- [x] Có thể thêm khách mời mới với thông tin: họ tên, chức vụ, tổ chức, số điện thoại
- [x] Có thể chỉnh sửa thông tin khách mời đã có
- [x] Có thể xóa khách mời khỏi danh sách
- [x] Hiển thị danh sách tất cả khách mời với khả năng tìm kiếm và lọc
- [x] Validate thông tin đầu vào (số điện thoại hợp lệ, họ tên không rỗng)

#### User Story 2: Import khách mời từ file CSV
**Là** Ban tổ chức  
**Tôi muốn** có thể import danh sách khách mời từ file CSV  
**Để** tiết kiệm thời gian nhập liệu khi có nhiều khách mời

**Acceptance Criteria:**
- [x] Có thể upload file CSV với định dạng chuẩn
- [x] Kiểm tra và validate dữ liệu trong file CSV
- [x] Hiển thị preview dữ liệu trước khi import
- [x] Báo lỗi nếu có dữ liệu không hợp lệ
- [x] Thành công import và hiển thị số lượng record đã import

#### User Story 3: Tạo và gửi mã QR cho khách mời
**Là** Ban tổ chức  
**Tôi muốn** tạo mã QR duy nhất cho mỗi khách mời và gửi thiệp mời  
**Để** khách mời có thể dễ dàng truy cập thông tin sự kiện

**Acceptance Criteria:**
- [x] Tự động tạo mã QR duy nhất cho mỗi khách mời
- [x] Mã QR chứa link dẫn đến trang RSVP của khách mời
- [x] Có thể xem và download mã QR của từng khách mời
- [x] Có thể gửi thiệp mời qua email (nếu có email) hoặc in thiệp
- [x] Theo dõi trạng thái gửi thiệp (đã gửi/chưa gửi)

#### User Story 4: Theo dõi phản hồi RSVP
**Là** Ban tổ chức  
**Tôi muốn** xem được phản hồi tham gia/từ chối của khách mời  
**Để** chuẩn bị tốt cho sự kiện

**Acceptance Criteria:**
- [x] Hiển thị dashboard tổng quan số lượng khách mời đã phản hồi
- [x] Xem chi tiết phản hồi của từng khách mời (Tham gia/Từ chối/Chưa phản hồi)
- [x] Lọc danh sách theo trạng thái phản hồi
- [x] Export danh sách khách mời kèm trạng thái phản hồi
- [x] Cập nhật real-time khi có phản hồi mới

#### User Story 5: Check-in khách mời tại sự kiện
**Là** Ban tổ chức  
**Tôi muốn** quét mã QR của khách mời để check-in tại sự kiện  
**Để** ghi nhận sự tham dự thực tế

**Acceptance Criteria:**
- [x] Có giao diện quét QR code trên mobile/tablet
- [x] Hiển thị thông tin khách mời khi quét QR thành công
- [x] Ghi nhận thời gian check-in
- [x] Ngăn chặn check-in trùng lặp
- [x] Hiển thị danh sách khách mời đã check-in
- [x] Thống kê số lượng khách mời đã check-in theo thời gian thực

### Vai trò: Khách mời

#### User Story 6: Xem thông tin thiệp mời
**Là** Khách mời  
**Tôi muốn** xem thông tin chi tiết về sự kiện khi truy cập link QR  
**Để** hiểu rõ về chương trình và thời gian sự kiện

**Acceptance Criteria:**
- [x] Hiển thị thông tin cá nhân (họ tên, chức vụ, tổ chức)
- [x] Hiển thị thông tin sự kiện (tên sự kiện, thời gian, địa điểm)
- [x] Hiển thị chương trình cơ bản của sự kiện
- [x] Giao diện responsive trên mobile và desktop
- [x] Link QR chỉ hoạt động cho khách mời được mời

#### User Story 7: Phản hồi tham gia sự kiện (RSVP)
**Là** Khách mời  
**Tôi muốn** có thể chọn Tham gia hoặc Từ chối tham gia sự kiện  
**Để** thông báo với ban tổ chức về ý định tham dự

**Acceptance Criteria:**
- [x] Có 2 lựa chọn rõ ràng: "Tham gia" và "Từ chối"
- [x] Có thể thêm ghi chú kèm theo phản hồi (tùy chọn)
- [x] Xác nhận phản hồi trước khi gửi
- [x] Hiển thị thông báo thành công sau khi gửi phản hồi
- [x] Có thể thay đổi phản hồi trong thời gian cho phép
- [x] Tự động cập nhật trạng thái về hệ thống

#### User Story 8: Xem lại phản hồi đã gửi
**Là** Khách mời  
**Tôi muốn** xem lại phản hồi đã gửi trước đó  
**Để** kiểm tra và có thể thay đổi nếu cần

**Acceptance Criteria:**
- [x] Hiển thị trạng thái phản hồi hiện tại
- [x] Hiển thị thời gian đã phản hồi
- [x] Cho phép thay đổi phản hồi (nếu còn trong thời gian cho phép)
- [x] Thông báo nếu đã hết thời gian thay đổi phản hồi
- [x] Lưu lịch sử thay đổi phản hồi