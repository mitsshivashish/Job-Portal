import express from 'express';
import { applyForJob, getUserApplications } from '../controllers/applicationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Set up multer storage (store in /tmp for temp upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// File upload endpoint (Cloudinary)
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.error('No file uploaded:', req.file);
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'job-portal-resumes',
      resource_type: 'auto',
      type: 'upload'
    });
    // Delete local temp file
    fs.unlinkSync(req.file.path);
    // Return Cloudinary URL
    res.json({ success: true, path: result.secure_url });
  } catch (err) {
    // Log detailed error
    console.error('Cloudinary upload failed:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Cloudinary upload failed', error: err.message, stack: err.stack });
  }
});

router.post('/apply', authMiddleware, applyForJob);
router.get('/my-applications', authMiddleware, getUserApplications);

export default router; 