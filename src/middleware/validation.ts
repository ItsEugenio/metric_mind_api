import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ResponseUtils } from '../utils/response';

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      ResponseUtils.badRequest(res, 'Datos de entrada inválidos', errorMessage);
      return;
    }
    
    next();
  };
};

export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
    password: Joi.string().required().messages({
      'any.required': 'La contraseña es requerida'
    })
  }),

  createHabit: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      'string.min': 'El título es requerido',
      'string.max': 'El título no puede exceder 255 caracteres',
      'any.required': 'El título es requerido'
    }),
    description: Joi.string().max(1000).optional().messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
    frequency: Joi.string().valid('daily', 'weekly', 'monthly').required().messages({
      'any.only': 'La frecuencia debe ser daily, weekly o monthly',
      'any.required': 'La frecuencia es requerida'
    })
  }),

  updateHabit: Joi.object({
    title: Joi.string().min(1).max(255).optional().messages({
      'string.min': 'El título no puede estar vacío',
      'string.max': 'El título no puede exceder 255 caracteres'
    }),
    description: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
    frequency: Joi.string().valid('daily', 'weekly', 'monthly').optional().messages({
      'any.only': 'La frecuencia debe ser daily, weekly o monthly'
    }),
    isActive: Joi.boolean().optional()
  }),

  createHabitEntry: Joi.object({
    habitId: Joi.number().integer().positive().required().messages({
      'number.positive': 'El ID del hábito debe ser un número positivo',
      'any.required': 'El ID del hábito es requerido'
    }),
    date: Joi.date().required().messages({
      'any.required': 'La fecha es requerida'
    }),
    completed: Joi.boolean().required().messages({
      'any.required': 'El estado de completado es requerido'
    }),
    notes: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Las notas no pueden exceder 1000 caracteres'
    })
  }),

  createHealthMetric: Joi.object({
    type: Joi.string()
      .valid('weight', 'blood_pressure', 'heart_rate', 'sleep_hours', 'water_intake', 'steps')
      .required()
      .messages({
        'any.only': 'El tipo debe ser uno de: weight, blood_pressure, heart_rate, sleep_hours, water_intake, steps',
        'any.required': 'El tipo es requerido'
      }),
    value: Joi.number().positive().required().messages({
      'number.positive': 'El valor debe ser un número positivo',
      'any.required': 'El valor es requerido'
    }),
    unit: Joi.string().min(1).max(50).required().messages({
      'string.min': 'La unidad es requerida',
      'string.max': 'La unidad no puede exceder 50 caracteres',
      'any.required': 'La unidad es requerida'
    }),
    date: Joi.date().required().messages({
      'any.required': 'La fecha es requerida'
    }),
    notes: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Las notas no pueden exceder 1000 caracteres'
    })
  })
};
