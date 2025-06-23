import { ClothingService } from './clothing.service';
import { User } from '@database/entities/user.entity';
import { SyncClothingDataDto } from './dto/sync-clothing-data.dto';
export declare class ClothingController {
    private readonly clothingService;
    constructor(clothingService: ClothingService);
    getClothingData(user: User): Promise<{
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
            currentGender: import("../../database/entities/clothing-parameter.entity").Gender;
        };
    }>;
    syncClothingData(user: User, syncClothingDataDto: SyncClothingDataDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
}
