import { CocoMoneyService } from './coco-money.service';
import { User } from '@database/entities/user.entity';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SyncSheetsDto } from './dto/sync-sheets.dto';
import { SyncCategoriesDto } from './dto/sync-categories.dto';
export declare class CocoMoneyController {
    private readonly cocoMoneyService;
    constructor(cocoMoneyService: CocoMoneyService);
    getSheets(user: User): Promise<{
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
    syncSheets(user: User, syncSheetsDto: SyncSheetsDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    getCategories(user: User): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
        }[];
    }>;
    syncCategories(user: User, syncCategoriesDto: SyncCategoriesDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    createSheet(user: User, createSheetDto: CreateSheetDto): Promise<{
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
    updateSheet(user: User, id: string, updateSheetDto: UpdateSheetDto): Promise<{
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
    deleteSheet(user: User, id: string): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    addExpense(user: User, sheetId: string, createExpenseDto: CreateExpenseDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            category: string | null;
            note: string | null;
        };
    }>;
    deleteExpense(user: User, sheetId: string, expenseId: string): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    updateExpense(user: User, sheetId: string, expenseId: string, updateExpenseDto: CreateExpenseDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            category: string | null;
            note: string | null;
        };
    }>;
    createCategory(user: User, createCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
        };
    }>;
}
