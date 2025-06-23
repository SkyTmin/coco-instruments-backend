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
exports.SyncDebtsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class PaymentDataDto {
    id;
    amount;
    date;
    note;
    preliminary;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'payment-1' }),
    __metadata("design:type", String)
], PaymentDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000 }),
    __metadata("design:type", Number)
], PaymentDataDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-15' }),
    __metadata("design:type", String)
], PaymentDataDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Первый платеж' }),
    __metadata("design:type", String)
], PaymentDataDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], PaymentDataDto.prototype, "preliminary", void 0);
class DebtDataDto {
    id;
    name;
    amount;
    date;
    category;
    status;
    note;
    payments;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'debt-1' }),
    __metadata("design:type", String)
], DebtDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Кредит на машину' }),
    __metadata("design:type", String)
], DebtDataDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000 }),
    __metadata("design:type", Number)
], DebtDataDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01' }),
    __metadata("design:type", String)
], DebtDataDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'personal' }),
    __metadata("design:type", String)
], DebtDataDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    __metadata("design:type", String)
], DebtDataDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Автокредит в банке' }),
    __metadata("design:type", String)
], DebtDataDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PaymentDataDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentDataDto),
    __metadata("design:type", Array)
], DebtDataDto.prototype, "payments", void 0);
class SyncDebtsDto {
    debts;
}
exports.SyncDebtsDto = SyncDebtsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DebtDataDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DebtDataDto),
    __metadata("design:type", Array)
], SyncDebtsDto.prototype, "debts", void 0);
//# sourceMappingURL=sync-debts.dto.js.map