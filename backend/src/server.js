const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Careers Page Builder Backend API is running!',
    routes: [
      'GET /api/companies/:slug',
      'GET /api/companies/:slug/jobs',
    ],
  });
});

// API Routes
app.use('/api/companies', companyRoutes);

// Also expose direct /companies/:slug routes as alias
app.use('/companies', companyRoutes);

// Error Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📌 Company endpoint: http://localhost:${PORT}/api/companies/workable`);
  console.log(`📌 Jobs endpoint: http://localhost:${PORT}/api/companies/workable/jobs`);
});
