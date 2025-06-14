import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DebtStatus } from '@database/entities/debt.entity';
import { Transform } from 'class-transformer';

export class CreateDebtDto {
  @ApiProperty({ example: 'Кредит на машину' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 500000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'bank', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ enum: DebtStatus, example: DebtStatus.ACTIVE })
  @IsEnum(DebtStatus)
  status: DebtStatus;

  @ApiProperty({ example: 'Банк ВТБ, процентная ставка 12%', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}