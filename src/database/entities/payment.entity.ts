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
import { Debt } from './debt.entity';

@Entity('payments')
@Index(['debtId', 'preliminary'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'date', nullable: true })
  date!: Date | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ type: 'boolean', default: false })
  preliminary!: boolean;

  @Column({ type: 'uuid' })
  debtId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Debt, (debt) => debt.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'debtId' })
  debt!: Debt;
}
