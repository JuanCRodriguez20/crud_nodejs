import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/refresh-token', authenticateToken, authController.refreshToken);

export default router;