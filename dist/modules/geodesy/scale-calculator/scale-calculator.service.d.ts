import { Repository } from 'typeorm';
import { ScaleCalculation } from '@database/entities/scale-calculation.entity';
import { CalculateScaleDto } from './dto/calculate-scale.dto';
import { SyncHistoryDto } from './dto/sync-history.dto';
export declare class ScaleCalculatorService {
    private readonly calculationRepository;
    private readonly knownValues;
    constructor(calculationRepository: Repository<ScaleCalculation>);
    calculate(userId: string, calculateScaleDto: CalculateScaleDto): Promise<{
        data: {
            scale: number;
            textHeight: number;
        };
    }>;
    getHistory(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            scale: number;
            textHeight: number;
            createdAt: Date;
        }[];
    }>;
    syncHistory(userId: string, syncHistoryDto: SyncHistoryDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    clearHistory(userId: string): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    private calculateTextHeightFromScale;
    private calculateScaleFromTextHeight;
}
