import { Router } from 'express';
import { ExportController } from '../controllers/ExportController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const exportController = new ExportController();

router.use(authenticateToken);

router.get('/transactions', exportController.exportTransactions);
router.get('/summary', exportController.exportSummary);

export default router;