import { Debt } from './debt.entity';
export declare class Payment {
    id: string;
    amount: number;
    date: Date | null;
    note: string | null;
    preliminary: boolean;
    debtId: string;
    createdAt: Date;
    updatedAt: Date;
    debt: Debt;
}
