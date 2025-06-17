import { IsObject, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ClothingParametersDto {
  @ApiProperty({ example: 170, required: false })
  @IsOptional()
  height?: number;

  @ApiProperty({ example: 70, required: false })
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 96, required: false })
  @IsOptional()
  chest?: number;

  @ApiProperty({ example: 80, required: false })
  @IsOptional()
  waist?: number;

  @ApiProperty({ example: 98, required: false })
  @IsOptional()
  hips?: number;

  @ApiProperty({ example: 38, required: false })
  @IsOptional()
  neck?: number;

  @ApiProperty({ example: 26, required: false })
  @IsOptional()
  foot?: number;

  @ApiProperty({ example: 81, required: false })
  @IsOptional()
  inseam?: number;

  @ApiProperty({ example: 17, required: false })
  @IsOptional()
  wrist?: number;

  @ApiProperty({ example: 56, required: false })
  @IsOptional()
  head?: number;
}

class SavedResultDto {
  @ApiProperty({ example: 'outerwear' })
  category!: string;

  @ApiProperty({ example: '2025-01-15T10:30:00Z' })
  date!: string;

  @ApiProperty({ type: ClothingParametersDto })
  @ValidateNested()
  @Type(() => ClothingParametersDto)
  parameters!: ClothingParametersDto;
}

export class SyncClothingDataDto {
  @ApiProperty({ type: ClothingParametersDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ClothingParametersDto)
  parameters!: ClothingParametersDto;

  @ApiProperty({ type: [SavedResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SavedResultDto)
  savedResults!: SavedResultDto[];

  @ApiProperty({ example: 'male' })
  @IsString()
  currentGender!: string;
}
