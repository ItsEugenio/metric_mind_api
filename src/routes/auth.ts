import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateSchema, schemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  registerLimiter,
  validateSchema(schemas.register),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validateSchema(schemas.login),
  authController.login
);

router.get(
  '/profile',
  authenticateToken,
  authController.getProfile
);

router.put(
  '/profile',
  authenticateToken,
  authController.updateProfile
);

router.post(
  '/change-password',
  authenticateToken,
  authController.changePassword
);

export default router;
