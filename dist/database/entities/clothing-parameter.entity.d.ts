import { User } from './user.entity';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    CHILD = "child"
}
export declare class ClothingParameter {
    id: string;
    gender: Gender;
    height: number | null;
    weight: number | null;
    chest: number | null;
    underbust: number | null;
    waist: number | null;
    hips: number | null;
    neck: number | null;
    foot: number | null;
    inseam: number | null;
    wrist: number | null;
    head: number | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
