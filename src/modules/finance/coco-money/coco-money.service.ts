import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sheet, SheetType } from '@database/entities/sheet.entity';
import { Expense } from '@database/entities/expense.entity';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SyncSheetsDto } from './dto/sync-sheets.dto';
import { SyncCategoriesDto } from './dto/sync-categories.dto';

@Injectable()
export class CocoMoneyService {
  private userCategories: Map<string, Array<{ id: string; name: string }>> = new Map();

  constructor(
    @InjectRepository(Sheet)
    private readonly sheetRepository: Repository<Sheet>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async getSheets(userId: string) {
    const query = this.sheetRepository
      .createQueryBuilder('sheet')
      .leftJoinAndSelect('sheet.expenses', 'expense')
      .where('sheet.userId = :userId', { userId })
      .orderBy('sheet.createdAt', 'DESC');

    const sheets = await query.getMany();

    // Группируем по типу для фронтенда
    const income = sheets
      .filter(sheet => sheet.type === SheetType.INCOME)
      .map(this.formatSheetForFrontend);

    const preliminary = sheets
      .filter(sheet => sheet.type === SheetType.PRELIMINARY)
      .map(this.formatSheetForFrontend);

    return {
      success: true,
      data: {
        income,
        preliminary,
      },
    };
  }

  async syncSheets(userId: string, syncSheetsDto: SyncSheetsDto) {
    const { sheets } = syncSheetsDto;

    // Удаляем все существующие листы пользователя
    await this.sheetRepository.delete({ userId });

    // Создаем новые листы
    const allSheets = [
      ...sheets.income.map(sheet => ({ ...sheet, type: SheetType.INCOME })),
      ...sheets.preliminary.map(sheet => ({ ...sheet, type: SheetType.PRELIMINARY })),
    ];

    for (const sheetData of allSheets) {
      const sheet = this.sheetRepository.create({
        id: sheetData.id,
        name: sheetData.name,
        amount: sheetData.amount,
        date: new Date(sheetData.date),
        note: sheetData.note,
        type: sheetData.type,
        userId,
      });

      const savedSheet = await this.sheetRepository.save(sheet);

      // Создаем расходы для листа
      if (sheetData.expenses && sheetData.expenses.length > 0) {
        const expenses = sheetData.expenses.map(expenseData =>
          this.expenseRepository.create({
            name: expenseData.name,
            amount: expenseData.amount,
            category: expenseData.category,
            note: expenseData.note,
            sheetId: savedSheet.id,
          })
        );

        await this.expenseRepository.save(expenses);
      }
    }

    return {
      success: true,
      data: { message: 'Данные сохранены' },
    };
  }

  async getCategories(userId: string) {
    const userCategories = this.userCategories.get(userId) || [];
    
    return {
      success: true,
      data: userCategories,
    };
  }

  async syncCategories(userId: string, syncCategoriesDto: SyncCategoriesDto) {
    const { categories } = syncCategoriesDto;
    
    this.userCategories.set(userId, categories);

    return {
      success: true,
      data: { message: 'Данные сохранены' },
    };
  }

  async createSheet(userId: string, createSheetDto: CreateSheetDto) {
    const sheet = this.sheetRepository.create({
      ...createSheetDto,
      userId,
    });

    const savedSheet = await this.sheetRepository.save(sheet);

    return {
      success: true,
      data: this.formatSheetForFrontend(savedSheet),
    };
  }

  async updateSheet(userId: string, sheetId: string, updateSheetDto: UpdateSheetDto) {
    const sheet = await this.findUserSheet(userId, sheetId);

    Object.assign(sheet, updateSheetDto);

    const savedSheet = await this.sheetRepository.save(sheet);

    return {
      success: true,
      data: this.formatSheetForFrontend(savedSheet),
    };
  }

  async deleteSheet(userId: string, sheetId: string) {
    const sheet = await this.findUserSheet(userId, sheetId);

    await this.sheetRepository.remove(sheet);

    return {
      success: true,
      data: { message: 'Лист удален' },
    };
  }

  async addExpense(userId: string, sheetId: string, createExpenseDto: CreateExpenseDto) {
    await this.findUserSheet(userId, sheetId);

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      sheetId,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    return {
      success: true,
      data: {
        id: savedExpense.id,
        name: savedExpense.name,
        amount: Number(savedExpense.amount),
        category: savedExpense.category,
        note: savedExpense.note,
      },
    };
  }

  // НОВЫЙ МЕТОД: Удаление расхода
  async deleteExpense(userId: string, sheetId: string, expenseId: string) {
    // Проверяем, что лист принадлежит пользователю
    await this.findUserSheet(userId, sheetId);

    // Ищем расход
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, sheetId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Удаляем расход
    await this.expenseRepository.remove(expense);

    return {
      success: true,
      data: { message: 'Расход удален' },
    };
  }

  // НОВЫЙ МЕТОД: Обновление расхода
  async updateExpense(userId: string, sheetId: string, expenseId: string, updateExpenseDto: CreateExpenseDto) {
    // Проверяем, что лист принадлежит пользователю
    await this.findUserSheet(userId, sheetId);

    // Ищем расход
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, sheetId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Обновляем расход
    Object.assign(expense, updateExpenseDto);
    const savedExpense = await this.expenseRepository.save(expense);

    return {
      success: true,
      data: {
        id: savedExpense.id,
        name: savedExpense.name,
        amount: Number(savedExpense.amount),
        category: savedExpense.category,
        note: savedExpense.note,
      },
    };
  }

  async createCategory(userId: string, createCategoryDto: CreateCategoryDto) {
    const userCategories = this.userCategories.get(userId) || [];
    
    const existingCategory = userCategories.find(cat => cat.name === createCategoryDto.name);
    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    const newCategory = {
      id: createCategoryDto.name.toLowerCase().replace(/\s+/g, '-'),
      name: createCategoryDto.name,
    };

    userCategories.push(newCategory);
    this.userCategories.set(userId, userCategories);

    return {
      success: true,
      data: newCategory,
    };
  }

  private async findUserSheet(userId: string, sheetId: string): Promise<Sheet> {
    const sheet = await this.sheetRepository.findOne({
      where: { id: sheetId },
      relations: ['expenses'],
    });

    if (!sheet) {
      throw new NotFoundException('Sheet not found');
    }

    if (sheet.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return sheet;
  }

  private formatSheetForFrontend(sheet: Sheet) {
    return {
      id: sheet.id,
      name: sheet.name,
      amount: Number(sheet.amount),
      date: sheet.date.toISOString().split('T')[0], // Форматируем дату как YYYY-MM-DD
      note: sheet.note,
      expenses: sheet.expenses?.map(expense => ({
        id: expense.id, // ВАЖНО: Добавляем ID для возможности удаления
        name: expense.name,
        amount: Number(expense.amount),
        category: expense.category,
        note: expense.note,
      })) || [],
    };
  }
}
