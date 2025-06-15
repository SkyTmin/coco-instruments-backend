import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SheetType } from '@database/entities/sheet.entity';
import { Transform } from 'class-transformer';

export class CreateSheetDto {
  @ApiProperty({ example: 'Зарплата за январь' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 50000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  amount!: number;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: 'Дополнительная информация', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @ApiProperty({ enum: SheetType, example: SheetType.INCOME })
  @IsEnum(SheetType)
  type!: SheetType;
}
