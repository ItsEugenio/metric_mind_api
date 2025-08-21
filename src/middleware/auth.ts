import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt';
import { ResponseUtils } from '../utils/response';
import { AuthRequest } from '../types';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    ResponseUtils.unauthorized(res, 'Token de acceso requerido');
    return;
  }

  try {
    const decoded = JwtUtils.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    ResponseUtils.unauthorized(res, 'Token inválido o expirado');
    return;
  }
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = JwtUtils.verifyToken(token);
      req.user = decoded;
    } catch (error) {
      req.user = undefined;
    }
  }

  next();
};
