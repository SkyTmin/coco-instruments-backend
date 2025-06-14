import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClothingService } from './clothing.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@common/decorators/get-user.decorator';
import { User } from '@database/entities/user.entity';
import { SaveParametersDto } from './dto/save-parameters.dto';
import { UpdateParametersDto } from './dto/update-parameters.dto';
import { CalculateSizeDto } from './dto/calculate-size.dto';

@ApiTags('Clothing Size')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clothing/size')
export class ClothingController {
  constructor(private readonly clothingService: ClothingService) {}

  @Get('parameters')
  @ApiOperation({ summary: 'Get user clothing parameters' })
  @ApiResponse({ status: 200, description: 'Returns user parameters' })
  async getParameters(@GetUser() user: User) {
    return this.clothingService.getParameters(user.id);
  }

  @Post('parameters')
  @ApiOperation({ summary: 'Save user clothing parameters' })
  @ApiResponse({ status: 201, description: 'Parameters saved successfully' })
  async saveParameters(
    @GetUser() user: User,
    @Body() saveParametersDto: SaveParametersDto,
  ) {
    return this.clothingService.saveParameters(user.id, saveParametersDto);
  }

  @Put('parameters')
  @ApiOperation({ summary: 'Update user clothing parameters' })
  @ApiResponse({ status: 200, description: 'Parameters updated successfully' })
  async updateParameters(
    @GetUser() user: User,
    @Body() updateParametersDto: UpdateParametersDto,
  ) {
    return this.clothingService.updateParameters(user.id, updateParametersDto);
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate clothing size' })
  @ApiResponse({ status: 200, description: 'Returns calculated size' })
  async calculateSize(
    @GetUser() user: User,
    @Body() calculateSizeDto: CalculateSizeDto,
  ) {
    return this.clothingService.calculateSize(calculateSizeDto);
  }
}