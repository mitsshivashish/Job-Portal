import User from '../models/users.js';
import Company from '../models/Company.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// Helper function to extract userId from req.user (handles both JWT and session auth)
const getUserId = (req) => {
  if (req.user && req.user.userId) {
    return req.user.userId; // JWT authentication
  } else if (req.user && req.user._id) {
    return req.user._id; // Session-based authentication (Passport)
  }
  return null;
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, adminCode } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Determine role based on adminCode (company-based)
    let userRole = 'user';
    let companyId = null;
    
    if (adminCode && typeof adminCode === 'string' && adminCode.length === 14) {
      // Check if adminCode matches a company
      const company = await Company.findOne({ adminCode, isActive: true });
      if (company) {
        userRole = 'admin';
        companyId = company._id;
      } else {
        // Fallback to old system for backward compatibility
        if (adminCode === process.env.ADMIN_REGISTRATION_CODE) {
          userRole = 'admin';
        }
      }
    }

    // Create user (unverified)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone,
      otp,
      otpExpiry,
      isVerified: false,
      company: companyId
    });

    // Send OTP via email
    try {
      await sendEmail(
        email,
        'Verify your account - OTP',
        `Your OTP is: ${otp}`,
        `<p>Your OTP is: <b>${otp}</b></p>`
      );
    } catch (emailErr) {
      console.error('Error sending OTP email:', emailErr);
      return res.status(500).json({ success: false, message: 'Failed to send OTP email', error: emailErr.message });
    }

    // Fetch user with populated company for response
    const populatedUser = await User.findById(user._id).select('-password').populate('company');

    res.status(201).json({
      success: true,
      message: 'Registration successful. OTP sent to your email. Please verify to activate your account.',
      data: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        company: populatedUser.company || null,
        phone: populatedUser.phone || '',
        adminCode: populatedUser.adminCode || '',
        isVerified: populatedUser.isVerified,
        createdAt: populatedUser.createdAt,
        updatedAt: populatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// OTP Verification
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified.' });
    }
    if (!user.otp || !user.otpExpiry || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Account verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account not verified. Please check your email for the OTP.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Fetch user with populated company for response
    user = await User.findById(user._id).select('-password').populate('company');

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || null,
        phone: user.phone || '',
        adminCode: user.adminCode || '',
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    // Handle both session-based (Passport) and JWT authentication
    let userId;
    if (req.user && req.user.userId) {
      // JWT authentication
      userId = req.user.userId;
    } else if (req.user && req.user._id) {
      // Session-based authentication (Passport)
      userId = req.user._id;
    } else {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const user = await User.findById(userId).select('-password').populate('company');
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || null,
        phone: user.phone || '',
        adminCode: user.adminCode || '',
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.adminCode !== undefined) {
      user.adminCode = req.body.adminCode;
      if (req.body.adminCode && req.body.adminCode.length === 14) {
        // Check if adminCode matches a company
        const company = await Company.findOne({ adminCode: req.body.adminCode, isActive: true });
        if (company) {
          user.role = 'admin';
          user.company = company._id;
        } else if (req.body.adminCode === process.env.ADMIN_REGISTRATION_CODE) {
          // Fallback to old system
          user.role = 'admin';
        }
      }
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password'
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Fetch user with populated company for response
    const populatedUser = await User.findById(user._id).select('-password').populate('company');

    res.json({
      success: true,
      data: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        company: populatedUser.company || null,
        phone: populatedUser.phone || '',
        adminCode: populatedUser.adminCode || '',
        isVerified: populatedUser.isVerified,
        createdAt: populatedUser.createdAt,
        updatedAt: populatedUser.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user role
export const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update role
    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Respond with success to prevent email enumeration
      return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    }
    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();
    // Send email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
    const html = `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>If you did not request this, please ignore this email.</p>`;
    await sendEmail(email, subject, text, html);
    res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ success: false, message: 'Invalid request.' });
    }
    const user = await User.findOne({ email, resetPasswordToken: token });
    if (!user || !user.resetPasswordExpiry || user.resetPasswordExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Clear reset token and expiry
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, skills: user.skills || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: 'Skills must be an array of strings' });
    }
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.skills = skills;
    await user.save();
    res.json({ success: true, skills: user.skills });
  } catch (error) {
    console.error('Error in updateSkills:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};