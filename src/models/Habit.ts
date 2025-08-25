import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsIn, IsPositive, IsNumber } from 'class-validator';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  @IsNumber({}, { message: 'El valor objetivo debe ser un número' })
  @IsPositive({ message: 'El valor objetivo debe ser positivo' })
  target_value: number;

  @Column({ length: 50, nullable: true })
  unit: string;

  @Column({
    type: 'enum',
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  })
  @IsIn(['daily', 'weekly', 'monthly'], { 
    message: 'La frecuencia debe ser daily, weekly o monthly' 
  })
  frequency: 'daily' | 'weekly' | 'monthly';

  @Column({ name: 'user_id' })
  @Index()
  user_id: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne('User', 'habits', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @OneToMany('HabitEntry', 'habit')
  entries: any[];
}
