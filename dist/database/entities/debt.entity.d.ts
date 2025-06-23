import { User } from './user.entity';
import { Payment } from './payment.entity';
export declare enum DebtStatus {
    ACTIVE = "active",
    PARTIAL = "partial",
    CLOSED = "closed"
}
export declare class Debt {
    id: string;
    name: string;
    amount: number;
    date: Date;
    category: string | null;
    status: DebtStatus;
    note: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    payments: Payment[];
}
