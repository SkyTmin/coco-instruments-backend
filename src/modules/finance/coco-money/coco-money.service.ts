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

@Injectable()
export class CocoMoneyService {
  private userCategories: Map<string, string[]> = new Map();

  constructor(
    @InjectRepository(Sheet)
    private readonly sheetRepository: Repository<Sheet>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async getSheets(userId: string, type?: SheetType) {
    const query = this.sheetRepository
      .createQueryBuilder('sheet')
      .leftJoinAndSelect('sheet.expenses', 'expense')
      .where('sheet.userId = :userId', { userId })
      .orderBy('sheet.createdAt', 'DESC');

    if (type) {
      query.andWhere('sheet.type = :type', { type });
    }

    const sheets = await query.getMany();

    return {
      data: sheets.map(this.formatSheet),
    };
  }

  async createSheet(userId: string, createSheetDto: CreateSheetDto) {
    const sheet = this.sheetRepository.create({
      ...createSheetDto,
      userId,
    });

    const savedSheet = await this.sheetRepository.save(sheet);

    return {
      data: this.formatSheet(savedSheet),
    };
  }

  async updateSheet(userId: string, sheetId: string, updateSheetDto: UpdateSheetDto) {
    const sheet = await this.findUserSheet(userId, sheetId);

    Object.assign(sheet, updateSheetDto);

    const savedSheet = await this.sheetRepository.save(sheet);

    return {
      data: this.formatSheet(savedSheet),
    };
  }

  async deleteSheet(userId: string, sheetId: string) {
    const sheet = await this.findUserSheet(userId, sheetId);

    await this.sheetRepository.remove(sheet);
  }

  async addExpense(userId: string, sheetId: string, createExpenseDto: CreateExpenseDto) {
    await this.findUserSheet(userId, sheetId);

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      sheetId,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    return {
      data: savedExpense,
    };
  }

  async getCategories(userId: string) {
    const userCategories = this.userCategories.get(userId) || [];
    
    const defaultCategories = [
      { id: 'transport', name: 'Транспорт' },
      { id: 'food', name: 'Продукты' },
      { id: 'utilities', name: 'Коммунальные услуги' },
      { id: 'entertainment', name: 'Развлечения' },
      { id: 'other', name: 'Другое' },
    ];

    return {
      data: [
        ...defaultCategories,
        ...userCategories.map(name => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
        })),
      ],
    };
  }

  async createCategory(userId: string, createCategoryDto: CreateCategoryDto) {
    const userCategories = this.userCategories.get(userId) || [];
    
    if (userCategories.includes(createCategoryDto.name)) {
      throw new BadRequestException('Category already exists');
    }

    userCategories.push(createCategoryDto.name);
    this.userCategories.set(userId, userCategories);

    return {
      data: {
        id: createCategoryDto.name.toLowerCase().replace(/\s+/g, '-'),
        name: createCategoryDto.name,
      },
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

  private formatSheet(sheet: Sheet) {
    return {
      id: sheet.id,
      name: sheet.name,
      amount: Number(sheet.amount),
      date: sheet.date,
      note: sheet.note,
      type: sheet.type,
      expenses: sheet.expenses?.map(expense => ({
        id: expense.id,
        name: expense.name,
        amount: Number(expense.amount),
        category: expense.category,
        note: expense.note,
      })) || [],
      createdAt: sheet.createdAt,
      updatedAt: sheet.updatedAt,
    };
  }
}