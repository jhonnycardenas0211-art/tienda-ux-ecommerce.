import express from 'express';
import { getDashboard, loginAdmin } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/login', loginAdmin);
router.get('/dashboard', verifyToken, getDashboard);

export default router;
