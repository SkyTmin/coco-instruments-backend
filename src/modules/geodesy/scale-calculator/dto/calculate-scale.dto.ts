mport { IsString, IsNumber, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CalculateScaleDto {
  @ApiProperty({ 
    example: 'scale',
    description: 'Type of input value',
    enum: ['scale', 'height']
  })
  @IsString()
  @IsIn(['scale', 'height'])
  type!: 'scale' | 'height';

  @ApiProperty({ 
    example: 500,
    description: 'Scale value (if type is scale) or text height in mm (if type is height)'
  })
  @IsNumber()
  @Min(0.001)
  @Transform(({ value }) => parseFloat(value))
  value!: number;
}
