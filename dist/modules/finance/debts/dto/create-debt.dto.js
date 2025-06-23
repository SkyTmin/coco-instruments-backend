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
exports.CreateDebtDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const debt_entity_1 = require("../../../../database/entities/debt.entity");
const class_transformer_1 = require("class-transformer");
class CreateDebtDto {
    name;
    amount;
    date;
    category;
    status;
    note;
}
exports.CreateDebtDto = CreateDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Кредит на машину' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], CreateDebtDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bank', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: debt_entity_1.DebtStatus, example: debt_entity_1.DebtStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(debt_entity_1.DebtStatus),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Банк ВТБ, процентная ставка 12%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "note", void 0);
//# sourceMappingURL=create-debt.dto.js.map