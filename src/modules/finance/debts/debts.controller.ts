import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DebtsService } from './debts.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@common/decorators/get-user.decorator';
import { User } from '@database/entities/user.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DebtStatus } from '@database/entities/debt.entity';

@ApiTags('Debts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all debts' })
  @ApiQuery({ name: 'sort', required: false, example: 'date-desc' })
  @ApiQuery({ name: 'status', enum: DebtStatus, required: false })
  @ApiResponse({ status: 200, description: 'Returns debts' })
  async getDebts(
    @GetUser() user: User,
    @Query('sort') sort?: string,
    @Query('status') status?: DebtStatus,
  ) {
    return this.debtsService.getDebts(user.id, sort, status);
  }

  @Post()
  @ApiOperation({ summary: 'Create new debt' })
  @ApiResponse({ status: 201, description: 'Debt created successfully' })
  async createDebt(
    @GetUser() user: User,
    @Body() createDebtDto: CreateDebtDto,
  ) {
    return this.debtsService.createDebt(user.id, createDebtDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update debt' })
  @ApiResponse({ status: 200, description: 'Debt updated successfully' })
  async updateDebt(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDebtDto: UpdateDebtDto,
  ) {
    return this.debtsService.updateDebt(user.id, id, updateDebtDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete debt' })
  @ApiResponse({ status: 204, description: 'Debt deleted successfully' })
  async deleteDebt(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.debtsService.deleteDebt(user.id, id);
  }

  @Post(':debtId/payments')
  @ApiOperation({ summary: 'Add payment to debt' })
  @ApiResponse({ status: 201, description: 'Payment added successfully' })
  async addPayment(
    @GetUser() user: User,
    @Param('debtId', ParseUUIDPipe) debtId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.debtsService.addPayment(user.id, debtId, createPaymentDto);
  }
}