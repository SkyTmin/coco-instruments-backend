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
exports.ClothingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clothing_service_1 = require("./clothing.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../common/decorators/get-user.decorator");
const user_entity_1 = require("../../database/entities/user.entity");
const sync_clothing_data_dto_1 = require("./dto/sync-clothing-data.dto");
let ClothingController = class ClothingController {
    clothingService;
    constructor(clothingService) {
        this.clothingService = clothingService;
    }
    async getClothingData(user) {
        return this.clothingService.getClothingData(user.id);
    }
    async syncClothingData(user, syncClothingDataDto) {
        return this.clothingService.syncClothingData(user.id, syncClothingDataDto);
    }
};
exports.ClothingController = ClothingController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user clothing data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user clothing data' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ClothingController.prototype, "getClothingData", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Sync clothing data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Clothing data synced successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        sync_clothing_data_dto_1.SyncClothingDataDto]),
    __metadata("design:returntype", Promise)
], ClothingController.prototype, "syncClothingData", null);
exports.ClothingController = ClothingController = __decorate([
    (0, swagger_1.ApiTags)('Clothing Size'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('clothing-size'),
    __metadata("design:paramtypes", [clothing_service_1.ClothingService])
], ClothingController);
//# sourceMappingURL=clothing.controller.js.map