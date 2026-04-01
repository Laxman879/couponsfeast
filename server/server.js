import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import routes from "./src/routes/index.js";

import { seedAllData } from "./src/utils/seedData.js";
import { seedAdmin } from "./src/controllers/authController.js";

// Load environment variables FIRST
dotenv.config();

// Import GA4 AFTER environment variables are loaded
import ga4Analytics from './src/utils/ga4Analytics.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-id']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

connectDB();

// Load main routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    message: "CouponsFeast API Running",
    version: "1.0.0",
    totalAPIs: 16,
    testEndpoint: "/api/test",
    documentation: "/api/test/status",
    ga4Analytics: process.env.GA4_MEASUREMENT_ID ? 'Enabled' : 'Disabled'
  });
});

// Global error handler with GA4 analytics
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const clientId = req.headers['x-client-id'] || 'server_error';
  ga4Analytics.trackError(
    req.path,
    req.method,
    err.message,
    500,
    clientId
  ).catch(trackErr => console.error('GA4 error tracking failed:', trackErr.message));
  
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log('Connecting to MongoDB Atlas...');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test all APIs: http://localhost:${PORT}/api/test`);
  console.log(`API Status: http://localhost:${PORT}/api/test/status`);
  
  await seedAllData();
  await seedAdmin();
  
  // GA4 status check
  console.log(`GA4 Analytics: ${process.env.GA4_MEASUREMENT_ID ? 'Enabled' : 'Disabled'}`);
  if (process.env.GA4_MEASUREMENT_ID) {
    console.log(`Measurement ID: ${process.env.GA4_MEASUREMENT_ID}`);
  } else {
    console.log('GA4_MEASUREMENT_ID not found in environment variables');
  }
  if (process.env.GA4_API_SECRET) {
    console.log(`API Secret: ${process.env.GA4_API_SECRET.substring(0, 8)}...`);
  } else {
    console.log('GA4_API_SECRET not found in environment variables');
  }
  
  // Track server startup AFTER server is fully initialized
  setTimeout(() => {
    ga4Analytics.trackServerEvent('startup', {
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      timestamp: new Date().toISOString()
    }).catch(err => console.error('GA4 startup tracking failed:', err.message));
  }, 1000);
});
