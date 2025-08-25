import { AppDataSource } from '../config/database';
import { Repository } from 'typeorm';
import { Habit } from '../models/Habit';
import { CreateHabitDto, UpdateHabitDto } from '../types';

export class HabitService {
  private habitRepository: Repository<Habit>;

  constructor() {
    this.habitRepository = AppDataSource.getRepository(Habit);
  }

  async findByUserId(userId: number): Promise<Habit[]> {
    return await this.habitRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: number): Promise<Habit | null> {
    return await this.habitRepository.findOne({
      where: { id }
    });
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Habit | null> {
    return await this.habitRepository.findOne({
      where: { id, user_id: userId }
    });
  }

  async create(userId: number, habitData: CreateHabitDto): Promise<Habit> {
    const habit = this.habitRepository.create({
      ...habitData,
      user_id: userId
    });

    return await this.habitRepository.save(habit);
  }

  async update(id: number, userId: number, habitData: UpdateHabitDto): Promise<Habit | null> {
    const habit = await this.findByIdAndUserId(id, userId);
    
    if (!habit) {
      return null;
    }

    Object.assign(habit, habitData);
    return await this.habitRepository.save(habit);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.habitRepository.delete({
      id,
      user_id: userId
    });

    return result.affected ? result.affected > 0 : false;
  }

  async verifyOwnership(habitId: number, userId: number): Promise<boolean> {
    const habit = await this.findByIdAndUserId(habitId, userId);
    return habit !== null;
  }

  async getActiveHabitsByUserId(userId: number): Promise<Habit[]> {
    return await this.habitRepository.find({
      where: { 
        user_id: userId,
        active: true 
      },
      order: { created_at: 'DESC' }
    });
  }

  async getHabitsByCategory(userId: number, category: string): Promise<Habit[]> {
    return await this.habitRepository.find({
      where: { 
        user_id: userId,
        category 
      },
      order: { created_at: 'DESC' }
    });
  }

  async toggleHabitStatus(id: number, userId: number): Promise<Habit | null> {
    const habit = await this.findByIdAndUserId(id, userId);
    
    if (!habit) {
      return null;
    }

    habit.active = !habit.active;
    return await this.habitRepository.save(habit);
  }
}
