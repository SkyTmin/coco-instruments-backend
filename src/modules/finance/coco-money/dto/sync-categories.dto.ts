import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CategoryDataDto {
  @ApiProperty({ example: 'custom-category-1' })
  id!: string;

  @ApiProperty({ example: 'Медицина' })
  name!: string;
}

export class SyncCategoriesDto {
  @ApiProperty({ type: [CategoryDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDataDto)
  categories!: CategoryDataDto[];
}
