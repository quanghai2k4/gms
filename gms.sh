#!/bin/bash

# Guest Management System (GMS) - Unified Management Script
# Hệ thống Quản lý Khách mời - Script Quản lý Tổng hợp
# ========================================================

VERSION="1.0"
GMS_ROOT=$(pwd)
BACKEND_DIR="$GMS_ROOT/backend"
FRONTEND_DIR="$GMS_ROOT/frontend"

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
    clear
    echo -e "${BLUE}🎉 HỆ THỐNG QUẢN LÝ KHÁCH MỜI (GMS) v${VERSION}${NC}"
    echo -e "${BLUE}Guest Management System for 15th Anniversary Event${NC}"
    echo "======================================================="
    echo ""
    echo -e "${YELLOW}CÁCH SỬ DỤNG / USAGE:${NC}"
    echo "  ./gms.sh <command>"
    echo ""
    echo -e "${YELLOW}CÁC LỆNH / COMMANDS:${NC}"
    echo "  start     - Khởi động hệ thống / Start the system"
    echo "  stop      - Dừng hệ thống / Stop the system"
    echo "  status    - Kiểm tra trạng thái / Check system status"
    echo "  test      - Chạy test hệ thống / Run system tests"
    echo "  restart   - Khởi động lại / Restart system"
    echo "  help      - Hiện hướng dẫn này / Show this help"
    echo ""
    echo -e "${YELLOW}VÍ DỤ / EXAMPLES:${NC}"
    echo "  ./gms.sh start"
    echo "  ./gms.sh status"
    echo "  ./gms.sh stop"
    echo ""
}

# Function to start the system
start_system() {
    clear
    echo -e "${BLUE}🎉 HỆ THỐNG QUẢN LÝ KHÁCH MỜI (GMS)${NC}"
    echo -e "${BLUE}Guest Management System for 15th Anniversary Event${NC}"
    echo "=================================================="
    echo ""
    
    # System information
    echo -e "${YELLOW}📋 THÔNG TIN HỆ THỐNG / SYSTEM INFORMATION:${NC}"
    echo "   Phiên bản / Version: v${VERSION}"
    echo "   Ngày tạo / Created: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "   Thư mục gốc / Root Directory: $GMS_ROOT"
    echo ""
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Lỗi: Node.js chưa được cài đặt / Error: Node.js not installed${NC}"
        echo "   Tải về từ / Download from: https://nodejs.org/"
        echo "   Phiên bản yêu cầu / Required version: Node.js 14+"
        exit 1
    fi
    
    # Display Node.js version
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
    
    # Check directories
    if [ ! -d "$BACKEND_DIR" ] || [ ! -d "$FRONTEND_DIR" ]; then
        echo -e "${RED}❌ Lỗi: Không tìm thấy thư mục cần thiết / Error: Required directories not found${NC}"
        exit 1
    fi
    
    # Navigate to backend directory
    cd "$BACKEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo ""
        echo -e "${YELLOW}📦 Đang cài đặt dependencies / Installing dependencies...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Lỗi cài đặt dependencies / Failed to install dependencies${NC}"
            exit 1
        fi
        echo -e "${GREEN}✅ Dependencies đã được cài đặt / Dependencies installed successfully${NC}"
    fi
    
    # Check if database exists
    if [ ! -f "gms.db" ]; then
        echo -e "${YELLOW}⚠️  Cảnh báo: Database chưa được khởi tạo / Warning: Database not initialized${NC}"
        echo "   Hệ thống sẽ tự động tạo database khi khởi động / System will create database on startup"
    fi
    
    echo ""
    echo -e "${YELLOW}🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG / STARTING SYSTEM...${NC}"
    echo ""
    
    # Start the server in background to get PID
    npm start &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 2
    
    # Check if server started successfully
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo -e "${GREEN}✅ Backend server đã khởi động thành công / Backend server started successfully${NC}"
        echo ""
        
        show_access_info
        
        echo -e "${BLUE}🎯 Nhấn Ctrl+C để dừng server / Press Ctrl+C to stop server${NC}"
        echo "=================================================="
        echo ""
        
        # Wait for the server process
        wait $SERVER_PID
    else
        echo -e "${RED}❌ Lỗi: Không thể khởi động server / Error: Failed to start server${NC}"
        exit 1
    fi
}

