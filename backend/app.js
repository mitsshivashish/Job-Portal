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
import MongoStore from 'connect-mongo';
import passport from 'passport';
import './src/config/passport.js';

// Load environment variables first

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, 'https://job-portal-one-orcin.vercel.app']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for Passport OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: true, // Changed to true to ensure session is saved
  saveUninitialized: true, // Changed to true to save uninitialized sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 24 hours in seconds
    autoRemove: 'native' // Use MongoDB's TTL index
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
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

// Session test route
app.get('/api/session-test', (req, res) => {
  console.log('Session test - req.session:', req.session ? 'Session exists' : 'No session');
  console.log('Session test - req.user:', req.user ? 'User exists' : 'No user');
  console.log('Session test - req.sessionID:', req.sessionID);
  
  res.json({ 
    message: 'Session test',
    hasSession: !!req.session,
    hasUser: !!req.user,
    sessionID: req.sessionID,
    user: req.user
  });
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