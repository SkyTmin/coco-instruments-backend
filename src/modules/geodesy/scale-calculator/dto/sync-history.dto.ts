import { IsArray, ValidateNested, IsNumber, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class HistoryItemDto {
  @ApiProperty({ example: 1642234567890 })
  @IsNumber()
  id!: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  scale!: number;

  @ApiProperty({ example: 1.25 })
  @IsNumber()
  textHeight!: number;

  @ApiProperty({ example: '2025-01-15T10:30:00Z' })
  @IsString()
  timestamp!: string;
}

export class SyncHistoryDto {
  @ApiProperty({ type: [HistoryItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoryItemDto)
  history!: HistoryItemDto[];
}
