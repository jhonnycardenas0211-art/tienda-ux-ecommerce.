import express from 'express';
import { capturePayment } from '../controllers/salesController.js';

const router = express.Router();
router.post('/capture-payment', capturePayment);

export default router;
