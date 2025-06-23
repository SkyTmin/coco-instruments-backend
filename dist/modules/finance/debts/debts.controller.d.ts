import { DebtsService } from './debts.service';
import { User } from '@database/entities/user.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SyncDebtsDto } from './dto/sync-debts.dto';
import { SyncDebtCategoriesDto } from './dto/sync-debt-categories.dto';
import { DebtStatus } from '@database/entities/debt.entity';
export declare class DebtsController {
    private readonly debtsService;
    constructor(debtsService: DebtsService);
    getDebts(user: User): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            date: string;
            category: string | null;
            status: DebtStatus;
            note: string | null;
            payments: {
                id: string;
                amount: number;
                date: string;
                note: string | null;
                preliminary: boolean;
            }[];
        }[];
    }>;
    syncDebts(user: User, syncDebtsDto: SyncDebtsDto): Promise<{
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
    syncCategories(user: User, syncDebtCategoriesDto: SyncDebtCategoriesDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    createDebt(user: User, createDebtDto: CreateDebtDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            date: string;
            category: string | null;
            status: DebtStatus;
            note: string | null;
            payments: {
                id: string;
                amount: number;
                date: string;
                note: string | null;
                preliminary: boolean;
            }[];
        };
    }>;
    updateDebt(user: User, id: string, updateDebtDto: UpdateDebtDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            amount: number;
            date: string;
            category: string | null;
            status: DebtStatus;
            note: string | null;
            payments: {
                id: string;
                amount: number;
                date: string;
                note: string | null;
                preliminary: boolean;
            }[];
        };
    }>;
    deleteDebt(user: User, id: string): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    addPayment(user: User, debtId: string, createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        data: import("../../../database/entities/payment.entity").Payment;
    }>;
}
