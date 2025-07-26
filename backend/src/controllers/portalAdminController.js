import PortalAdmin from '../models/PortalAdmin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Portal Admin Login
export const portalAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find portal admin
    const portalAdmin = await PortalAdmin.findOne({ email, isActive: true });
    if (!portalAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, portalAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        portalAdminId: portalAdmin._id,
        email: portalAdmin.email,
        role: 'portal_admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Portal admin login successful',
      data: {
        token,
        portalAdmin: {
          id: portalAdmin._id,
          name: portalAdmin.name,
          email: portalAdmin.email
        }
      }
    });
  } catch (error) {
    console.error('Portal admin login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get portal admin profile
export const getPortalAdminProfile = async (req, res) => {
  try {
    const portalAdmin = await PortalAdmin.findById(req.portalAdmin.portalAdminId)
      .select('-password');
    
    if (!portalAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Portal admin not found'
      });
    }

    res.json({
      success: true,
      data: portalAdmin
    });
  } catch (error) {
    console.error('Get portal admin profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Initialize portal admin (run once to create the first portal admin)
export const initializePortalAdmin = async (req, res) => {
  try {
    // Check if portal admin already exists
    const existingAdmin = await PortalAdmin.findOne();
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Portal admin already exists'
      });
    }

    const { name, email, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create portal admin
    const portalAdmin = await PortalAdmin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'Portal admin initialized successfully',
      data: {
        id: portalAdmin._id,
        name: portalAdmin.name,
        email: portalAdmin.email
      }
    });
  } catch (error) {
    console.error('Initialize portal admin error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 