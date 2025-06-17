import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class DebtCategoryDataDto {
  @ApiProperty({ example: 'personal' })
  id!: string;

  @ApiProperty({ example: 'Личные' })
  name!: string;
}

export class SyncDebtCategoriesDto {
  @ApiProperty({ type: [DebtCategoryDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DebtCategoryDataDto)
  categories!: DebtCategoryDataDto[];
}
