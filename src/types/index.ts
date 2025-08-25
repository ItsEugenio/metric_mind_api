import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: number;
  name: string;
  category?: string;
  target_value?: number;
  unit?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  user_id: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface HabitEntry {
  id: number;
  habitId: number;
  date: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

export interface HealthMetric {
  id: number;
  userId: number;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'sleep_hours' | 'water_intake' | 'steps';
  value: number;
  unit: string;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateHabitDto {
  name: string;
  category?: string;
  target_value?: number;
  unit?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface UpdateHabitDto {
  name?: string;
  category?: string;
  target_value?: number;
  unit?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  active?: boolean;
}

export interface CreateHabitEntryDto {
  habitId: number;
  date: Date;
  completed: boolean;
  notes?: string;
}

export interface CreateHealthMetricDto {
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'sleep_hours' | 'water_intake' | 'steps';
  value: number;
  unit: string;
  date: Date;
  notes?: string;
}
