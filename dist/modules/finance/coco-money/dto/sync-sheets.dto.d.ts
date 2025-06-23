declare class SheetExpenseDto {
    name: string;
    amount: number;
    category: string;
    note?: string;
}
declare class SheetDataDto {
    id: string;
    name: string;
    amount: number;
    date: string;
    note?: string;
    expenses: SheetExpenseDto[];
}
declare class SheetsDataDto {
    income: SheetDataDto[];
    preliminary: SheetDataDto[];
}
export declare class SyncSheetsDto {
    sheets: SheetsDataDto;
}
export {};
