import { Repository } from 'typeorm';
import { Sheet } from '@database/entities/sheet.entity';
import { Expense } from '@database/entities/expense.entity';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SyncSheetsDto } from './dto/sync-sheets.dto';
import { SyncCategoriesDto } from './dto/sync-categories.dto';
export declare class CocoMoneyService {
    private readonly sheetRepository;
    private readonly expenseRepository;
    private userCategories;
    constructor(sheetRepository: Repository<Sheet>, expenseRepository: Repository<Expense>);
    getSheets(userId: string): Promise<{
        success: boolean;
        data: {
            income: {
                id: string;
                name: string;
                amount: number;
                date: string;
                note: string | null;
                expenses: {
                    id: string;
                    name: string;
                    amount: number;
                    category: string | null;
                    note: string | null;
                }[];
            }[];
            preliminary: {
                id: string;
                name: string;
                amount: number;
                date: string;
                note: string | null;
                expenses: {
                    id: string;
                    name: string;
                    amount: number;
                    category: string | null;
                    note: string | null;
                }[];
            }[];
        };
    }>;
    syncSheets(userId: string, syncSheetsDto: SyncSheetsDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    getCategories(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
        }[];
    }>;
    syncCategories(userId: string, syncCategoriesDto: SyncCategoriesDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    createSheet(userId: string, createSheetDto: CreateSheetDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            date: string;
            note: string | null;
            expenses: {
                id: string;
                name: string;
                amount: number;
                category: string | null;
                note: string | null;
            }[];
        };
    }>;
    updateSheet(userId: string, sheetId: string, updateSheetDto: UpdateSheetDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            date: string;
            note: string | null;
            expenses: {
                id: string;
                name: string;
                amount: number;
                category: string | null;
                note: string | null;
            }[];
        };
    }>;
    deleteSheet(userId: string, sheetId: string): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    addExpense(userId: string, sheetId: string, createExpenseDto: CreateExpenseDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            category: string | null;
            note: string | null;
        };
    }>;
    deleteExpense(userId: string, sheetId: string, expenseId: string): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    updateExpense(userId: string, sheetId: string, expenseId: string, updateExpenseDto: CreateExpenseDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            category: string | null;
            note: string | null;
        };
    }>;
    createCategory(userId: string, createCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
        };
    }>;
    private findUserSheet;
    private formatSheetForFrontend;
}
