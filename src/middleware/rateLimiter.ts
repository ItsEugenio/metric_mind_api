import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Demasiados registros desde esta IP, intenta de nuevo en una hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Demasiadas operaciones de escritura, intenta de nuevo en un minuto.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
