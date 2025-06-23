"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CocoMoneyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const coco_money_controller_1 = require("./coco-money.controller");
const coco_money_service_1 = require("./coco-money.service");
const sheet_entity_1 = require("../../../database/entities/sheet.entity");
const expense_entity_1 = require("../../../database/entities/expense.entity");
let CocoMoneyModule = class CocoMoneyModule {
};
exports.CocoMoneyModule = CocoMoneyModule;
exports.CocoMoneyModule = CocoMoneyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sheet_entity_1.Sheet, expense_entity_1.Expense])],
        controllers: [coco_money_controller_1.CocoMoneyController],
        providers: [coco_money_service_1.CocoMoneyService],
        exports: [coco_money_service_1.CocoMoneyService],
    })
], CocoMoneyModule);
//# sourceMappingURL=coco-money.module.js.map