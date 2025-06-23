import { Repository } from 'typeorm';
import { Debt, DebtStatus } from '@database/entities/debt.entity';
import { Payment } from '@database/entities/payment.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SyncDebtsDto } from './dto/sync-debts.dto';
import { SyncDebtCategoriesDto } from './dto/sync-debt-categories.dto';
export declare class DebtsService {
    private readonly debtRepository;
    private readonly paymentRepository;
    private userCategories;
    constructor(debtRepository: Repository<Debt>, paymentRepository: Repository<Payment>);
    getDebts(userId: string): Promise<{
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
    syncDebts(userId: string, syncDebtsDto: SyncDebtsDto): Promise<{
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
    syncCategories(userId: string, syncCategoriesDto: SyncDebtCategoriesDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    createDebt(userId: string, createDebtDto: CreateDebtDto): Promise<{
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
    updateDebt(userId: string, debtId: string, updateDebtDto: UpdateDebtDto): Promise<{
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
    deleteDebt(userId: string, debtId: string): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    addPayment(userId: string, debtId: string, createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        data: Payment;
    }>;
    private findUserDebt;
    private updateDebtStatus;
    private formatDebtForFrontend;
}
