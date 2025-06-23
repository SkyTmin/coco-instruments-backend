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
exports.CocoMoneyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coco_money_service_1 = require("./coco-money.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../../common/decorators/get-user.decorator");
const user_entity_1 = require("../../../database/entities/user.entity");
const create_sheet_dto_1 = require("./dto/create-sheet.dto");
const update_sheet_dto_1 = require("./dto/update-sheet.dto");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const sync_sheets_dto_1 = require("./dto/sync-sheets.dto");
const sync_categories_dto_1 = require("./dto/sync-categories.dto");
let CocoMoneyController = class CocoMoneyController {
    cocoMoneyService;
    constructor(cocoMoneyService) {
        this.cocoMoneyService = cocoMoneyService;
    }
    async getSheets(user) {
        return this.cocoMoneyService.getSheets(user.id);
    }
    async syncSheets(user, syncSheetsDto) {
        return this.cocoMoneyService.syncSheets(user.id, syncSheetsDto);
    }
    async getCategories(user) {
        return this.cocoMoneyService.getCategories(user.id);
    }
    async syncCategories(user, syncCategoriesDto) {
        return this.cocoMoneyService.syncCategories(user.id, syncCategoriesDto);
    }
    async createSheet(user, createSheetDto) {
        return this.cocoMoneyService.createSheet(user.id, createSheetDto);
    }
    async updateSheet(user, id, updateSheetDto) {
        return this.cocoMoneyService.updateSheet(user.id, id, updateSheetDto);
    }
    async deleteSheet(user, id) {
        return this.cocoMoneyService.deleteSheet(user.id, id);
    }
    async addExpense(user, sheetId, createExpenseDto) {
        return this.cocoMoneyService.addExpense(user.id, sheetId, createExpenseDto);
    }
    async deleteExpense(user, sheetId, expenseId) {
        return this.cocoMoneyService.deleteExpense(user.id, sheetId, expenseId);
    }
    async updateExpense(user, sheetId, expenseId, updateExpenseDto) {
        return this.cocoMoneyService.updateExpense(user.id, sheetId, expenseId, updateExpenseDto);
    }
    async createCategory(user, createCategoryDto) {
        return this.cocoMoneyService.createCategory(user.id, createCategoryDto);
    }
};
exports.CocoMoneyController = CocoMoneyController;
__decorate([
    (0, common_1.Get)('sheets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sheets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns sheets' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "getSheets", null);
__decorate([
    (0, common_1.Post)('sheets'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync sheets data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sheets synced successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        sync_sheets_dto_1.SyncSheetsDto]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "syncSheets", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns categories' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync categories data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Categories synced successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        sync_categories_dto_1.SyncCategoriesDto]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "syncCategories", null);
__decorate([
    (0, common_1.Post)('sheets/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new sheet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sheet created successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_sheet_dto_1.CreateSheetDto]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "createSheet", null);
__decorate([
    (0, common_1.Put)('sheets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update sheet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sheet updated successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, update_sheet_dto_1.UpdateSheetDto]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "updateSheet", null);
__decorate([
    (0, common_1.Delete)('sheets/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete sheet' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Sheet deleted successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "deleteSheet", null);
__decorate([
    (0, common_1.Post)('sheets/:sheetId/expenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Add expense to sheet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Expense added successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('sheetId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "addExpense", null);
__decorate([
    (0, common_1.Delete)('sheets/:sheetId/expenses/:expenseId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete expense from sheet' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Expense deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('sheetId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('expenseId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Put)('sheets/:sheetId/expenses/:expenseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update expense in sheet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('sheetId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('expenseId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Post)('categories/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CocoMoneyController.prototype, "createCategory", null);
exports.CocoMoneyController = CocoMoneyController = __decorate([
    (0, swagger_1.ApiTags)('Coco Money'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('coco-money'),
    __metadata("design:paramtypes", [coco_money_service_1.CocoMoneyService])
], CocoMoneyController);
//# sourceMappingURL=coco-money.controller.js.map