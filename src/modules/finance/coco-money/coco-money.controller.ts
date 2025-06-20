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
import { SyncSheetsDto } from './dto/sync-sheets.dto';
import { SyncCategoriesDto } from './dto/sync-categories.dto';
import { SheetType } from '@database/entities/sheet.entity';

@ApiTags('Coco Money')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coco-money')
export class CocoMoneyController {
  constructor(private readonly cocoMoneyService: CocoMoneyService) {}

  @Get('sheets')
  @ApiOperation({ summary: 'Get all sheets' })
  @ApiResponse({ status: 200, description: 'Returns sheets' })
  async getSheets(@GetUser() user: User) {
    return this.cocoMoneyService.getSheets(user.id);
  }

  @Post('sheets')
  @ApiOperation({ summary: 'Sync sheets data' })
  @ApiResponse({ status: 201, description: 'Sheets synced successfully' })
  async syncSheets(
    @GetUser() user: User,
    @Body() syncSheetsDto: SyncSheetsDto,
  ) {
    return this.cocoMoneyService.syncSheets(user.id, syncSheetsDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get user categories' })
  @ApiResponse({ status: 200, description: 'Returns categories' })
  async getCategories(@GetUser() user: User) {
    return this.cocoMoneyService.getCategories(user.id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Sync categories data' })
  @ApiResponse({ status: 201, description: 'Categories synced successfully' })
  async syncCategories(
    @GetUser() user: User,
    @Body() syncCategoriesDto: SyncCategoriesDto,
  ) {
    return this.cocoMoneyService.syncCategories(user.id, syncCategoriesDto);
  }

  // Дополнительные эндпоинты для создания отдельных листов и расходов
  @Post('sheets/create')
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

  // НОВЫЙ ENDPOINT: Удаление расхода
  @Delete('sheets/:sheetId/expenses/:expenseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense from sheet' })
  @ApiResponse({ status: 204, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async deleteExpense(
    @GetUser() user: User,
    @Param('sheetId', ParseUUIDPipe) sheetId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
  ) {
    return this.cocoMoneyService.deleteExpense(user.id, sheetId, expenseId);
  }

  // НОВЫЙ ENDPOINT: Обновление расхода
  @Put('sheets/:sheetId/expenses/:expenseId')
  @ApiOperation({ summary: 'Update expense in sheet' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async updateExpense(
    @GetUser() user: User,
    @Param('sheetId', ParseUUIDPipe) sheetId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
    @Body() updateExpenseDto: CreateExpenseDto,
  ) {
    return this.cocoMoneyService.updateExpense(user.id, sheetId, expenseId, updateExpenseDto);
  }

  @Post('categories/create')
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(
    @GetUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.cocoMoneyService.createCategory(user.id, createCategoryDto);
  }
}