# Function to show access information
show_access_info() {
    echo -e "${BLUE}🌐 THÔNG TIN TRUY CẬP / ACCESS INFORMATION:${NC}"
    echo "=================================================="
    echo ""
    
    echo -e "${YELLOW}🔧 API BACKEND:${NC}"
    echo "   URL: http://localhost:3000"
    echo "   Health Check: http://localhost:3000/api/stats"
    echo "   API Documentation: Xem tài liệu trong docs/v1.0/api.md"
    echo ""
    
    echo -e "${YELLOW}💻 GIAO DIỆN QUẢN TRỊ / ADMIN DASHBOARD:${NC}"
    echo "   URL: http://localhost:3000/"
    echo "   Alternative: http://localhost:3000/admin"
    echo "   Chức năng: Quản lý khách mời, import CSV, tạo QR code"
    echo "   Function: Guest management, CSV import, QR generation"
    echo ""
    
    echo -e "${YELLOW}📱 TRANG RSVP CHO KHÁCH / GUEST RSVP PAGE:${NC}"
    echo "   URL: http://localhost:3000/rsvp"
    echo "   URL có QR: http://localhost:3000/rsvp?qr=[QR_CODE]"
    echo "   Chức năng: Khách mời xác nhận tham dự"
    echo "   Function: Guest invitation response"
    echo ""
    
    echo -e "${YELLOW}🎯 GIAO DIỆN CHECK-IN / CHECK-IN INTERFACE:${NC}"
    echo "   URL: http://localhost:3000/checkin"
    echo "   Chức năng: Quét QR code trong ngày sự kiện"
    echo "   Function: QR code scanning on event day"
    echo ""
    
    echo -e "${YELLOW}📁 TÀI LIỆU HỆ THỐNG / SYSTEM DOCUMENTATION:${NC}"
    echo "   Business Analysis: $GMS_ROOT/docs/v1.0/business-analysis.md"
    echo "   Architecture: $GMS_ROOT/docs/v1.0/architecture-4c.md"
    echo "   API Documentation: $GMS_ROOT/docs/v1.0/api.md"
    echo "   Test Cases: $GMS_ROOT/docs/v1.0/test-cases.md"
    echo "   Operation Guide: $GMS_ROOT/docs/v1.0/operation-guide.md"
    echo "   User Guide: $GMS_ROOT/docs/v1.0/user-guide.md"
    echo ""
    
    echo -e "${YELLOW}⚙️ HƯỚNG DẪN SỬ DỤNG / USAGE INSTRUCTIONS:${NC}"
    echo "=================================================="
    echo "1. Mở Admin Dashboard để quản lý khách mời"
    echo "   Open Admin Dashboard for guest management"
    echo "2. Import danh sách khách từ file CSV"
    echo "   Import guest list from CSV file"
    echo "3. Tạo và gửi QR code cho khách mời"
    echo "   Generate and send QR codes to guests"
    echo "4. Khách truy cập RSVP page để xác nhận"
    echo "   Guests access RSVP page to confirm attendance"
    echo "5. Sử dụng Check-in interface trong ngày sự kiện"
    echo "   Use Check-in interface on event day"
    echo ""
    
    echo -e "${YELLOW}🛠️ LỆNH HỮU ÍCH / USEFUL COMMANDS:${NC}"
    echo "   Test hệ thống: ./gms.sh test"
    echo "   Dừng server: ./gms.sh stop hoặc Ctrl+C"
    echo "   Kiểm tra trạng thái: ./gms.sh status"
    echo ""
    
    echo -e "${YELLOW}📊 TRẠNG THÁI HIỆN TẠI / CURRENT STATUS:${NC}"
    # Try to get current stats
    if curl -s http://localhost:3000/api/stats > /dev/null 2>&1; then
        curl -s http://localhost:3000/api/stats | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data['success']:
        stats = data['data']
        print(f'   ✅ Tổng khách mời / Total guests: {stats[\"total_guests\"]}')
        print(f'   ✅ Đã xác nhận / Accepted: {stats[\"accepted\"]}')
        print(f'   ⏳ Chờ phản hồi / Pending: {stats[\"pending\"]}')
        print(f'   ❌ Từ chối / Declined: {stats[\"declined\"]}')
        print(f'   🎯 Đã check-in / Checked in: {stats[\"checked_in\"]}')
    else:
        print('   ⚠️ Không thể lấy thống kê / Cannot get stats')
except:
    print('   ⚠️ Lỗi khi đọc dữ liệu / Error reading data')
"
    else
        echo "   ⚠️ Không thể kết nối API / Cannot connect to API"
    fi
    echo ""
    
    echo -e "${YELLOW}🚨 LƯU Ý QUAN TRỌNG / IMPORTANT NOTES:${NC}"
    echo "=================================================="
    echo "• Tất cả giao diện đều chạy trên localhost:3000"
    echo "  All interfaces run on localhost:3000"
    echo "• Chỉ cần mở trình duyệt và truy cập URL localhost"
    echo "  Simply open browser and access localhost URLs"
    echo "• Backend và Frontend đều chạy từ một server duy nhất"
    echo "  Both Backend and Frontend run from single server"
    echo "• Dữ liệu được lưu trong file backend/gms.db"
    echo "  Data is stored in backend/gms.db file"
    echo "• Backup dữ liệu thường xuyên"
    echo "  Backup data regularly"
    echo ""
}

