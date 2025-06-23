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
exports.SyncHistoryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class HistoryItemDto {
    id;
    scale;
    textHeight;
    timestamp;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1642234567890 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HistoryItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HistoryItemDto.prototype, "scale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.25 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HistoryItemDto.prototype, "textHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-15T10:30:00Z' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HistoryItemDto.prototype, "timestamp", void 0);
class SyncHistoryDto {
    history;
}
exports.SyncHistoryDto = SyncHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [HistoryItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HistoryItemDto),
    __metadata("design:type", Array)
], SyncHistoryDto.prototype, "history", void 0);
//# sourceMappingURL=sync-history.dto.js.map