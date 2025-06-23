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
exports.DebtsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const debts_service_1 = require("./debts.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../../common/decorators/get-user.decorator");
const user_entity_1 = require("../../../database/entities/user.entity");
const create_debt_dto_1 = require("./dto/create-debt.dto");
const update_debt_dto_1 = require("./dto/update-debt.dto");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const sync_debts_dto_1 = require("./dto/sync-debts.dto");
const sync_debt_categories_dto_1 = require("./dto/sync-debt-categories.dto");
let DebtsController = class DebtsController {
    debtsService;
    constructor(debtsService) {
        this.debtsService = debtsService;
    }
    async getDebts(user) {
        return this.debtsService.getDebts(user.id);
    }
    async syncDebts(user, syncDebtsDto) {
        return this.debtsService.syncDebts(user.id, syncDebtsDto);
    }
    async getCategories(user) {
        return this.debtsService.getCategories(user.id);
    }
    async syncCategories(user, syncDebtCategoriesDto) {
        return this.debtsService.syncCategories(user.id, syncDebtCategoriesDto);
    }
    async createDebt(user, createDebtDto) {
        return this.debtsService.createDebt(user.id, createDebtDto);
    }
    async updateDebt(user, id, updateDebtDto) {
        return this.debtsService.updateDebt(user.id, id, updateDebtDto);
    }
    async deleteDebt(user, id) {
        return this.debtsService.deleteDebt(user.id, id);
    }
    async addPayment(user, debtId, createPaymentDto) {
        return this.debtsService.addPayment(user.id, debtId, createPaymentDto);
    }
};
exports.DebtsController = DebtsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all debts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns debts' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getDebts", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Sync debts data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Debts synced successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        sync_debts_dto_1.SyncDebtsDto]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "syncDebts", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get debt categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns debt categories' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync debt categories' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Categories synced successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        sync_debt_categories_dto_1.SyncDebtCategoriesDto]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "syncCategories", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new debt' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Debt created successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_debt_dto_1.CreateDebtDto]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "createDebt", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update debt' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Debt updated successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, update_debt_dto_1.UpdateDebtDto]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "updateDebt", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete debt' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Debt deleted successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "deleteDebt", null);
__decorate([
    (0, common_1.Post)(':debtId/payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Add payment to debt' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment added successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('debtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "addPayment", null);
exports.DebtsController = DebtsController = __decorate([
    (0, swagger_1.ApiTags)('Debts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('debts'),
    __metadata("design:paramtypes", [debts_service_1.DebtsService])
], DebtsController);
//# sourceMappingURL=debts.controller.js.map