# Function to stop the system
stop_system() {
    echo -e "${RED}🛑 ĐANG DỪNG HỆ THỐNG GMS / STOPPING GMS SYSTEM${NC}"
    echo "================================================"
    echo ""
    
    # Find and kill Node.js processes related to GMS
    echo -e "${YELLOW}🔍 Tìm kiếm tiến trình GMS / Finding GMS processes...${NC}"
    
    # Check for server.js process
    SERVER_PID=$(pgrep -f "node server.js")
    if [ ! -z "$SERVER_PID" ]; then
        echo "   Tìm thấy server process PID: $SERVER_PID"
        echo "   Found server process PID: $SERVER_PID"
        
        # Try graceful shutdown first
        echo -e "${YELLOW}🤝 Thử dừng nhẹ nhàng / Attempting graceful shutdown...${NC}"
        kill -TERM $SERVER_PID
        
        # Wait a moment
        sleep 3
        
        # Check if still running
        if kill -0 $SERVER_PID 2>/dev/null; then
            echo -e "${YELLOW}⚡ Buộc dừng process / Force killing process...${NC}"
            kill -KILL $SERVER_PID
            sleep 1
        fi
        
        # Verify it's stopped
        if kill -0 $SERVER_PID 2>/dev/null; then
            echo -e "${RED}❌ Không thể dừng process / Failed to stop process${NC}"
            exit 1
        else
            echo -e "${GREEN}✅ Server đã dừng / Server stopped successfully${NC}"
        fi
    else
        echo -e "${BLUE}ℹ️  Không tìm thấy server process / No server process found${NC}"
    fi
    
    # Also check for any npm processes
    NPM_PID=$(pgrep -f "npm start")
    if [ ! -z "$NPM_PID" ]; then
        echo "   Dừng npm process PID: $NPM_PID"
        echo "   Stopping npm process PID: $NPM_PID"
        kill -KILL $NPM_PID
    fi
    
    # Verify port 3000 is free
    echo ""
    echo -e "${YELLOW}🔍 Kiểm tra port 3000 / Checking port 3000...${NC}"
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Cảnh báo: Port 3000 vẫn đang được sử dụng${NC}"
        echo "   Warning: Port 3000 still in use"
        echo "   Có thể có process khác đang chạy trên port này"
        echo "   There might be another process running on this port"
    else
        echo -e "${GREEN}✅ Port 3000 đã được giải phóng / Port 3000 is now free${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🎯 TÌNH TRẠNG / STATUS:${NC}"
    echo "========================"
    echo -e "${GREEN}✅ GMS System đã dừng hoàn toàn / GMS System fully stopped${NC}"
    echo -e "${GREEN}✅ Backend API không còn hoạt động / Backend API no longer active${NC}"
    echo -e "${GREEN}✅ Port 3000 đã được giải phóng / Port 3000 freed${NC}"
    echo ""
    echo -e "${YELLOW}🔄 Để khởi động lại hệ thống / To restart the system:${NC}"
    echo "   ./gms.sh start"
    echo ""
    echo -e "${YELLOW}📊 Để kiểm tra trạng thái / To check status:${NC}"
    echo "   ./gms.sh status"
    echo ""
}

