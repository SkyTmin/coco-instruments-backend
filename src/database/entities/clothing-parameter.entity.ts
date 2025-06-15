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
  id!: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender!: Gender;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  chest!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  underbust!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  waist!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hips!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  neck!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  foot!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  inseam!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  wrist!: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  head!: number | null;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.clothingParameters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
