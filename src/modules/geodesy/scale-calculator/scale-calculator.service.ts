import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScaleCalculation } from '@database/entities/scale-calculation.entity';
import { CalculateScaleDto } from './dto/calculate-scale.dto';
import { SyncHistoryDto } from './dto/sync-history.dto';

@Injectable()
export class ScaleCalculatorService {
  // Known values for interpolation
  private readonly knownValues = {
    scale1: 1000,
    height1: 2.5,
    scale2: 100,
    height2: 0.250,
  };

  constructor(
    @InjectRepository(ScaleCalculation)
    private readonly calculationRepository: Repository<ScaleCalculation>,
  ) {}

  async calculate(userId: string, calculateScaleDto: CalculateScaleDto) {
    const { type, value } = calculateScaleDto;
    let result: { scale: number; textHeight: number };

    if (type === 'scale') {
      const textHeight = this.calculateTextHeightFromScale(value);
      result = { scale: value, textHeight };
    } else {
      const scale = this.calculateScaleFromTextHeight(value);
      result = { scale, textHeight: value };
    }

    // Save to history
    const calculation = this.calculationRepository.create({
      scale: result.scale,
      textHeight: result.textHeight,
      userId,
    });

    await this.calculationRepository.save(calculation);

    return {
      data: result,
    };
  }

  async getHistory(userId: string) {
    const calculations = await this.calculationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 20, // Limit to last 20 calculations
    });

    return {
      success: true,
      data: calculations.map(calc => ({
        id: calc.id,
        scale: calc.scale,
        textHeight: Number(calc.textHeight),
        createdAt: calc.createdAt,
      })),
    };
  }

  async syncHistory(userId: string, syncHistoryDto: SyncHistoryDto) {
    const { history } = syncHistoryDto;

    // Удаляем всю существующую историю пользователя
    await this.calculationRepository.delete({ userId });

    // Создаем новые записи на основе данных фронтенда
    const calculations = history.map(item => 
      this.calculationRepository.create({
        scale: item.scale,
        textHeight: item.textHeight,
        userId,
        createdAt: new Date(item.timestamp),
      })
    );

    if (calculations.length > 0) {
      await this.calculationRepository.save(calculations);
    }

    return {
      success: true,
      data: { message: 'История синхронизирована' },
    };
  }

  async clearHistory(userId: string) {
    await this.calculationRepository.delete({ userId });
    
    return {
      success: true,
      data: { message: 'История очищена' },
    };
  }

  private calculateTextHeightFromScale(scale: number): number {
    const { scale1, height1, scale2, height2 } = this.knownValues;

    // Logarithmic interpolation
    const logScale = Math.log(scale);
    const logScale1 = Math.log(scale1);
    const logScale2 = Math.log(scale2);
    const logHeight1 = Math.log(height1);
    const logHeight2 = Math.log(height2);

    // Interpolation in logarithmic space
    const t = (logScale - logScale1) / (logScale2 - logScale1);
    const logHeight = logHeight1 + t * (logHeight2 - logHeight1);

    // Convert back from logarithmic space
    const height = Math.exp(logHeight);

    // Round to 3 decimal places
    return Math.round(height * 1000) / 1000;
  }

  private calculateScaleFromTextHeight(textHeight: number): number {
    const { scale1, height1, scale2, height2 } = this.knownValues;

    // Logarithmic interpolation
    const logHeight = Math.log(textHeight);
    const logHeight1 = Math.log(height1);
    const logHeight2 = Math.log(height2);
    const logScale1 = Math.log(scale1);
    const logScale2 = Math.log(scale2);

    // Interpolation in logarithmic space
    const t = (logHeight - logHeight1) / (logHeight2 - logHeight1);
    const logScale = logScale1 + t * (logScale2 - logScale1);

    // Convert back from logarithmic space
    const scale = Math.exp(logScale);

    // Round to nearest integer
    return Math.round(scale);
  }
}
