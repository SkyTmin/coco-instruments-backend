import { Sheet } from './sheet.entity';
import { Debt } from './debt.entity';
import { ClothingParameter } from './clothing-parameter.entity';
import { ScaleCalculation } from './scale-calculation.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    refreshToken: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    sheets: Sheet[];
    debts: Debt[];
    clothingParameters: ClothingParameter[];
    scaleCalculations: ScaleCalculation[];
}
