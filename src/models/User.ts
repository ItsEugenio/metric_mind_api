import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @Column({ length: 255 })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @Column({ length: 255 })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Habit', 'user')
  habits: any[];

  @OneToMany('HealthMetric', 'user')
  healthMetrics: any[];
}
