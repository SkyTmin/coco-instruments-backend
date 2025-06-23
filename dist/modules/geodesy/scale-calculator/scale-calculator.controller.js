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
exports.ScaleCalculatorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scale_calculator_service_1 = require("./scale-calculator.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../../common/decorators/get-user.decorator");
const user_entity_1 = require("../../../database/entities/user.entity");
const calculate_scale_dto_1 = require("./dto/calculate-scale.dto");
const sync_history_dto_1 = require("./dto/sync-history.dto");
let ScaleCalculatorController = class ScaleCalculatorController {
    scaleCalculatorService;
    constructor(scaleCalculatorService) {
        this.scaleCalculatorService = scaleCalculatorService;
    }
    async calculate(user, calculateScaleDto) {
        return this.scaleCalculatorService.calculate(user.id, calculateScaleDto);
    }
    async getHistory(user) {
        return this.scaleCalculatorService.getHistory(user.id);
    }
    async syncHistory(user, syncHistoryDto) {
        return this.scaleCalculatorService.syncHistory(user.id, syncHistoryDto);
    }
    async clearHistory(user) {
        return this.scaleCalculatorService.clearHistory(user.id);
    }
};
exports.ScaleCalculatorController = ScaleCalculatorController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate scale or text height' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns calculation result' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        calculate_scale_dto_1.CalculateScaleDto]),
    __metadata("design:returntype", Promise)
], ScaleCalculatorController.prototype, "calculate", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get calculation history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns calculation history' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ScaleCalculatorController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync calculation history' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'History synced successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        sync_history_dto_1.SyncHistoryDto]),
    __metadata("design:returntype", Promise)
], ScaleCalculatorController.prototype, "syncHistory", null);
__decorate([
    (0, common_1.Delete)('history'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Clear calculation history' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'History cleared successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ScaleCalculatorController.prototype, "clearHistory", null);
exports.ScaleCalculatorController = ScaleCalculatorController = __decorate([
    (0, swagger_1.ApiTags)('Scale Calculator'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('geodesy/scale-calculator'),
    __metadata("design:paramtypes", [scale_calculator_service_1.ScaleCalculatorService])
], ScaleCalculatorController);
//# sourceMappingURL=scale-calculator.controller.js.map