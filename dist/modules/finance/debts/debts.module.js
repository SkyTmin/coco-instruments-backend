"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const debts_controller_1 = require("./debts.controller");
const debts_service_1 = require("./debts.service");
const debt_entity_1 = require("../../../database/entities/debt.entity");
const payment_entity_1 = require("../../../database/entities/payment.entity");
let DebtsModule = class DebtsModule {
};
exports.DebtsModule = DebtsModule;
exports.DebtsModule = DebtsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([debt_entity_1.Debt, payment_entity_1.Payment])],
        controllers: [debts_controller_1.DebtsController],
        providers: [debts_service_1.DebtsService],
        exports: [debts_service_1.DebtsService],
    })
], DebtsModule);
//# sourceMappingURL=debts.module.js.map