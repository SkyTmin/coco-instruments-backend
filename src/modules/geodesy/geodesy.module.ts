import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScaleCalculatorController } from './scale-calculator/scale-calculator.controller';
import { ScaleCalculatorService } from './scale-calculator/scale-calculator.service';
import { ScaleCalculation } from '@database/entities/scale-calculation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScaleCalculation])],
  controllers: [ScaleCalculatorController],
  providers: [ScaleCalculatorService],
  exports: [ScaleCalculatorService],
})
export class GeodesyModule {}