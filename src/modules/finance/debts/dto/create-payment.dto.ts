import { IsNumber, IsDateString, IsOptional, IsBoolean, IsString, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ example: 25000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  amount!: number;

  @ApiProperty({ example: '2024-02-01', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 'Платеж за февраль', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  preliminary!: boolean;
}
