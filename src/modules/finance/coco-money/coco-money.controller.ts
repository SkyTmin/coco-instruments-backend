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
import { CocoMoneyService } from './coco-money.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@common/decorators/get-user.decorator';
import { User } from '@database/entities/user.entity';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SheetType } from '@database/entities/sheet.entity';

@ApiTags('Coco Money')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/coco-money')
export class CocoMoneyController {
  constructor(private readonly cocoMoneyService: CocoMoneyService) {}

  @Get('sheets')
  @ApiOperation({ summary: 'Get all sheets or filter by type' })
  @ApiQuery({ name: 'type', enum: SheetType, required: false })
  @ApiResponse({ status: 200, description: 'Returns sheets' })
  async getSheets(
    @GetUser() user: User,
    @Query('type') type?: SheetType,
  ) {
    return this.cocoMoneyService.getSheets(user.id, type);
  }

  @Post('sheets')
  @ApiOperation({ summary: 'Create new sheet' })
  @ApiResponse({ status: 201, description: 'Sheet created successfully' })
  async createSheet(
    @GetUser() user: User,
    @Body() createSheetDto: CreateSheetDto,
  ) {
    return this.cocoMoneyService.createSheet(user.id, createSheetDto);
  }

  @Put('sheets/:id')
  @ApiOperation({ summary: 'Update sheet' })
  @ApiResponse({ status: 200, description: 'Sheet updated successfully' })
  async updateSheet(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSheetDto: UpdateSheetDto,
  ) {
    return this.cocoMoneyService.updateSheet(user.id, id, updateSheetDto);
  }

  @Delete('sheets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete sheet' })
  @ApiResponse({ status: 204, description: 'Sheet deleted successfully' })
  async deleteSheet(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.cocoMoneyService.deleteSheet(user.id, id);
  }

  @Post('sheets/:sheetId/expenses')
  @ApiOperation({ summary: 'Add expense to sheet' })
  @ApiResponse({ status: 201, description: 'Expense added successfully' })
  async addExpense(
    @GetUser() user: User,
    @Param('sheetId', ParseUUIDPipe) sheetId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.cocoMoneyService.addExpense(user.id, sheetId, createExpenseDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get user categories' })
  @ApiResponse({ status: 200, description: 'Returns categories' })
  async getCategories(@GetUser() user: User) {
    return this.cocoMoneyService.getCategories(user.id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(
    @GetUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.cocoMoneyService.createCategory(user.id, createCategoryDto);
  }
}