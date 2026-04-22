const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes       = require('./routes/auth');
const classRoutes      = require('./routes/classes');
const attendanceRoutes = require('./routes/attendance');
const reportRoutes     = require('./routes/reports');

const app = express();

// Allow ALL origins — fixes every CORS issue
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

app.use('/api/auth',       authRoutes);
app.use('/api/classes',    classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports',    reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Attendance API running', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({ message: 'AttendX API — use /api/health to check status' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_attendance')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB failed:', err.message); process.exit(1); });

module.exports = app;
