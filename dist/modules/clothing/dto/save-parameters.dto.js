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
exports.SaveParametersDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const clothing_parameter_entity_1 = require("../../../database/entities/clothing-parameter.entity");
const class_transformer_1 = require("class-transformer");
class SaveParametersDto {
    gender;
    height;
    weight;
    chest;
    underbust;
    waist;
    hips;
    neck;
    foot;
    inseam;
    wrist;
    head;
}
exports.SaveParametersDto = SaveParametersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: clothing_parameter_entity_1.Gender, example: clothing_parameter_entity_1.Gender.MALE }),
    (0, class_validator_1.IsEnum)(clothing_parameter_entity_1.Gender),
    __metadata("design:type", String)
], SaveParametersDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 175, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(250),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 70, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(300),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 96, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(200),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "chest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(200),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "underbust", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(200),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "waist", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 98, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(200),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "hips", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 38, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(80),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "neck", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 26, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(50),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "foot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 81, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(120),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "inseam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 17, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(30),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "wrist", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 56, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(40),
    (0, class_validator_1.Max)(70),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : null),
    __metadata("design:type", Number)
], SaveParametersDto.prototype, "head", void 0);
//# sourceMappingURL=save-parameters.dto.js.map