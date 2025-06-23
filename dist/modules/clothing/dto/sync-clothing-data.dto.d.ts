declare class ClothingParametersDto {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    neck?: number;
    foot?: number;
    inseam?: number;
    wrist?: number;
    head?: number;
}
declare class SavedResultDto {
    category: string;
    date: string;
    parameters: ClothingParametersDto;
}
export declare class SyncClothingDataDto {
    parameters: ClothingParametersDto;
    savedResults: SavedResultDto[];
    currentGender: string;
}
export {};
