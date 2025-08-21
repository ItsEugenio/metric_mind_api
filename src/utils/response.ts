import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtils {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operación exitosa',
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string = 'Error interno del servidor',
    statusCode: number = 500,
    error?: string
  ): Response<ApiResponse> {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(error && { error }),
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Recurso creado exitosamente'
  ): Response<ApiResponse<T>> {
    return this.success(res, data, message, 201);
  }

  static notFound(
    res: Response,
    message: string = 'Recurso no encontrado'
  ): Response<ApiResponse> {
    return this.error(res, message, 404);
  }

  static badRequest(
    res: Response,
    message: string = 'Solicitud inválida',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 400, error);
  }

  static unauthorized(
    res: Response,
    message: string = 'No autorizado'
  ): Response<ApiResponse> {
    return this.error(res, message, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Acceso prohibido'
  ): Response<ApiResponse> {
    return this.error(res, message, 403);
  }

  static conflict(
    res: Response,
    message: string = 'Conflicto con el estado actual del recurso'
  ): Response<ApiResponse> {
    return this.error(res, message, 409);
  }
}
