import express from 'express';
import { 
  registerCompany, 
  getCompanyByAdminCode, 
  getAllCompanies, 
  getCompanyById,
  updateCompany
} from '../controllers/companyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import portalAdminMiddleware from '../middlewares/portalAdminMiddleware.js';

const router = express.Router();

// Portal admin: get all companies
router.get('/portal', portalAdminMiddleware, getAllCompanies);
// Portal admin: update company
router.put('/:id', portalAdminMiddleware, updateCompany);

// Register a new company (requires portal admin authentication)
router.post('/register', portalAdminMiddleware, registerCompany);

// Get company by admin code (no auth required)
router.get('/admin-code/:adminCode', getCompanyByAdminCode);

// Get all companies (admin only)
router.get('/all', authMiddleware, getAllCompanies);

// Get company by ID (admin only)
router.get('/:id', authMiddleware, getCompanyById);

export default router; 