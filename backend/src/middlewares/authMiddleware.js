import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware - req.session:', req.session ? 'Session exists' : 'No session');
  console.log('Auth middleware - req.user:', req.user);
  console.log('Auth middleware - req.sessionID:', req.sessionID);
  console.log('Auth middleware - req.session.passport:', req.session?.passport);
  
  // Support Passport session-based authentication
  if (req.user) {
    console.log('Auth middleware - User found in session');
    // If req.user is set by Passport, attach userId for downstream handlers
    if (req.user._id) {
      req.user = { userId: req.user._id, ...req.user };
      console.log('Auth middleware - User ID attached:', req.user.userId);
    }
    return next();
  }

  // Try to manually deserialize user from session if Passport didn't do it
  if (req.session && req.session.passport && req.session.passport.user) {
    console.log('Auth middleware - Manual deserialization needed');
    try {
      const user = await User.findById(req.session.passport.user);
      if (user) {
        console.log('Auth middleware - Manual deserialization successful');
        req.user = { userId: user._id, ...user };
        return next();
      }
    } catch (err) {
      console.log('Auth middleware - Manual deserialization failed:', err);
    }
  }

  // Otherwise, check for JWT
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

export default authMiddleware;