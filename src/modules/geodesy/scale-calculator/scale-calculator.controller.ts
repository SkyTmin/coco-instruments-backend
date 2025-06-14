import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScaleCalculatorService } from './scale-calculator.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@common/decorators/get-user.decorator';
import { User } from '@database/entities/user.entity';
import { CalculateScaleDto } from './dto/calculate-scale.dto';

@ApiTags('Scale Calculator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('geodesy/scale-calculator')
export class ScaleCalculatorController {
  constructor(private readonly scaleCalculatorService: ScaleCalculatorService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate scale or text height' })
  @ApiResponse({ status: 200, description: 'Returns calculation result' })
  async calculate(
    @GetUser() user: User,
    @Body() calculateScaleDto: CalculateScaleDto,
  ) {
    return this.scaleCalculatorService.calculate(user.id, calculateScaleDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get calculation history' })
  @ApiResponse({ status: 200, description: 'Returns calculation history' })
  async getHistory(@GetUser() user: User) {
    return this.scaleCalculatorService.getHistory(user.id);
  }

  @Delete('history')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear calculation history' })
  @ApiResponse({ status: 204, description: 'History cleared successfully' })
  async clearHistory(@GetUser() user: User) {
    return this.scaleCalculatorService.clearHistory(user.id);
  }
}