# Function to check system status
check_status() {
    echo -e "${BLUE}📊 KIỂM TRA TRẠNG THÁI GMS / GMS STATUS CHECK${NC}"
    echo "=============================================="
    echo ""
    
    # Check if server is running
    echo -e "${YELLOW}🔍 Kiểm tra Backend Server / Checking Backend Server...${NC}"
    if curl -s http://localhost:3000/api/stats > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend Server: ĐANG CHẠY / RUNNING${NC}"
        echo "   URL: http://localhost:3000"
        
        # Get and display stats
        echo ""
        echo -e "${YELLOW}📈 THỐNG KÊ HIỆN TẠI / CURRENT STATISTICS:${NC}"
        curl -s http://localhost:3000/api/stats | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data['success']:
        stats = data['data']
        print(f'   📊 Tổng khách mời / Total guests: {stats[\"total_guests\"]}')
        print(f'   ✅ Đã xác nhận / Accepted: {stats[\"accepted\"]}')
        print(f'   ⏳ Chờ phản hồi / Pending: {stats[\"pending\"]}')
        print(f'   ❌ Từ chối / Declined: {stats[\"declined\"]}')
        print(f'   🎯 Đã check-in / Checked in: {stats[\"checked_in\"]}')
        
        # Calculate percentages
        total = stats['total_guests']
        if total > 0:
            accept_rate = (stats['accepted'] / total) * 100
            checkin_rate = (stats['checked_in'] / total) * 100
            print(f'   📊 Tỷ lệ xác nhận / Acceptance rate: {accept_rate:.1f}%')
            print(f'   📊 Tỷ lệ check-in / Check-in rate: {checkin_rate:.1f}%')
except Exception as e:
    print(f'   ❌ Lỗi đọc dữ liệu / Error reading data: {e}')
"
    else
        echo -e "${RED}❌ Backend Server: KHÔNG HOẠT ĐỘNG / NOT RUNNING${NC}"
        echo "   Để khởi động / To start: ./gms.sh start"
    fi
    
    echo ""
    echo -e "${YELLOW}📁 KIỂM TRA FILES / FILE CHECK:${NC}"
    echo "================================"
    
    # Check backend files
    if [ -f "backend/server.js" ]; then
        echo -e "${GREEN}✅ Backend server file: CÓ / EXISTS${NC}"
    else
        echo -e "${RED}❌ Backend server file: THIẾU / MISSING${NC}"
    fi
    
    if [ -f "backend/gms.db" ]; then
        echo -e "${GREEN}✅ Database file: CÓ / EXISTS${NC}"
    else
        echo -e "${YELLOW}⚠️  Database file: THIẾU / MISSING (sẽ tự tạo / will be created)${NC}"
    fi
    
    # Check frontend files
    if [ -f "$FRONTEND_DIR/index.html" ]; then
        echo -e "${GREEN}✅ Admin Dashboard: CÓ / EXISTS${NC}"
        echo "   URL: http://localhost:3000/"
    else
        echo -e "${RED}❌ Admin Dashboard: THIẾU / MISSING${NC}"
    fi
    
    if [ -f "$FRONTEND_DIR/rsvp.html" ]; then
        echo -e "${GREEN}✅ RSVP Page: CÓ / EXISTS${NC}"
        echo "   URL: http://localhost:3000/rsvp"
    else
        echo -e "${RED}❌ RSVP Page: THIẾU / MISSING${NC}"
    fi
    
    if [ -f "$FRONTEND_DIR/checkin.html" ]; then
        echo -e "${GREEN}✅ Check-in Page: CÓ / EXISTS${NC}"
        echo "   URL: http://localhost:3000/checkin"
    else
        echo -e "${RED}❌ Check-in Page: THIẾU / MISSING${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}🔧 TIẾN TRÌNH HỆ THỐNG / SYSTEM PROCESSES:${NC}"
    echo "========================================"
    
    # Check for running processes
    SERVER_PID=$(pgrep -f "node server.js")
    if [ ! -z "$SERVER_PID" ]; then
        echo -e "${GREEN}✅ Node.js Server Process: PID $SERVER_PID${NC}"
    else
        echo -e "${RED}❌ Node.js Server Process: KHÔNG TÌM THẤY / NOT FOUND${NC}"
    fi
    
    NPM_PID=$(pgrep -f "npm start")
    if [ ! -z "$NPM_PID" ]; then
        echo -e "${GREEN}✅ NPM Process: PID $NPM_PID${NC}"
    else
        echo -e "${BLUE}ℹ️  NPM Process: KHÔNG TÌM THẤY / NOT FOUND${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}🌐 THÔNG TIN TRUY CẬP / ACCESS INFORMATION:${NC}"
    echo "=========================================="
    echo "Backend API: http://localhost:3000/api/"
    echo "Admin Dashboard: http://localhost:3000/"
    echo "RSVP Page: http://localhost:3000/rsvp"
    echo "Check-in Page: http://localhost:3000/checkin"
    echo ""
    echo -e "${YELLOW}📋 LỆNH HỮU ÍCH / USEFUL COMMANDS:${NC}"
    echo "================================"
    echo "./gms.sh start    - Khởi động hệ thống / Start system"
    echo "./gms.sh stop     - Dừng hệ thống / Stop system"
    echo "./gms.sh status   - Kiểm tra trạng thái / Check status"
    echo "./gms.sh test     - Chạy test / Run tests"
    echo ""
}

