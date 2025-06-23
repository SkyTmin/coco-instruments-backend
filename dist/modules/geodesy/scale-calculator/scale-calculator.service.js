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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaleCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scale_calculation_entity_1 = require("../../../database/entities/scale-calculation.entity");
let ScaleCalculatorService = class ScaleCalculatorService {
    calculationRepository;
    knownValues = {
        scale1: 1000,
        height1: 2.5,
        scale2: 100,
        height2: 0.250,
    };
    constructor(calculationRepository) {
        this.calculationRepository = calculationRepository;
    }
    async calculate(userId, calculateScaleDto) {
        const { type, value } = calculateScaleDto;
        let result;
        if (type === 'scale') {
            const textHeight = this.calculateTextHeightFromScale(value);
            result = { scale: value, textHeight };
        }
        else {
            const scale = this.calculateScaleFromTextHeight(value);
            result = { scale, textHeight: value };
        }
        const calculation = this.calculationRepository.create({
            scale: result.scale,
            textHeight: result.textHeight,
            userId,
        });
        await this.calculationRepository.save(calculation);
        return {
            data: result,
        };
    }
    async getHistory(userId) {
        const calculations = await this.calculationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 20,
        });
        return {
            success: true,
            data: calculations.map(calc => ({
                id: calc.id,
                scale: calc.scale,
                textHeight: Number(calc.textHeight),
                createdAt: calc.createdAt,
            })),
        };
    }
    async syncHistory(userId, syncHistoryDto) {
        const { history } = syncHistoryDto;
        await this.calculationRepository.delete({ userId });
        const calculations = history.map(item => this.calculationRepository.create({
            scale: item.scale,
            textHeight: item.textHeight,
            userId,
            createdAt: new Date(item.timestamp),
        }));
        if (calculations.length > 0) {
            await this.calculationRepository.save(calculations);
        }
        return {
            success: true,
            data: { message: 'История синхронизирована' },
        };
    }
    async clearHistory(userId) {
        await this.calculationRepository.delete({ userId });
        return {
            success: true,
            data: { message: 'История очищена' },
        };
    }
    calculateTextHeightFromScale(scale) {
        const { scale1, height1, scale2, height2 } = this.knownValues;
        const logScale = Math.log(scale);
        const logScale1 = Math.log(scale1);
        const logScale2 = Math.log(scale2);
        const logHeight1 = Math.log(height1);
        const logHeight2 = Math.log(height2);
        const t = (logScale - logScale1) / (logScale2 - logScale1);
        const logHeight = logHeight1 + t * (logHeight2 - logHeight1);
        const height = Math.exp(logHeight);
        return Math.round(height * 1000) / 1000;
    }
    calculateScaleFromTextHeight(textHeight) {
        const { scale1, height1, scale2, height2 } = this.knownValues;
        const logHeight = Math.log(textHeight);
        const logHeight1 = Math.log(height1);
        const logHeight2 = Math.log(height2);
        const logScale1 = Math.log(scale1);
        const logScale2 = Math.log(scale2);
        const t = (logHeight - logHeight1) / (logHeight2 - logHeight1);
        const logScale = logScale1 + t * (logScale2 - logScale1);
        const scale = Math.exp(logScale);
        return Math.round(scale);
    }
};
exports.ScaleCalculatorService = ScaleCalculatorService;
exports.ScaleCalculatorService = ScaleCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scale_calculation_entity_1.ScaleCalculation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScaleCalculatorService);
//# sourceMappingURL=scale-calculator.service.js.map