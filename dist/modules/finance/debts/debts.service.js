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
exports.DebtsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const debt_entity_1 = require("../../../database/entities/debt.entity");
const payment_entity_1 = require("../../../database/entities/payment.entity");
let DebtsService = class DebtsService {
    debtRepository;
    paymentRepository;
    userCategories = new Map();
    constructor(debtRepository, paymentRepository) {
        this.debtRepository = debtRepository;
        this.paymentRepository = paymentRepository;
    }
    async getDebts(userId) {
        const query = this.debtRepository
            .createQueryBuilder('debt')
            .leftJoinAndSelect('debt.payments', 'payment')
            .where('debt.userId = :userId', { userId })
            .orderBy('debt.date', 'DESC');
        const debts = await query.getMany();
        return {
            success: true,
            data: debts.map(this.formatDebtForFrontend),
        };
    }
    async syncDebts(userId, syncDebtsDto) {
        const { debts } = syncDebtsDto;
        await this.debtRepository.delete({ userId });
        for (const debtData of debts) {
            const debt = this.debtRepository.create({
                id: debtData.id,
                name: debtData.name,
                amount: debtData.amount,
                date: new Date(debtData.date),
                category: debtData.category,
                status: debtData.status,
                note: debtData.note,
                userId,
            });
            const savedDebt = await this.debtRepository.save(debt);
            if (debtData.payments && debtData.payments.length > 0) {
                const payments = debtData.payments.map(paymentData => this.paymentRepository.create({
                    id: paymentData.id,
                    amount: paymentData.amount,
                    date: paymentData.date ? new Date(paymentData.date) : null,
                    note: paymentData.note,
                    preliminary: paymentData.preliminary,
                    debtId: savedDebt.id,
                }));
                await this.paymentRepository.save(payments);
            }
        }
        return {
            success: true,
            data: { message: 'Данные сохранены' },
        };
    }
    async getCategories(userId) {
        const userCategories = this.userCategories.get(userId) || [];
        return {
            success: true,
            data: userCategories,
        };
    }
    async syncCategories(userId, syncCategoriesDto) {
        const { categories } = syncCategoriesDto;
        this.userCategories.set(userId, categories);
        return {
            success: true,
            data: { message: 'Данные сохранены' },
        };
    }
    async createDebt(userId, createDebtDto) {
        const debt = this.debtRepository.create({
            ...createDebtDto,
            userId,
        });
        const savedDebt = await this.debtRepository.save(debt);
        return {
            success: true,
            data: this.formatDebtForFrontend(savedDebt),
        };
    }
    async updateDebt(userId, debtId, updateDebtDto) {
        const debt = await this.findUserDebt(userId, debtId);
        Object.assign(debt, updateDebtDto);
        const savedDebt = await this.debtRepository.save(debt);
        return {
            success: true,
            data: this.formatDebtForFrontend(savedDebt),
        };
    }
    async deleteDebt(userId, debtId) {
        const debt = await this.findUserDebt(userId, debtId);
        await this.debtRepository.remove(debt);
        return {
            success: true,
            data: { message: 'Долг удален' },
        };
    }
    async addPayment(userId, debtId, createPaymentDto) {
        const debt = await this.findUserDebt(userId, debtId);
        const payment = this.paymentRepository.create({
            ...createPaymentDto,
            debtId,
        });
        const savedPayment = await this.paymentRepository.save(payment);
        await this.updateDebtStatus(debt);
        return {
            success: true,
            data: savedPayment,
        };
    }
    async findUserDebt(userId, debtId) {
        const debt = await this.debtRepository.findOne({
            where: { id: debtId },
            relations: ['payments'],
        });
        if (!debt) {
            throw new common_1.NotFoundException('Debt not found');
        }
        if (debt.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return debt;
    }
    async updateDebtStatus(debt) {
        const regularPayments = debt.payments?.filter(p => !p.preliminary) || [];
        const totalPaid = regularPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const debtAmount = Number(debt.amount);
        let status;
        if (totalPaid >= debtAmount) {
            status = debt_entity_1.DebtStatus.CLOSED;
        }
        else if (totalPaid > 0) {
            status = debt_entity_1.DebtStatus.PARTIAL;
        }
        else {
            status = debt_entity_1.DebtStatus.ACTIVE;
        }
        if (debt.status !== status) {
            debt.status = status;
            await this.debtRepository.save(debt);
        }
    }
    formatDebtForFrontend(debt) {
        const payments = debt.payments || [];
        const regularPayments = payments.filter(p => !p.preliminary);
        const totalPaid = regularPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            id: debt.id,
            name: debt.name,
            amount: Number(debt.amount),
            date: debt.date.toISOString().split('T')[0],
            category: debt.category,
            status: debt.status,
            note: debt.note,
            payments: payments.map(payment => ({
                id: payment.id,
                amount: Number(payment.amount),
                date: payment.date ? payment.date.toISOString().split('T')[0] : '',
                note: payment.note,
                preliminary: payment.preliminary,
            })),
        };
    }
};
exports.DebtsService = DebtsService;
exports.DebtsService = DebtsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(debt_entity_1.Debt)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DebtsService);
//# sourceMappingURL=debts.service.js.map