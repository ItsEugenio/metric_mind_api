import { Router } from 'express';
import authRoutes from './auth';
import habitRoutes from './habits';

const router = Router();

router.use('/auth', authRoutes);
router.use('/habits', habitRoutes);

router.get('/health-check', (req, res) => {
  res.json({
    success: true,
    message: 'API de Dashboard de Hábitos y Salud funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
