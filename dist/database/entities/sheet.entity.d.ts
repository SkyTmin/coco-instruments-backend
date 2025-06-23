import { User } from './user.entity';
import { Expense } from './expense.entity';
export declare enum SheetType {
    INCOME = "income",
    PRELIMINARY = "preliminary"
}
export declare class Sheet {
    id: string;
    name: string;
    amount: number;
    date: Date;
    note: string | null;
    type: SheetType;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    expenses: Expense[];
}
