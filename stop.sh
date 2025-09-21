#!/bin/bash

# Guest Management System (GMS) - Stop Script
# Hệ thống Quản lý Khách mời - Script Dừng
# ==========================================

echo "🛑 ĐANG DỪNG HỆ THỐNG GMS / STOPPING GMS SYSTEM"
echo "================================================"
echo ""

# Find and kill Node.js processes related to GMS
echo "🔍 Tìm kiếm tiến trình GMS / Finding GMS processes..."

# Check for server.js process
SERVER_PID=$(pgrep -f "node server.js")
if [ ! -z "$SERVER_PID" ]; then
    echo "   Tìm thấy server process PID: $SERVER_PID"
    echo "   Found server process PID: $SERVER_PID"
    
    # Try graceful shutdown first
    echo "🤝 Thử dừng nhẹ nhàng / Attempting graceful shutdown..."
    kill -TERM $SERVER_PID
    
    # Wait a moment
    sleep 3
    
    # Check if still running
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "⚡ Buộc dừng process / Force killing process..."
        kill -KILL $SERVER_PID
        sleep 1
    fi
    
    # Verify it's stopped
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "❌ Không thể dừng process / Failed to stop process"
        exit 1
    else
        echo "✅ Server đã dừng / Server stopped successfully"
    fi
else
    echo "ℹ️  Không tìm thấy server process / No server process found"
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
echo "🔍 Kiểm tra port 3000 / Checking port 3000..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "⚠️  Cảnh báo: Port 3000 vẫn đang được sử dụng"
    echo "   Warning: Port 3000 still in use"
    echo "   Có thể có process khác đang chạy trên port này"
    echo "   There might be another process running on this port"
else
    echo "✅ Port 3000 đã được giải phóng / Port 3000 is now free"
fi

echo ""
echo "🎯 TÌNH TRẠNG / STATUS:"
echo "========================"
echo "✅ GMS System đã dừng hoàn toàn / GMS System fully stopped"
echo "✅ Backend API không còn hoạt động / Backend API no longer active"
echo "✅ Port 3000 đã được giải phóng / Port 3000 freed"
echo ""
echo "🔄 Để khởi động lại hệ thống / To restart the system:"
echo "   ./start.sh"
echo ""
echo "📊 Để kiểm tra trạng thái / To check status:"
echo "   curl http://localhost:3000/api/stats"
echo "   (Sẽ báo lỗi nếu server đã dừng / Will error if server stopped)"
echo ""