import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingParameter, Gender } from '@database/entities/clothing-parameter.entity';
import { SyncClothingDataDto } from './dto/sync-clothing-data.dto';

@Injectable()
export class ClothingService {
  private userSavedResults: Map<string, any[]> = new Map();

  constructor(
    @InjectRepository(ClothingParameter)
    private readonly parameterRepository: Repository<ClothingParameter>,
  ) {}

  async getClothingData(userId: string) {
    const parameters = await this.parameterRepository.findOne({
      where: { userId },
    });

    const savedResults = this.userSavedResults.get(userId) || [];

    if (!parameters) {
      return {
        success: true,
        data: {
          parameters: {},
          savedResults,
          currentGender: 'male',
        },
      };
    }

    return {
      success: true,
      data: {
        parameters: this.formatParameters(parameters),
        savedResults,
        currentGender: parameters.gender,
      },
    };
  }

  async syncClothingData(userId: string, syncClothingDataDto: SyncClothingDataDto) {
    const { parameters, savedResults, currentGender } = syncClothingDataDto;

    // Сохраняем или обновляем параметры
    let clothingParameters = await this.parameterRepository.findOne({
      where: { userId },
    });

    if (!clothingParameters) {
      clothingParameters = this.parameterRepository.create({
        userId,
        gender: currentGender as Gender,
        ...parameters,
      });
    } else {
      Object.assign(clothingParameters, {
        gender: currentGender as Gender,
        ...parameters,
      });
    }

    await this.parameterRepository.save(clothingParameters);

    // Сохраняем результаты
    this.userSavedResults.set(userId, savedResults);

    return {
      success: true,
      data: { message: 'Данные сохранены' },
    };
  }

  private formatParameters(parameters: ClothingParameter) {
    return {
      height: parameters.height ? Number(parameters.height) : undefined,
      weight: parameters.weight ? Number(parameters.weight) : undefined,
      chest: parameters.chest ? Number(parameters.chest) : undefined,
      underbust: parameters.underbust ? Number(parameters.underbust) : undefined,
      waist: parameters.waist ? Number(parameters.waist) : undefined,
      hips: parameters.hips ? Number(parameters.hips) : undefined,
      neck: parameters.neck ? Number(parameters.neck) : undefined,
      foot: parameters.foot ? Number(parameters.foot) : undefined,
      inseam: parameters.inseam ? Number(parameters.inseam) : undefined,
      wrist: parameters.wrist ? Number(parameters.wrist) : undefined,
      head: parameters.head ? Number(parameters.head) : undefined,
    };
  }
}
