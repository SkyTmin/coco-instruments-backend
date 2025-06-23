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
exports.SyncSheetsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class SheetExpenseDto {
    name;
    amount;
    category;
    note;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Транспорт' }),
    __metadata("design:type", String)
], SheetExpenseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    __metadata("design:type", Number)
], SheetExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'transport' }),
    __metadata("design:type", String)
], SheetExpenseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Проездной' }),
    __metadata("design:type", String)
], SheetExpenseDto.prototype, "note", void 0);
class SheetDataDto {
    id;
    name;
    amount;
    date;
    note;
    expenses;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    __metadata("design:type", String)
], SheetDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Зарплата за январь' }),
    __metadata("design:type", String)
], SheetDataDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000 }),
    __metadata("design:type", Number)
], SheetDataDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-15' }),
    __metadata("design:type", String)
], SheetDataDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Основная зарплата' }),
    __metadata("design:type", String)
], SheetDataDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SheetExpenseDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SheetExpenseDto),
    __metadata("design:type", Array)
], SheetDataDto.prototype, "expenses", void 0);
class SheetsDataDto {
    income;
    preliminary;
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SheetDataDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SheetDataDto),
    __metadata("design:type", Array)
], SheetsDataDto.prototype, "income", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SheetDataDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SheetDataDto),
    __metadata("design:type", Array)
], SheetsDataDto.prototype, "preliminary", void 0);
class SyncSheetsDto {
    sheets;
}
exports.SyncSheetsDto = SyncSheetsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: SheetsDataDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SheetsDataDto),
    __metadata("design:type", SheetsDataDto)
], SyncSheetsDto.prototype, "sheets", void 0);
//# sourceMappingURL=sync-sheets.dto.js.map