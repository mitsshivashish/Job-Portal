import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import jobRoutes from './src/routes/jobs.js';
import applicationRoutes from './src/routes/application.js';
import companyRoutes from './src/routes/company.js';
import portalAdminRoutes from './src/routes/portalAdmin.js';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import './src/config/passport.js';

// Load environment variables first

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL]
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for Passport OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/portal-admin', portalAdminRoutes);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;