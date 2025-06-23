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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const sheet_entity_1 = require("./sheet.entity");
const debt_entity_1 = require("./debt.entity");
const clothing_parameter_entity_1 = require("./clothing-parameter.entity");
const scale_calculation_entity_1 = require("./scale-calculation.entity");
let User = class User {
    id;
    email;
    name;
    password;
    refreshToken;
    isActive;
    createdAt;
    updatedAt;
    sheets;
    debts;
    clothingParameters;
    scaleCalculations;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sheet_entity_1.Sheet, (sheet) => sheet.user),
    __metadata("design:type", Array)
], User.prototype, "sheets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => debt_entity_1.Debt, (debt) => debt.user),
    __metadata("design:type", Array)
], User.prototype, "debts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => clothing_parameter_entity_1.ClothingParameter, (param) => param.user),
    __metadata("design:type", Array)
], User.prototype, "clothingParameters", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scale_calculation_entity_1.ScaleCalculation, (calc) => calc.user),
    __metadata("design:type", Array)
], User.prototype, "scaleCalculations", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map