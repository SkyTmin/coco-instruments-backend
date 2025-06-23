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
exports.CalculateSizeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CalculationParametersDto {
    chest;
    neck;
    waist;
    inseam;
    foot;
    underbust;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 96, required: false }),
    __metadata("design:type", Number)
], CalculationParametersDto.prototype, "chest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 38, required: false }),
    __metadata("design:type", Number)
], CalculationParametersDto.prototype, "neck", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80, required: false }),
    __metadata("design:type", Number)
], CalculationParametersDto.prototype, "waist", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 81, required: false }),
    __metadata("design:type", Number)
], CalculationParametersDto.prototype, "inseam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 26, required: false }),
    __metadata("design:type", Number)
], CalculationParametersDto.prototype, "foot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75, required: false }),
    __metadata("design:type", Number)
], CalculationParametersDto.prototype, "underbust", void 0);
class CalculateSizeDto {
    category;
    parameters;
}
exports.CalculateSizeDto = CalculateSizeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'outerwear',
        enum: ['outerwear', 'shirts', 'pants', 'shoes', 'underwear']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['outerwear', 'shirts', 'pants', 'shoes', 'underwear']),
    __metadata("design:type", String)
], CalculateSizeDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CalculationParametersDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CalculationParametersDto),
    __metadata("design:type", CalculationParametersDto)
], CalculateSizeDto.prototype, "parameters", void 0);
//# sourceMappingURL=calculate-size.dto.js.map