import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class PaymentDataDto {
  @ApiProperty({ example: 'payment-1' })
  id!: string;

  @ApiProperty({ example: 50000 })
  amount!: number;

  @ApiProperty({ example: '2025-01-15' })
  date!: string;

  @ApiProperty({ example: 'Первый платеж' })
  note?: string;

  @ApiProperty({ example: false })
  preliminary!: boolean;
}

class DebtDataDto {
  @ApiProperty({ example: 'debt-1' })
  id!: string;

  @ApiProperty({ example: 'Кредит на машину' })
  name!: string;

  @ApiProperty({ example: 500000 })
  amount!: number;

  @ApiProperty({ example: '2025-01-01' })
  date!: string;

  @ApiProperty({ example: 'personal' })
  category!: string;

  @ApiProperty({ example: 'active' })
  status!: string;

  @ApiProperty({ example: 'Автокредит в банке' })
  note?: string;

  @ApiProperty({ type: [PaymentDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDataDto)
  payments!: PaymentDataDto[];
}

export class SyncDebtsDto {
  @ApiProperty({ type: [DebtDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DebtDataDto)
  debts!: DebtDataDto[];
}
