import { IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Бензин' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 2500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({ example: 'transport', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ example: 'Заправка на АЗС', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}