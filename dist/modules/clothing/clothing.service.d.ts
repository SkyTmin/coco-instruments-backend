import { Repository } from 'typeorm';
import { ClothingParameter, Gender } from '@database/entities/clothing-parameter.entity';
import { SyncClothingDataDto } from './dto/sync-clothing-data.dto';
export declare class ClothingService {
    private readonly parameterRepository;
    private userSavedResults;
    constructor(parameterRepository: Repository<ClothingParameter>);
    getClothingData(userId: string): Promise<{
        success: boolean;
        data: {
            parameters: {};
            savedResults: any[];
            currentGender: string;
        };
    } | {
        success: boolean;
        data: {
            parameters: {
                height: number | undefined;
                weight: number | undefined;
                chest: number | undefined;
                underbust: number | undefined;
                waist: number | undefined;
                hips: number | undefined;
                neck: number | undefined;
                foot: number | undefined;
                inseam: number | undefined;
                wrist: number | undefined;
                head: number | undefined;
            };
            savedResults: any[];
            currentGender: Gender;
        };
    }>;
    syncClothingData(userId: string, syncClothingDataDto: SyncClothingDataDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    private formatParameters;
}
