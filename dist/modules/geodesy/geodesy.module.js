"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeodesyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const scale_calculator_controller_1 = require("./scale-calculator/scale-calculator.controller");
const scale_calculator_service_1 = require("./scale-calculator/scale-calculator.service");
const scale_calculation_entity_1 = require("../../database/entities/scale-calculation.entity");
let GeodesyModule = class GeodesyModule {
};
exports.GeodesyModule = GeodesyModule;
exports.GeodesyModule = GeodesyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([scale_calculation_entity_1.ScaleCalculation])],
        controllers: [scale_calculator_controller_1.ScaleCalculatorController],
        providers: [scale_calculator_service_1.ScaleCalculatorService],
        exports: [scale_calculator_service_1.ScaleCalculatorService],
    })
], GeodesyModule);
//# sourceMappingURL=geodesy.module.js.map