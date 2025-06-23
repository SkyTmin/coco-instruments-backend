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
exports.Sheet = exports.SheetType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const expense_entity_1 = require("./expense.entity");
var SheetType;
(function (SheetType) {
    SheetType["INCOME"] = "income";
    SheetType["PRELIMINARY"] = "preliminary";
})(SheetType || (exports.SheetType = SheetType = {}));
let Sheet = class Sheet {
    id;
    name;
    amount;
    date;
    note;
    type;
    userId;
    createdAt;
    updatedAt;
    user;
    expenses;
};
exports.Sheet = Sheet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Sheet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Sheet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Sheet.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Sheet.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Sheet.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SheetType,
        default: SheetType.INCOME,
    }),
    __metadata("design:type", String)
], Sheet.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Sheet.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sheet.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sheet.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sheets, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Sheet.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_entity_1.Expense, (expense) => expense.sheet, { cascade: true }),
    __metadata("design:type", Array)
], Sheet.prototype, "expenses", void 0);
exports.Sheet = Sheet = __decorate([
    (0, typeorm_1.Entity)('sheets'),
    (0, typeorm_1.Index)(['userId', 'type'])
], Sheet);
//# sourceMappingURL=sheet.entity.js.map