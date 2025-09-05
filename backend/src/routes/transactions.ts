import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const transactionController = new TransactionController();

router.use(authenticateToken);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/summary', transactionController.getTransactionsSummary);
router.get('/stats/categories', transactionController.getCategoryStats);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;