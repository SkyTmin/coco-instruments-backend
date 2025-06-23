import { Sheet } from './sheet.entity';
export declare class Expense {
    id: string;
    name: string;
    amount: number;
    category: string | null;
    note: string | null;
    sheetId: string;
    createdAt: Date;
    updatedAt: Date;
    sheet: Sheet;
}
