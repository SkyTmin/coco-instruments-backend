declare class CalculationParametersDto {
    chest?: number;
    neck?: number;
    waist?: number;
    inseam?: number;
    foot?: number;
    underbust?: number;
}
export declare class CalculateSizeDto {
    category: string;
    parameters: CalculationParametersDto;
}
export {};
