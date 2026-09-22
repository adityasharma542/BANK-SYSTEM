const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { initializeDatabase, getStatus } = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and Body Parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/employees', employeeRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Apex Banking Employee Management System API',
    database: getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Start Server and Init Database Pool
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 [BANKING SYSTEM SERVER RUNNING]`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
    console.log(`=======================================================`);
  });
}

startServer();
