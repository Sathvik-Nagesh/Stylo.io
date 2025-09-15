import express from 'express';
import { getProfile, updateProfile, deleteAccount, getDashboardStats } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/profile', getProfile);
router.get('/dashboard', getDashboardStats);
router.put('/profile', updateProfile);
router.delete('/account', deleteAccount);

export default router;
