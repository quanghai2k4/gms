#!/bin/bash

echo "🧪 Testing Guest Management System"
echo "=================================="

# Start server in background
cd /home/merrill/workspace/gms/backend
node server.js &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Starting server..."
sleep 3

echo "✅ Server started at http://localhost:3000"
echo ""

# Test API endpoints
echo "📋 Testing API endpoints:"
echo ""

# 1. Check initial stats
echo "1️⃣ Initial stats:"
curl -s http://localhost:3000/api/stats | python3 -m json.tool
echo ""

# 2. Add a guest
echo "2️⃣ Adding a guest:"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/guests \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn Demo","position":"Giám đốc","organization":"Công ty Demo","phone":"0123456789"}')
echo $RESPONSE | python3 -m json.tool
echo ""

# Extract QR code from response
QR_CODE=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['qr_code'])")
echo "📱 QR Code: $QR_CODE"
echo ""

# 3. Test RSVP
echo "3️⃣ Guest accepts invitation:"
curl -s -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d "{\"qr_code\":\"$QR_CODE\",\"response\":\"ACCEPTED\"}" | python3 -m json.tool
echo ""

# 4. Test check-in
echo "4️⃣ Check-in guest:"
curl -s -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d "{\"qr_code\":\"$QR_CODE\",\"checkin_by\":\"Test Admin\"}" | python3 -m json.tool
echo ""

# 5. Final stats
echo "5️⃣ Final stats:"
curl -s http://localhost:3000/api/stats | python3 -m json.tool
echo ""

echo "✅ All tests passed!"
echo ""
echo "🌐 Access points:"
echo "   • Admin Dashboard: Open frontend/index.html in browser"
echo "   • RSVP Page: frontend/rsvp.html?qr=$QR_CODE"
echo "   • Check-in Page: frontend/checkin.html"
echo "   • Backend API: http://localhost:3000"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Keep server running
wait $SERVER_PID