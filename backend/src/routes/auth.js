import express from 'express';
import { register, login, getMe, getAllUsers, updateProfile, updateRole, verifyOtp, forgotPassword, resetPassword, getSkills, updateSkills } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import passport from '../config/passport.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    console.log('OAuth callback - User:', req.user ? req.user.email : 'No user');
    console.log('OAuth callback - Session:', req.session ? 'Session exists' : 'No session');
    
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? `${process.env.CLIENT_URL}/profile`
      : 'http://localhost:5173/profile';
    
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }
);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.get('/users', authMiddleware, getAllUsers);
router.put('/update-profile', authMiddleware, updateProfile);
router.put('/update-role', authMiddleware, updateRole);
router.get('/skills', authMiddleware, getSkills);
router.put('/skills', authMiddleware, updateSkills);

export default router;