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