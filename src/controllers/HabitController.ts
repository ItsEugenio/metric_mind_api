import { Response } from 'express';
import { HabitService } from '../services/HabitService';
import { AuthRequest, CreateHabitDto, UpdateHabitDto } from '../types';
import { ResponseUtils } from '../utils/response';

export class HabitController {
  private habitService: HabitService;

  constructor() {
    this.habitService = new HabitService();
  }

  getHabits = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.userId;
      const { active, category } = req.query;

      let habits;
      
      if (active === 'true') {
        habits = await this.habitService.getActiveHabitsByUserId(userId);
      } else if (category && typeof category === 'string') {
        habits = await this.habitService.getHabitsByCategory(userId, category);
      } else {
        habits = await this.habitService.findByUserId(userId);
      }

      return ResponseUtils.success(
        res,
        habits,
        'Hábitos obtenidos exitosamente'
      );
    } catch (error) {
      return ResponseUtils.error(
        res,
        'Error al obtener los hábitos',
        500,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  getHabit = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.userId;
      const habitId = parseInt(req.params.id);

      if (isNaN(habitId)) {
        return ResponseUtils.badRequest(res, 'ID de hábito inválido');
      }

      const habit = await this.habitService.findByIdAndUserId(habitId, userId);

      if (!habit) {
        return ResponseUtils.notFound(res, 'Hábito no encontrado');
      }

      return ResponseUtils.success(
        res,
        habit,
        'Hábito obtenido exitosamente'
      );
    } catch (error) {
      return ResponseUtils.error(
        res,
        'Error al obtener el hábito',
        500,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  createHabit = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.userId;
      const habitData: CreateHabitDto = req.body;

      const habit = await this.habitService.create(userId, habitData);

      return ResponseUtils.created(
        res,
        habit,
        'Hábito creado exitosamente'
      );
    } catch (error) {
      return ResponseUtils.error(
        res,
        'Error al crear el hábito',
        500,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  updateHabit = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.userId;
      const habitId = parseInt(req.params.id);
      const habitData: UpdateHabitDto = req.body;

      if (isNaN(habitId)) {
        return ResponseUtils.badRequest(res, 'ID de hábito inválido');
      }

      const habit = await this.habitService.update(habitId, userId, habitData);

      if (!habit) {
        return ResponseUtils.notFound(res, 'Hábito no encontrado');
      }

      return ResponseUtils.success(
        res,
        habit,
        'Hábito actualizado exitosamente'
      );
    } catch (error) {
      return ResponseUtils.error(
        res,
        'Error al actualizar el hábito',
        500,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  deleteHabit = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.userId;
      const habitId = parseInt(req.params.id);

      if (isNaN(habitId)) {
        return ResponseUtils.badRequest(res, 'ID de hábito inválido');
      }

      const deleted = await this.habitService.delete(habitId, userId);

      if (!deleted) {
        return ResponseUtils.notFound(res, 'Hábito no encontrado');
      }

      return ResponseUtils.success(
        res,
        null,
        'Hábito eliminado exitosamente'
      );
    } catch (error) {
      return ResponseUtils.error(
        res,
        'Error al eliminar el hábito',
        500,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  toggleHabitStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.userId;
      const habitId = parseInt(req.params.id);

      if (isNaN(habitId)) {
        return ResponseUtils.badRequest(res, 'ID de hábito inválido');
      }

      const habit = await this.habitService.toggleHabitStatus(habitId, userId);

      if (!habit) {
        return ResponseUtils.notFound(res, 'Hábito no encontrado');
      }

      return ResponseUtils.success(
        res,
        habit,
        `Hábito ${habit.active ? 'activado' : 'desactivado'} exitosamente`
      );
    } catch (error) {
      return ResponseUtils.error(
        res,
        'Error al cambiar el estado del hábito',
        500,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };
}
