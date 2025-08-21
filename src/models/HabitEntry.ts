import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { IsNotEmpty, IsBoolean } from 'class-validator';

@Entity('habit_entries')
@Unique(['habitId', 'date'])
export class HabitEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'habit_id' })
  @Index()
  @IsNotEmpty({ message: 'El ID del hábito es requerido' })
  habitId: number;

  @Column({ type: 'date' })
  @Index()
  @IsNotEmpty({ message: 'La fecha es requerida' })
  date: Date;

  @Column({ default: false })
  @IsBoolean({ message: 'El campo completed debe ser un valor booleano' })
  completed: boolean;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('Habit', 'entries', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: any;
}
