const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const Database = require('./database');

const app = express();
const port = 3000;
const db = new Database();

app.use(cors());
app.use(express.json());

// Serve frontend files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

const upload = multer({ dest: 'uploads/' });

app.get('/api/guests', async (req, res) => {
  try {
    const guests = await db.getAllGuests();
    res.json({ success: true, data: guests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/guests', async (req, res) => {
  try {
    const { name, position, organization, phone } = req.body;
    const qrCode = uuidv4();
    
    const guest = await db.createGuest({
      name,
      position,
      organization,
      phone,
      qr_code: qrCode
    });
    
    res.json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/guests/import', upload.single('csvFile'), async (req, res) => {
  try {
    const results = [];
    const errors = [];
    
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (data) => {
        try {
          const qrCode = uuidv4();
          const guest = await db.createGuest({
            name: data.name || data['Họ tên'],
            position: data.position || data['Chức vụ'],
            organization: data.organization || data['Tổ chức'],
            phone: data.phone || data['Số điện thoại'],
            qr_code: qrCode
          });
          results.push(guest);
        } catch (error) {
          errors.push({ row: data, error: error.message });
        }
      })
      .on('end', () => {
        fs.unlinkSync(req.file.path);
        res.json({ 
          success: true, 
          imported: results.length, 
          errors: errors.length,
          data: results 
        });
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/guests/qr/:qrCode', async (req, res) => {
  try {
    const guest = await db.getGuestByQR(req.params.qrCode);
    if (!guest) {
      return res.status(404).json({ success: false, error: 'Guest not found' });
    }
    res.json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/rsvp', async (req, res) => {
  try {
    const { qr_code, response } = req.body;
    const guest = await db.getGuestByQR(qr_code);
    
    if (!guest) {
      return res.status(404).json({ success: false, error: 'Guest not found' });
    }
    
    await db.updateGuestStatus(qr_code, response);
    await db.logRSVP(guest.id, response, req.ip);
    
    res.json({ success: true, message: 'RSVP recorded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/checkin', async (req, res) => {
  try {
    const { qr_code, checkin_by } = req.body;
    const guest = await db.getGuestByQR(qr_code);
    
    if (!guest) {
      return res.status(404).json({ success: false, error: 'Guest not found' });
    }
    
    if (guest.status !== 'ACCEPTED') {
      return res.status(400).json({ 
        success: false, 
        error: 'Guest has not confirmed attendance' 
      });
    }
    
    if (guest.checked_in) {
      return res.status(400).json({ 
        success: false, 
        error: 'Guest already checked in' 
      });
    }
    
    await db.checkinGuest(qr_code);
    await db.logCheckin(guest.id, checkin_by || 'Admin');
    
    res.json({ success: true, message: 'Guest checked in successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/qrcode/:qrCode', async (req, res) => {
  try {
    const qrCodeUrl = `${req.protocol}://${req.get('host')}/rsvp.html?qr=${req.params.qrCode}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);
    res.json({ success: true, qrCode: qrCodeImage, url: qrCodeUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/rsvp', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/rsvp.html'));
});

app.get('/checkin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/checkin.html'));
});

// Legacy direct file access (for backward compatibility)
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/rsvp.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/rsvp.html'));
});

app.get('/checkin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/checkin.html'));
});

app.listen(port, () => {
  console.log(`GMS Backend server running at http://localhost:${port}`);
  console.log(`Frontend available at:`);
  console.log(`  Admin Dashboard: http://localhost:${port}/`);
  console.log(`  RSVP Page: http://localhost:${port}/rsvp`);
  console.log(`  Check-in: http://localhost:${port}/checkin`);
});