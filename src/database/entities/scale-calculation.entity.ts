import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('scale_calculations')
@Index(['userId', 'createdAt'])
export class ScaleCalculation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'integer' })
  scale!: number;

  @Column({ type: 'decimal', precision: 6, scale: 3 })
  textHeight!: number;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.scaleCalculations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
