#!/bin/bash

# Guest Management System (GMS) - Status Check
# Hệ thống Quản lý Khách mời - Kiểm tra Trạng thái
# ===============================================

echo "📊 KIỂM TRA TRẠNG THÁI GMS / GMS STATUS CHECK"
echo "=============================================="
echo ""

# Get current directory
GMS_ROOT=$(pwd)
FRONTEND_DIR="$GMS_ROOT/frontend"

# Check if server is running
echo "🔍 Kiểm tra Backend Server / Checking Backend Server..."
if curl -s http://localhost:3000/api/stats > /dev/null 2>&1; then
    echo "✅ Backend Server: ĐANG CHẠY / RUNNING"
    echo "   URL: http://localhost:3000"
    
    # Get and display stats
    echo ""
    echo "📈 THỐNG KÊ HIỆN TẠI / CURRENT STATISTICS:"
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
    echo "❌ Backend Server: KHÔNG HOẠT ĐỘNG / NOT RUNNING"
    echo "   Để khởi động / To start: ./start.sh"
fi

echo ""
echo "📁 KIỂM TRA FILES / FILE CHECK:"
echo "================================"

# Check backend files
if [ -f "backend/server.js" ]; then
    echo "✅ Backend server file: CÓ / EXISTS"
else
    echo "❌ Backend server file: THIẾU / MISSING"
fi

if [ -f "backend/gms.db" ]; then
    echo "✅ Database file: CÓ / EXISTS"
else
    echo "⚠️  Database file: THIẾU / MISSING (sẽ tự tạo / will be created)"
fi

# Check frontend files
if [ -f "$FRONTEND_DIR/index.html" ]; then
    echo "✅ Admin Dashboard: CÓ / EXISTS"
    echo "   URL: http://localhost:3000/"
else
    echo "❌ Admin Dashboard: THIẾU / MISSING"
fi

if [ -f "$FRONTEND_DIR/rsvp.html" ]; then
    echo "✅ RSVP Page: CÓ / EXISTS"
    echo "   URL: http://localhost:3000/rsvp"
else
    echo "❌ RSVP Page: THIẾU / MISSING"
fi

if [ -f "$FRONTEND_DIR/checkin.html" ]; then
    echo "✅ Check-in Page: CÓ / EXISTS"
    echo "   URL: http://localhost:3000/checkin"
else
    echo "❌ Check-in Page: THIẾU / MISSING"
fi

echo ""
echo "🔧 TIẾN TRÌNH HỆ THỐNG / SYSTEM PROCESSES:"
echo "========================================"

# Check for running processes
SERVER_PID=$(pgrep -f "node server.js")
if [ ! -z "$SERVER_PID" ]; then
    echo "✅ Node.js Server Process: PID $SERVER_PID"
else
    echo "❌ Node.js Server Process: KHÔNG TÌM THẤY / NOT FOUND"
fi

NPM_PID=$(pgrep -f "npm start")
if [ ! -z "$NPM_PID" ]; then
    echo "✅ NPM Process: PID $NPM_PID"
else
    echo "ℹ️  NPM Process: KHÔNG TÌM THẤY / NOT FOUND"
fi

echo ""
echo "🌐 THÔNG TIN TRUY CẬP / ACCESS INFORMATION:"
echo "=========================================="
echo "Backend API: http://localhost:3000/api/"
echo "Admin Dashboard: http://localhost:3000/"
echo "RSVP Page: http://localhost:3000/rsvp"
echo "Check-in Page: http://localhost:3000/checkin"
echo ""
echo "📋 LỆNH HỮU ÍCH / USEFUL COMMANDS:"
echo "================================"
echo "./start.sh    - Khởi động hệ thống / Start system"
echo "./stop.sh     - Dừng hệ thống / Stop system"
echo "./status.sh   - Kiểm tra trạng thái / Check status"
echo "./test.sh     - Chạy test / Run tests"
echo ""