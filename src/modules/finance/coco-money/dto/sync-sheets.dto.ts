import { IsObject, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SheetExpenseDto {
  @ApiProperty({ example: 'Транспорт' })
  name!: string;

  @ApiProperty({ example: 5000 })
  amount!: number;

  @ApiProperty({ example: 'transport' })
  category!: string;

  @ApiProperty({ example: 'Проездной' })
  note?: string;
}

class SheetDataDto {
  @ApiProperty({ example: '1234567890' })
  id!: string;

  @ApiProperty({ example: 'Зарплата за январь' })
  name!: string;

  @ApiProperty({ example: 50000 })
  amount!: number;

  @ApiProperty({ example: '2025-01-15' })
  date!: string;

  @ApiProperty({ example: 'Основная зарплата' })
  note?: string;

  @ApiProperty({ type: [SheetExpenseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SheetExpenseDto)
  expenses!: SheetExpenseDto[];
}

class SheetsDataDto {
  @ApiProperty({ type: [SheetDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SheetDataDto)
  income!: SheetDataDto[];

  @ApiProperty({ type: [SheetDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SheetDataDto)
  preliminary!: SheetDataDto[];
}

export class SyncSheetsDto {
  @ApiProperty({ type: SheetsDataDto })
  @IsObject()
  @ValidateNested()
  @Type(() => SheetsDataDto)
  sheets!: SheetsDataDto;
}
