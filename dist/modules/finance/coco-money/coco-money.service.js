"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CocoMoneyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sheet_entity_1 = require("../../../database/entities/sheet.entity");
const expense_entity_1 = require("../../../database/entities/expense.entity");
let CocoMoneyService = class CocoMoneyService {
    sheetRepository;
    expenseRepository;
    userCategories = new Map();
    constructor(sheetRepository, expenseRepository) {
        this.sheetRepository = sheetRepository;
        this.expenseRepository = expenseRepository;
    }
    async getSheets(userId) {
        const query = this.sheetRepository
            .createQueryBuilder('sheet')
            .leftJoinAndSelect('sheet.expenses', 'expense')
            .where('sheet.userId = :userId', { userId })
            .orderBy('sheet.createdAt', 'DESC');
        const sheets = await query.getMany();
        const income = sheets
            .filter(sheet => sheet.type === sheet_entity_1.SheetType.INCOME)
            .map(this.formatSheetForFrontend);
        const preliminary = sheets
            .filter(sheet => sheet.type === sheet_entity_1.SheetType.PRELIMINARY)
            .map(this.formatSheetForFrontend);
        return {
            success: true,
            data: {
                income,
                preliminary,
            },
        };
    }
    async syncSheets(userId, syncSheetsDto) {
        const { sheets } = syncSheetsDto;
        await this.sheetRepository.delete({ userId });
        const allSheets = [
            ...sheets.income.map(sheet => ({ ...sheet, type: sheet_entity_1.SheetType.INCOME })),
            ...sheets.preliminary.map(sheet => ({ ...sheet, type: sheet_entity_1.SheetType.PRELIMINARY })),
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
            if (sheetData.expenses && sheetData.expenses.length > 0) {
                const expenses = sheetData.expenses.map(expenseData => this.expenseRepository.create({
                    name: expenseData.name,
                    amount: expenseData.amount,
                    category: expenseData.category,
                    note: expenseData.note,
                    sheetId: savedSheet.id,
                }));
                await this.expenseRepository.save(expenses);
            }
        }
        return {
            success: true,
            data: { message: 'Данные сохранены' },
        };
    }
    async getCategories(userId) {
        const userCategories = this.userCategories.get(userId) || [];
        return {
            success: true,
            data: userCategories,
        };
    }
    async syncCategories(userId, syncCategoriesDto) {
        const { categories } = syncCategoriesDto;
        this.userCategories.set(userId, categories);
        return {
            success: true,
            data: { message: 'Данные сохранены' },
        };
    }
    async createSheet(userId, createSheetDto) {
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
    async updateSheet(userId, sheetId, updateSheetDto) {
        const sheet = await this.findUserSheet(userId, sheetId);
        Object.assign(sheet, updateSheetDto);
        const savedSheet = await this.sheetRepository.save(sheet);
        return {
            success: true,
            data: this.formatSheetForFrontend(savedSheet),
        };
    }
    async deleteSheet(userId, sheetId) {
        const sheet = await this.findUserSheet(userId, sheetId);
        await this.sheetRepository.remove(sheet);
        return {
            success: true,
            data: { message: 'Лист удален' },
        };
    }
    async addExpense(userId, sheetId, createExpenseDto) {
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
    async deleteExpense(userId, sheetId, expenseId) {
        await this.findUserSheet(userId, sheetId);
        const expense = await this.expenseRepository.findOne({
            where: { id: expenseId, sheetId },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        await this.expenseRepository.remove(expense);
        return {
            success: true,
            data: { message: 'Расход удален' },
        };
    }
    async updateExpense(userId, sheetId, expenseId, updateExpenseDto) {
        await this.findUserSheet(userId, sheetId);
        const expense = await this.expenseRepository.findOne({
            where: { id: expenseId, sheetId },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
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
    async createCategory(userId, createCategoryDto) {
        const userCategories = this.userCategories.get(userId) || [];
        const existingCategory = userCategories.find(cat => cat.name === createCategoryDto.name);
        if (existingCategory) {
            throw new common_1.BadRequestException('Category already exists');
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
    async findUserSheet(userId, sheetId) {
        const sheet = await this.sheetRepository.findOne({
            where: { id: sheetId },
            relations: ['expenses'],
        });
        if (!sheet) {
            throw new common_1.NotFoundException('Sheet not found');
        }
        if (sheet.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return sheet;
    }
    formatSheetForFrontend(sheet) {
        return {
            id: sheet.id,
            name: sheet.name,
            amount: Number(sheet.amount),
            date: sheet.date.toISOString().split('T')[0],
            note: sheet.note,
            expenses: sheet.expenses?.map(expense => ({
                id: expense.id,
                name: expense.name,
                amount: Number(expense.amount),
                category: expense.category,
                note: expense.note,
            })) || [],
        };
    }
};
exports.CocoMoneyService = CocoMoneyService;
exports.CocoMoneyService = CocoMoneyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sheet_entity_1.Sheet)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CocoMoneyService);
//# sourceMappingURL=coco-money.service.js.map