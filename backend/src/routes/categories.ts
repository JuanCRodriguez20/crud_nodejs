import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const categoryController = new CategoryController();

router.use(authenticateToken);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;