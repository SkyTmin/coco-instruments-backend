import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingParameter } from '@database/entities/clothing-parameter.entity';
import { SaveParametersDto } from './dto/save-parameters.dto';
import { UpdateParametersDto } from './dto/update-parameters.dto';
import { CalculateSizeDto } from './dto/calculate-size.dto';

@Injectable()
export class ClothingService {
  constructor(
    @InjectRepository(ClothingParameter)
    private readonly parameterRepository: Repository<ClothingParameter>,
  ) {}

  async getParameters(userId: string) {
    const parameters = await this.parameterRepository.findOne({
      where: { userId },
    });

    if (!parameters) {
      return {
        data: null,
      };
    }

    return {
      data: this.formatParameters(parameters),
    };
  }

  async saveParameters(userId: string, saveParametersDto: SaveParametersDto) {
    // Check if parameters already exist
    const existing = await this.parameterRepository.findOne({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Parameters already exist. Use PUT to update.');
    }

    const parameters = this.parameterRepository.create({
      ...saveParametersDto,
      userId,
    });

    const saved = await this.parameterRepository.save(parameters);

    return {
      data: this.formatParameters(saved),
    };
  }

  async updateParameters(userId: string, updateParametersDto: UpdateParametersDto) {
    const parameters = await this.parameterRepository.findOne({
      where: { userId },
    });

    if (!parameters) {
      throw new NotFoundException('Parameters not found');
    }

    Object.assign(parameters, updateParametersDto);

    const saved = await this.parameterRepository.save(parameters);

    return {
      data: this.formatParameters(saved),
    };
  }

  async calculateSize(calculateSizeDto: CalculateSizeDto) {
    const { category, parameters } = calculateSizeDto;
    let result: any = {};

    switch (category) {
      case 'outerwear':
        result = this.calculateOuterwearSize(parameters.chest);
        break;
      case 'shirts':
        result = this.calculateShirtSize(parameters.chest, parameters.neck);
        break;
      case 'pants':
        result = this.calculatePantsSize(parameters.waist, parameters.inseam);
        break;
      case 'shoes':
        result = this.calculateShoeSize(parameters.foot);
        break;
      case 'underwear':
        result = this.calculateUnderwearSize(parameters.chest, parameters.underbust);
        break;
      default:
        throw new Error('Unknown category');
    }

    return {
      data: {
        category,
        result,
      },
    };
  }

  private calculateOuterwearSize(chest: number) {
    const ru = Math.round(chest / 2);
    const eu = ru;
    const us = ru - 10;
    const int = this.getInternationalSize(chest);
    
    return { ru, eu, us, int };
  }

  private calculateShirtSize(chest: number, neck?: number) {
    const bodySize = Math.round(chest / 2);
    const collarSize = neck ? neck + 1.5 : null;
    const int = this.getInternationalSize(chest);
    
    return { bodySize, collarSize, int };
  }

  private calculatePantsSize(waist: number, inseam?: number) {
    const w = Math.round(waist / 2.54);
    const l = inseam ? Math.round(inseam / 2.54) : null;
    
    return { w, l };
  }

  private calculateShoeSize(footLength: number) {
    const ru = Math.round(footLength * 1.5);
    const eu = Math.round(footLength + 1.5);
    const usMale = Math.round((footLength / 2.54) * 3 - 22);
    const usFemale = Math.round((footLength / 2.54) * 3 - 21);
    const uk = eu - 33;
    
    return { ru, eu, usMale, usFemale, uk };
  }

  private calculateUnderwearSize(chest: number, underbust: number) {
    const bandSize = Math.round(underbust);
    const difference = chest - underbust;
    let cupSize = 'A';
    
    if (difference < 10) cupSize = 'A';
    else if (difference >= 10 && difference <= 12) cupSize = 'B';
    else if (difference >= 13 && difference <= 15) cupSize = 'C';
    else if (difference >= 16 && difference <= 18) cupSize = 'D';
    else if (difference > 18) cupSize = 'E';
    
    return { size: `${bandSize}${cupSize}`, bandSize, cupSize };
  }

  private getInternationalSize(chest: number): string {
    if (chest >= 86 && chest < 94) return 'S';
    if (chest >= 94 && chest < 102) return 'M';
    if (chest >= 102 && chest < 110) return 'L';
    if (chest >= 110 && chest < 118) return 'XL';
    if (chest >= 118 && chest < 126) return 'XXL';
    return 'XXXL';
  }

  private formatParameters(parameters: ClothingParameter) {
    return {
      gender: parameters.gender,
      height: parameters.height ? Number(parameters.height) : null,
      weight: parameters.weight ? Number(parameters.weight) : null,
      chest: parameters.chest ? Number(parameters.chest) : null,
      underbust: parameters.underbust ? Number(parameters.underbust) : null,
      waist: parameters.waist ? Number(parameters.waist) : null,
      hips: parameters.hips ? Number(parameters.hips) : null,
      neck: parameters.neck ? Number(parameters.neck) : null,
      foot: parameters.foot ? Number(parameters.foot) : null,
      inseam: parameters.inseam ? Number(parameters.inseam) : null,
      wrist: parameters.wrist ? Number(parameters.wrist) : null,
      head: parameters.head ? Number(parameters.head) : null,
      createdAt: parameters.createdAt,
      updatedAt: parameters.updatedAt,
    };
  }
}