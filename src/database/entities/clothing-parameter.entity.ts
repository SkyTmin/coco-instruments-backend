import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  CHILD = 'child',
}

@Entity('clothing_parameters')
@Index(['userId'], { unique: true })
export class ClothingParameter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  chest: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  underbust: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  waist: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hips: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  neck: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  foot: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  inseam: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  wrist: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  head: number;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.clothingParameters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}