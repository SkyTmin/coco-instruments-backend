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
exports.ClothingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const clothing_parameter_entity_1 = require("../../database/entities/clothing-parameter.entity");
let ClothingService = class ClothingService {
    parameterRepository;
    userSavedResults = new Map();
    constructor(parameterRepository) {
        this.parameterRepository = parameterRepository;
    }
    async getClothingData(userId) {
        const parameters = await this.parameterRepository.findOne({
            where: { userId },
        });
        const savedResults = this.userSavedResults.get(userId) || [];
        if (!parameters) {
            return {
                success: true,
                data: {
                    parameters: {},
                    savedResults,
                    currentGender: 'male',
                },
            };
        }
        return {
            success: true,
            data: {
                parameters: this.formatParameters(parameters),
                savedResults,
                currentGender: parameters.gender,
            },
        };
    }
    async syncClothingData(userId, syncClothingDataDto) {
        const { parameters, savedResults, currentGender } = syncClothingDataDto;
        let clothingParameters = await this.parameterRepository.findOne({
            where: { userId },
        });
        if (!clothingParameters) {
            clothingParameters = this.parameterRepository.create({
                userId,
                gender: currentGender,
                ...parameters,
            });
        }
        else {
            Object.assign(clothingParameters, {
                gender: currentGender,
                ...parameters,
            });
        }
        await this.parameterRepository.save(clothingParameters);
        this.userSavedResults.set(userId, savedResults);
        return {
            success: true,
            data: { message: 'Данные сохранены' },
        };
    }
    formatParameters(parameters) {
        return {
            height: parameters.height ? Number(parameters.height) : undefined,
            weight: parameters.weight ? Number(parameters.weight) : undefined,
            chest: parameters.chest ? Number(parameters.chest) : undefined,
            underbust: parameters.underbust ? Number(parameters.underbust) : undefined,
            waist: parameters.waist ? Number(parameters.waist) : undefined,
            hips: parameters.hips ? Number(parameters.hips) : undefined,
            neck: parameters.neck ? Number(parameters.neck) : undefined,
            foot: parameters.foot ? Number(parameters.foot) : undefined,
            inseam: parameters.inseam ? Number(parameters.inseam) : undefined,
            wrist: parameters.wrist ? Number(parameters.wrist) : undefined,
            head: parameters.head ? Number(parameters.head) : undefined,
        };
    }
};
exports.ClothingService = ClothingService;
exports.ClothingService = ClothingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(clothing_parameter_entity_1.ClothingParameter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClothingService);
//# sourceMappingURL=clothing.service.js.map