"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncClothingDataDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ClothingParametersDto {
    height;
    weight;
    chest;
    waist;
    hips;
    neck;
    foot;
    inseam;
    wrist;
    head;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 170, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 70, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 96, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "chest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "waist", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 98, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "hips", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 38, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "neck", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 26, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "foot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 81, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "inseam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 17, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "wrist", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 56, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClothingParametersDto.prototype, "head", void 0);
class SavedResultDto {
    category;
    date;
    parameters;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'outerwear' }),
    __metadata("design:type", String)
], SavedResultDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-15T10:30:00Z' }),
    __metadata("design:type", String)
], SavedResultDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClothingParametersDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ClothingParametersDto),
    __metadata("design:type", ClothingParametersDto)
], SavedResultDto.prototype, "parameters", void 0);
class SyncClothingDataDto {
    parameters;
    savedResults;
    currentGender;
}
exports.SyncClothingDataDto = SyncClothingDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClothingParametersDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ClothingParametersDto),
    __metadata("design:type", ClothingParametersDto)
], SyncClothingDataDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SavedResultDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SavedResultDto),
    __metadata("design:type", Array)
], SyncClothingDataDto.prototype, "savedResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'male' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncClothingDataDto.prototype, "currentGender", void 0);
//# sourceMappingURL=sync-clothing-data.dto.js.map