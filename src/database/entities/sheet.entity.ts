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
import { User } from './user.entity';
import { Expense } from './expense.entity';

export enum SheetType {
  INCOME = 'income',
  PRELIMINARY = 'preliminary',
}

@Entity('sheets')
@Index(['userId', 'type'])
export class Sheet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({
    type: 'enum',
    enum: SheetType,
    default: SheetType.INCOME,
  })
  type!: SheetType;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sheets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Expense, (expense) => expense.sheet, { cascade: true })
  expenses!: Expense[];
}
