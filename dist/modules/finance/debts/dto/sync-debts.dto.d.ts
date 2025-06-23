declare class PaymentDataDto {
    id: string;
    amount: number;
    date: string;
    note?: string;
    preliminary: boolean;
}
declare class DebtDataDto {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
    status: string;
    note?: string;
    payments: PaymentDataDto[];
}
export declare class SyncDebtsDto {
    debts: DebtDataDto[];
}
export {};
