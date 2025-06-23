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
exports.CalculateScaleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CalculateScaleDto {
    type;
    value;
}
exports.CalculateScaleDto = CalculateScaleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'scale',
        description: 'Type of input value',
        enum: ['scale', 'height']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['scale', 'height']),
    __metadata("design:type", String)
], CalculateScaleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 500,
        description: 'Scale value (if type is scale) or text height in mm (if type is height)'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CalculateScaleDto.prototype, "value", void 0);
//# sourceMappingURL=calculate-scale.dto.js.map