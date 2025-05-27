import { Router } from 'express';
import { login, register, authenticateToken, getCurrentUser, logout } from '../controllers/AuthController.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);

export default router;