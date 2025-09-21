#!/bin/bash

# Guest Management System (GMS) - Start Script
# Hệ thống Quản lý Khách mời cho Lễ Kỷ niệm 15 năm
# ================================================

clear
echo "🎉 HỆ THỐNG QUẢN LÝ KHÁCH MỜI (GMS)"
echo "Guest Management System for 15th Anniversary Event"
echo "=================================================="
echo ""

# Get current directory and set paths
GMS_ROOT=$(pwd)
BACKEND_DIR="$GMS_ROOT/backend"
FRONTEND_DIR="$GMS_ROOT/frontend"

# System information
echo "📋 THÔNG TIN HỆ THỐNG / SYSTEM INFORMATION:"
echo "   Phiên bản / Version: v1.0"
echo "   Ngày tạo / Created: $(date '+%Y-%m-%d %H:%M:%S')"
echo "   Thư mục gốc / Root Directory: $GMS_ROOT"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Lỗi: Node.js chưa được cài đặt / Error: Node.js not installed"
    echo "   Tải về từ / Download from: https://nodejs.org/"
    echo "   Phiên bản yêu cầu / Required version: Node.js 14+"
    exit 1
fi

# Display Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Lỗi: Không tìm thấy thư mục backend / Error: Backend directory not found"
    exit 1
fi

# Check if frontend directory exists  
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Lỗi: Không tìm thấy thư mục frontend / Error: Frontend directory not found"
    exit 1
fi

# Navigate to backend directory
cd "$BACKEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Đang cài đặt dependencies / Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi cài đặt dependencies / Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies đã được cài đặt / Dependencies installed successfully"
fi

# Check if database exists
if [ ! -f "gms.db" ]; then
    echo "⚠️  Cảnh báo: Database chưa được khởi tạo / Warning: Database not initialized"
    echo "   Hệ thống sẽ tự động tạo database khi khởi động / System will create database on startup"
fi

echo ""
echo "🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG / STARTING SYSTEM..."
echo ""

# Start the server in background to get PID
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Check if server started successfully
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Backend server đã khởi động thành công / Backend server started successfully"
    echo ""
    
    # Display complete access information
    echo "🌐 THÔNG TIN TRUY CẬP / ACCESS INFORMATION:"
    echo "=================================================="
    echo ""
    
    echo "🔧 API BACKEND:"
    echo "   URL: http://localhost:3000"
    echo "   Health Check: http://localhost:3000/api/stats"
    echo "   API Documentation: Xem tài liệu trong docs/v1.0/api.md"
    echo ""
    
    echo "💻 GIAO DIỆN QUẢN TRỊ / ADMIN DASHBOARD:"
    echo "   URL: http://localhost:3000/"
    echo "   Alternative: http://localhost:3000/admin"
    echo "   Chức năng: Quản lý khách mời, import CSV, tạo QR code"
    echo "   Function: Guest management, CSV import, QR generation"
    echo ""
    
    echo "📱 TRANG RSVP CHO KHÁCH / GUEST RSVP PAGE:"
    echo "   URL: http://localhost:3000/rsvp"
    echo "   URL có QR: http://localhost:3000/rsvp?qr=[QR_CODE]"
    echo "   Chức năng: Khách mời xác nhận tham dự"
    echo "   Function: Guest invitation response"
    echo ""
    
    echo "🎯 GIAO DIỆN CHECK-IN / CHECK-IN INTERFACE:"
    echo "   URL: http://localhost:3000/checkin"
    echo "   Chức năng: Quét QR code trong ngày sự kiện"
    echo "   Function: QR code scanning on event day"
    echo ""
    
    echo "📁 TÀI LIỆU HỆ THỐNG / SYSTEM DOCUMENTATION:"
    echo "   Business Analysis: $GMS_ROOT/docs/v1.0/business-analysis.md"
    echo "   Architecture: $GMS_ROOT/docs/v1.0/architecture-4c.md"
    echo "   API Documentation: $GMS_ROOT/docs/v1.0/api.md"
    echo "   Test Cases: $GMS_ROOT/docs/v1.0/test-cases.md"
    echo "   Operation Guide: $GMS_ROOT/docs/v1.0/operation-guide.md"
    echo "   User Guide: $GMS_ROOT/docs/v1.0/user-guide.md"
    echo ""
    
    echo "⚙️ HƯỚNG DẪN SỬ DỤNG / USAGE INSTRUCTIONS:"
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
    
    echo "🛠️ LỆNH HỮU ÍCH / USEFUL COMMANDS:"
    echo "   Test hệ thống: ./test.sh"
    echo "   Dừng server: Ctrl+C hoặc pkill -f 'node server.js'"
    echo "   Xem log: tail -f backend/logs/app.log (nếu có)"
    echo ""
    
    echo "📊 TRẠNG THÁI HIỆN TẠI / CURRENT STATUS:"
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
    
    echo "🚨 LƯU Ý QUAN TRỌNG / IMPORTANT NOTES:"
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
    
    echo "🎯 Nhấn Ctrl+C để dừng server / Press Ctrl+C to stop server"
    echo "=================================================="
    echo ""
    
    # Wait for the server process
    wait $SERVER_PID
else
    echo "❌ Lỗi: Không thể khởi động server / Error: Failed to start server"
    exit 1
fi