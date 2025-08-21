import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ResponseUtils } from '../utils/response';
import { CreateUserDto, LoginDto, AuthRequest } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const result = await this.authService.register(userData);

      ResponseUtils.created(res, result, 'Usuario registrado exitosamente');
    } catch (error) {
      console.error('Error en registro:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('ya existe')) {
          ResponseUtils.conflict(res, error.message);
          return;
        }
        if (error.message.includes('contraseña')) {
          ResponseUtils.badRequest(res, error.message);
          return;
        }
      }
      
      ResponseUtils.error(res, 'Error interno al registrar usuario');
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const result = await this.authService.login(loginData);

      ResponseUtils.success(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error instanceof Error && error.message.includes('Credenciales inválidas')) {
        ResponseUtils.unauthorized(res, 'Credenciales inválidas');
        return;
      }
      
      ResponseUtils.error(res, 'Error interno al iniciar sesión');
    }
  };

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const user = await this.authService.getUserProfile(req.user.userId);
      
      if (!user) {
        ResponseUtils.notFound(res, 'Usuario no encontrado');
        return;
      }

      ResponseUtils.success(res, user, 'Perfil obtenido exitosamente');
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      ResponseUtils.error(res, 'Error interno al obtener el perfil');
    }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const updateData = req.body;
      const updatedUser = await this.authService.updateUserProfile(
        req.user.userId,
        updateData
      );

      ResponseUtils.success(res, updatedUser, 'Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('ya está en uso')) {
          ResponseUtils.conflict(res, error.message);
          return;
        }
        if (error.message.includes('no encontrado')) {
          ResponseUtils.notFound(res, error.message);
          return;
        }
      }
      
      ResponseUtils.error(res, 'Error interno al actualizar el perfil');
    }
  };

  changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        ResponseUtils.badRequest(res, 'La contraseña actual y nueva son requeridas');
        return;
      }

      await this.authService.changePassword(
        req.user.userId,
        oldPassword,
        newPassword
      );

      ResponseUtils.success(res, null, 'Contraseña cambiada exitosamente');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('incorrecta')) {
          ResponseUtils.badRequest(res, error.message);
          return;
        }
        if (error.message.includes('contraseña')) {
          ResponseUtils.badRequest(res, error.message);
          return;
        }
        if (error.message.includes('no encontrado')) {
          ResponseUtils.notFound(res, error.message);
          return;
        }
      }
      
      ResponseUtils.error(res, 'Error interno al cambiar la contraseña');
    }
  };
}
