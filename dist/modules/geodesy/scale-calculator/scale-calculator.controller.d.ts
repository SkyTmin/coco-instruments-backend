import { ScaleCalculatorService } from './scale-calculator.service';
import { User } from '@database/entities/user.entity';
import { CalculateScaleDto } from './dto/calculate-scale.dto';
import { SyncHistoryDto } from './dto/sync-history.dto';
export declare class ScaleCalculatorController {
    private readonly scaleCalculatorService;
    constructor(scaleCalculatorService: ScaleCalculatorService);
    calculate(user: User, calculateScaleDto: CalculateScaleDto): Promise<{
        data: {
            scale: number;
            textHeight: number;
        };
    }>;
    getHistory(user: User): Promise<{
        success: boolean;
        data: {
            id: string;
            scale: number;
            textHeight: number;
            createdAt: Date;
        }[];
    }>;
    syncHistory(user: User, syncHistoryDto: SyncHistoryDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    clearHistory(user: User): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
}