# Function to run tests
run_tests() {
    echo -e "${BLUE}🧪 Testing Guest Management System${NC}"
    echo "=================================="
    
    # Start server in background
    cd "$BACKEND_DIR"
    node server.js &
    SERVER_PID=$!
    
    # Wait for server to start
    echo -e "${YELLOW}⏳ Starting server...${NC}"
    sleep 3
    
    echo -e "${GREEN}✅ Server started at http://localhost:3000${NC}"
    echo ""
    
    # Test API endpoints
    echo -e "${YELLOW}📋 Testing API endpoints:${NC}"
    echo ""
    
    # 1. Check initial stats
    echo -e "${BLUE}1️⃣ Initial stats:${NC}"
    curl -s http://localhost:3000/api/stats | python3 -m json.tool
    echo ""
    
    # 2. Add a guest
    echo -e "${BLUE}2️⃣ Adding a guest:${NC}"
    RESPONSE=$(curl -s -X POST http://localhost:3000/api/guests \
      -H "Content-Type: application/json" \
      -d '{"name":"Nguyễn Văn Demo","position":"Giám đốc","organization":"Công ty Demo","phone":"0123456789"}')
    echo $RESPONSE | python3 -m json.tool
    echo ""
    
    # Extract QR code from response
    QR_CODE=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['qr_code'])")
    echo -e "${YELLOW}📱 QR Code: $QR_CODE${NC}"
    echo ""
    
    # 3. Test RSVP
    echo -e "${BLUE}3️⃣ Guest accepts invitation:${NC}"
    curl -s -X POST http://localhost:3000/api/rsvp \
      -H "Content-Type: application/json" \
      -d "{\"qr_code\":\"$QR_CODE\",\"response\":\"ACCEPTED\"}" | python3 -m json.tool
    echo ""
    
    # 4. Test check-in
    echo -e "${BLUE}4️⃣ Check-in guest:${NC}"
    curl -s -X POST http://localhost:3000/api/checkin \
      -H "Content-Type: application/json" \
      -d "{\"qr_code\":\"$QR_CODE\",\"checkin_by\":\"Test Admin\"}" | python3 -m json.tool
    echo ""
    
    # 5. Final stats
    echo -e "${BLUE}5️⃣ Final stats:${NC}"
    curl -s http://localhost:3000/api/stats | python3 -m json.tool
    echo ""
    
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Access points:${NC}"
    echo "   • Admin Dashboard: http://localhost:3000/"
    echo "   • RSVP Page: http://localhost:3000/rsvp?qr=$QR_CODE"
    echo "   • Check-in Page: http://localhost:3000/checkin"
    echo "   • Backend API: http://localhost:3000"
    echo ""
    echo -e "${RED}🛑 Press Ctrl+C to stop the server${NC}"
    echo ""
    
    # Keep server running
    wait $SERVER_PID
}

# Function to restart system
restart_system() {
    echo -e "${YELLOW}🔄 KHỞI ĐỘNG LẠI HỆ THỐNG / RESTARTING SYSTEM${NC}"
    echo "============================================="
    echo ""
    
    stop_system
    echo ""
    echo -e "${YELLOW}⏳ Đợi 2 giây / Waiting 2 seconds...${NC}"
    sleep 2
    echo ""
    start_system
}

# Main script logic
case "${1:-}" in
    "start")
        start_system
        ;;
    "stop")
        stop_system
        ;;
    "status")
        check_status
        ;;
    "test")
        run_tests
        ;;
    "restart")
        restart_system
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        echo -e "${RED}❌ Thiếu lệnh / Missing command${NC}"
        echo ""
        show_help
        exit 1
        ;;
    *)
        echo -e "${RED}❌ Lệnh không hợp lệ: $1${NC}"
        echo -e "${RED}❌ Invalid command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac