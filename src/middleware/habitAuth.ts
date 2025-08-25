import { Response, NextFunction } from 'express';
import { HabitService } from '../services/HabitService';
import { AuthRequest } from '../types';
import { ResponseUtils } from '../utils/response';

export const verifyHabitOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const habitId = parseInt(req.params.id);

    if (isNaN(habitId)) {
      ResponseUtils.badRequest(res, 'ID de hábito inválido');
      return;
    }

    const habitService = new HabitService();
    const isOwner = await habitService.verifyOwnership(habitId, userId);

    if (!isOwner) {
      ResponseUtils.forbidden(res, 'No tienes permiso para acceder a este hábito');
      return;
    }

    next();
  } catch (error) {
    ResponseUtils.error(
      res,
      'Error al verificar la propiedad del hábito',
      500,
      error instanceof Error ? error.message : 'Error desconocido'
    );
    return;
  }
};
