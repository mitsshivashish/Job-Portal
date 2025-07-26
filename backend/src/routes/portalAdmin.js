import express from 'express';
import { 
  portalAdminLogin, 
  getPortalAdminProfile, 
  initializePortalAdmin 
} from '../controllers/portalAdminController.js';
import portalAdminMiddleware from '../middlewares/portalAdminMiddleware.js';

const router = express.Router();

// Initialize portal admin (run once only)
router.post('/initialize', initializePortalAdmin);

// Portal admin login
router.post('/login', portalAdminLogin);

// Protected routes
router.get('/profile', portalAdminMiddleware, getPortalAdminProfile);

export default router; 