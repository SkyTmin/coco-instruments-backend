import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Sheet } from './sheet.entity';
import { Debt } from './debt.entity';
import { ClothingParameter } from './clothing-parameter.entity';
import { ScaleCalculation } from './scale-calculation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Exclude()
  refreshToken!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Sheet, (sheet) => sheet.user)
  sheets!: Sheet[];

  @OneToMany(() => Debt, (debt) => debt.user)
  debts!: Debt[];

  @OneToMany(() => ClothingParameter, (param) => param.user)
  clothingParameters!: ClothingParameter[];

  @OneToMany(() => ScaleCalculation, (calc) => calc.user)
  scaleCalculations!: ScaleCalculation[];
}
