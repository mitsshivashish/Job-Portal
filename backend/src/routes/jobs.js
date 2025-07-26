import express from 'express';
import { 
  getAllJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob, 
  applyForJob, 
  getJobApplicants, 
  getJobsByUser, 
  getMyPostedJobs, 
  getFeaturedJobs, 
  getRecommendedJobs 
} from '../controllers/jobController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Set up multer storage for logo uploads
const logoStorage = multer.diskStorage({
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
const logoUpload = multer({ storage: logoStorage });

// File upload endpoint for company logo (Cloudinary)
router.post('/upload-logo', logoUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'job-portal-logos',
      resource_type: 'image',
      type: 'upload'
    });
    // Delete local temp file
    fs.unlinkSync(req.file.path);
    // Return Cloudinary URL
    res.json({ success: true, path: result.secure_url });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Cloudinary upload failed', error: err.message });
  }
});

// Public routes
router.get('/', getAllJobs);
router.get('/featured', getFeaturedJobs);

// Protected routes
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);
router.post('/:id/apply', applyForJob);
router.get('/:id/applicants', authMiddleware, getJobApplicants);
router.get('/user/:userId', getJobsByUser);
router.get('/my-posted-jobs', authMiddleware, getMyPostedJobs);
router.get('/recommended', authMiddleware, getRecommendedJobs);

// This must be last to avoid catching other routes
router.get('/:id', getJobById);

export default router;