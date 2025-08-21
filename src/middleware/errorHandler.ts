import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (error.name === 'QueryFailedError') {
    ResponseUtils.badRequest(res, 'Error en la consulta de base de datos', error.message);
    return;
  }

  if (error.name === 'EntityNotFoundError') {
    ResponseUtils.notFound(res, 'Recurso no encontrado');
    return;
  }

  if (error.code === 'ER_DUP_ENTRY') {
    ResponseUtils.conflict(res, 'Ya existe un recurso con estos datos');
    return;
  }

  if (error.name === 'JsonWebTokenError') {
    ResponseUtils.unauthorized(res, 'Token inválido');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    ResponseUtils.unauthorized(res, 'Token expirado');
    return;
  }

  if (error.statusCode) {
    ResponseUtils.error(res, error.message, error.statusCode);
    return;
  }

  ResponseUtils.error(res, 'Error interno del servidor');
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseUtils.notFound(res, `Ruta ${req.originalUrl} no encontrada`);
};
