import { SheetType } from '@database/entities/sheet.entity';
export declare class CreateSheetDto {
    name: string;
    amount: number;
    date: string;
    note?: string;
    type: SheetType;
}
