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
import { IsNotEmpty, IsIn } from 'class-validator';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @Column('text', { nullable: true })
  description: string;

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
  userId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User', 'habits', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @OneToMany('HabitEntry', 'habit')
  entries: any[];
}
