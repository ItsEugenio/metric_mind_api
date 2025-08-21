import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsIn, IsPositive } from 'class-validator';

@Entity('health_metrics')
export class HealthMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ['weight', 'blood_pressure', 'heart_rate', 'sleep_hours', 'water_intake', 'steps']
  })
  @IsIn(['weight', 'blood_pressure', 'heart_rate', 'sleep_hours', 'water_intake', 'steps'], {
    message: 'El tipo de métrica no es válido'
  })
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'sleep_hours' | 'water_intake' | 'steps';

  @Column('decimal', { precision: 10, scale: 2 })
  @IsPositive({ message: 'El valor debe ser positivo' })
  value: number;

  @Column({ length: 50 })
  @IsNotEmpty({ message: 'La unidad es requerida' })
  unit: string;

  @Column({ type: 'date' })
  @Index()
  @IsNotEmpty({ message: 'La fecha es requerida' })
  date: Date;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('User', 'healthMetrics', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;
}
