import { DebtStatus } from '@database/entities/debt.entity';
export declare class CreateDebtDto {
    name: string;
    amount: number;
    date: string;
    category?: string;
    status: DebtStatus;
    note?: string;
}
