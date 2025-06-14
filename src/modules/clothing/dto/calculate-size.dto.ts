import { IsString, IsObject, ValidateNested, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CalculationParametersDto {
  @ApiProperty({ example: 96, required: false })
  chest?: number;

  @ApiProperty({ example: 38, required: false })
  neck?: number;

  @ApiProperty({ example: 80, required: false })
  waist?: number;

  @ApiProperty({ example: 81, required: false })
  inseam?: number;

  @ApiProperty({ example: 26, required: false })
  foot?: number;

  @ApiProperty({ example: 75, required: false })
  underbust?: number;
}

export class CalculateSizeDto {
  @ApiProperty({ 
    example: 'outerwear',
    enum: ['outerwear', 'shirts', 'pants', 'shoes', 'underwear']
  })
  @IsString()
  @IsIn(['outerwear', 'shirts', 'pants', 'shoes', 'underwear'])
  category: string;

  @ApiProperty({ type: CalculationParametersDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CalculationParametersDto)
  parameters: CalculationParametersDto;
}