import jwt from 'jsonwebtoken';

const portalAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a portal admin token
    if (decoded.role !== 'portal_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Portal admin privileges required.'
      });
    }

    req.portalAdmin = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

export default portalAdminMiddleware; 