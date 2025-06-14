import { IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@database/entities/clothing-parameter.entity';
import { Transform } from 'class-transformer';

export class SaveParametersDto {
  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 175, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(50)
  @Max(250)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  height?: number;

  @ApiProperty({ example: 70, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(20)
  @Max(300)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  weight?: number;

  @ApiProperty({ example: 96, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(200)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  chest?: number;

  @ApiProperty({ example: 75, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(200)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  underbust?: number;

  @ApiProperty({ example: 80, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(200)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  waist?: number;

  @ApiProperty({ example: 98, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(200)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  hips?: number;

  @ApiProperty({ example: 38, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(20)
  @Max(80)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  neck?: number;

  @ApiProperty({ example: 26, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(10)
  @Max(50)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  foot?: number;

  @ApiProperty({ example: 81, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(120)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  inseam?: number;

  @ApiProperty({ example: 17, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(10)
  @Max(30)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  wrist?: number;

  @ApiProperty({ example: 56, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(40)
  @Max(70)
  @Transform(({ value }) => value ? parseFloat(value) : null)
  head?: number;
}