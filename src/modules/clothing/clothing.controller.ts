import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClothingService } from './clothing.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@common/decorators/get-user.decorator';
import { User } from '@database/entities/user.entity';
import { SyncClothingDataDto } from './dto/sync-clothing-data.dto';

@ApiTags('Clothing Size')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clothing-size') // Изменили путь чтобы соответствовал фронтенду
export class ClothingController {
  constructor(private readonly clothingService: ClothingService) {}

  @Get()
  @ApiOperation({ summary: 'Get user clothing data' })
  @ApiResponse({ status: 200, description: 'Returns user clothing data' })
  async getClothingData(@GetUser() user: User) {
    return this.clothingService.getClothingData(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Sync clothing data' })
  @ApiResponse({ status: 201, description: 'Clothing data synced successfully' })
  async syncClothingData(
    @GetUser() user: User,
    @Body() syncClothingDataDto: SyncClothingDataDto,
  ) {
    return this.clothingService.syncClothingData(user.id, syncClothingDataDto);
  }
}
