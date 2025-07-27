import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const authMiddleware = async (req, res, next) => {
  // Support Passport session-based authentication
  if (req.user) {
    // If req.user is set by Passport, attach userId for downstream handlers
    if (req.user._id) {
      req.user = { userId: req.user._id, ...req.user };
    }
    return next();
  }

  // Try to manually deserialize user from session if Passport didn't do it
  if (req.session && req.session.passport && req.session.passport.user) {
    try {
      const user = await User.findById(req.session.passport.user);
      if (user) {
        req.user = { userId: user._id, ...user };
        return next();
      }
    } catch (err) {
      console.error('Manual deserialization failed:', err);
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