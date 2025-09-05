import { Router } from 'express';
import authRoutes from './auth';
import transactionRoutes from './transactions';
import categoryRoutes from './categories';
import exportRoutes from './export';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/export', exportRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  });
});

export default router;