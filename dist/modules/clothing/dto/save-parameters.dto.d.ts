import { Gender } from '@database/entities/clothing-parameter.entity';
export declare class SaveParametersDto {
    gender: Gender;
    height?: number;
    weight?: number;
    chest?: number;
    underbust?: number;
    waist?: number;
    hips?: number;
    neck?: number;
    foot?: number;
    inseam?: number;
    wrist?: number;
    head?: number;
}
