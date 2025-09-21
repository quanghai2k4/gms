# Bài kiểm tra

## Phân tích \> Thiết kế Hệ thống \> Phát triển hệ thống \> Kiểm thử \> Vận hành

### Tình huống:

Công ty A tổ chức Lễ kỷ niệm 15 năm thành lập và cần xây dựng một hệ
thống quản lý khách mời.

### Yêu cầu nghiệp vụ

**Quản lý khách mời**

-   Thông tin: Họ tên, chức vụ, tổ chức (công ty), số điện thoại.\
-   Có thể nhập mới hoặc import từ file CSV.

**Cấp phát QR Code**

-   Mỗi khách mời có một mã QR duy nhất.\
-   Thiệp mời được gửi kèm link dẫn tới QR code.

**Phản hồi (RSVP)**

-   Khi quét QR/link: hiển thị thông tin thiệp mời và chương trình cơ
    bản.\

-   Khách chọn Tham gia hoặc Từ chối.\
-   Hệ thống cập nhật trạng thái phản hồi về backend.


**Check-in sự kiện**

-   Tại buổi lễ, ban tổ chức quét lại QR code để ghi nhận check-in.


------------------------------------------------------------------------

### Quy trình làm việc

Sinh viên thực hiện phân tích -- thiết kế theo các bước sau (không cần
lập trình, chỉ phân tích & thiết kế). Sử dụng 1 Engine Chat LLM bất kỳ
(chatgpt, gemini...) thực hiện thiết kế hệ thống.

#### 1. Business Analysis (BA)

-   Viết User Stories cho các vai trò: Ban tổ chức, Khách mời.\
-   Đưa ra Acceptance Criteria cho từng user story.

#### 2. Thiết kế hệ thống


-   Vẽ ERD (Entity Relationship Diagram) mô tả cấu trúc dữ liệu (dùng
    SQLite).\
-   Vẽ mô hình 4C (Context, Container, Component, Code) để mô tả hệ
    thống.\
-   Đề xuất danh sách API cơ bản (REST): tên API, input, output.
-   Vẽ các mô hình bằng mermaid

**Structure**


    backend/
    docs/v1.0/ba, openai, erd..
    frontend/

#### 3. Phát triển hệ thống

-   Sử dụng AI Dev Agent: cursor/copilot để xây dựng hệ thống trên.\
-   Các bước: Xây dựng checklist \> dev từng hạng mục một \> test hạng
    mục đó và lặp tới checklist tiếp theo.

#### 4. Test hệ thống

-   Sử dụng AI render testcase các backend api.\
-   Sử dụng AI render testcase toàn bộ tính năng.\
-   Test tay toàn bộ tính năng hệ thống viết ra file spreadsheet.


#### 5. Trình bày vận hành hệ thống

Mô tả ngắn gọn quy trình: nhập khách mời → gửi QR → khách phản hồi →
check-in tại sự kiện.

------------------------------------------------------------------------

### Nội dung doc report tiến trình và các tài nguyên liên quan

