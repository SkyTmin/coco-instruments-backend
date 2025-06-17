import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt, DebtStatus } from '@database/entities/debt.entity';
import { Payment } from '@database/entities/payment.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SyncDebtsDto } from './dto/sync-debts.dto';
import { SyncDebtCategoriesDto } from './dto/sync-debt-categories.dto';

@Injectable()
export class DebtsService {
  private userCategories: Map<string, Array<{ id: string; name: string }>> = new Map();

  constructor(
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDebts(userId: string) {
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

  async syncDebts(userId: string, syncDebtsDto: SyncDebtsDto) {
    const { debts } = syncDebtsDto;

    // Удаляем все существующие долги пользователя
    await this.debtRepository.delete({ userId });

    // Создаем новые долги
    for (const debtData of debts) {
      const debt = this.debtRepository.create({
        id: debtData.id,
        name: debtData.name,
        amount: debtData.amount,
        date: new Date(debtData.date),
        category: debtData.category,
        status: debtData.status as DebtStatus,
        note: debtData.note,
        userId,
      });

      const savedDebt = await this.debtRepository.save(debt);

      // Создаем платежи для долга
      if (debtData.payments && debtData.payments.length > 0) {
        const payments = debtData.payments.map(paymentData =>
          this.paymentRepository.create({
            id: paymentData.id,
            amount: paymentData.amount,
            date: paymentData.date ? new Date(paymentData.date) : null,
            note: paymentData.note,
            preliminary: paymentData.preliminary,
            debtId: savedDebt.id,
          })
        );

        await this.paymentRepository.save(payments);
      }
    }

    return {
      success: true,
      data: { message: 'Данные сохранены' },
    };
  }

  async getCategories(userId: string) {
    const userCategories = this.userCategories.get(userId) || [];
    
    return {
      success: true,
      data: userCategories,
    };
  }

  async syncCategories(userId: string, syncCategoriesDto: SyncDebtCategoriesDto) {
    const { categories } = syncCategoriesDto;
    
    this.userCategories.set(userId, categories);

    return {
      success: true,
      data: { message: 'Данные сохранены' },
    };
  }

  async createDebt(userId: string, createDebtDto: CreateDebtDto) {
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

  async updateDebt(userId: string, debtId: string, updateDebtDto: UpdateDebtDto) {
    const debt = await this.findUserDebt(userId, debtId);

    Object.assign(debt, updateDebtDto);

    const savedDebt = await this.debtRepository.save(debt);

    return {
      success: true,
      data: this.formatDebtForFrontend(savedDebt),
    };
  }

  async deleteDebt(userId: string, debtId: string) {
    const debt = await this.findUserDebt(userId, debtId);

    await this.debtRepository.remove(debt);

    return {
      success: true,
      data: { message: 'Долг удален' },
    };
  }

  async addPayment(userId: string, debtId: string, createPaymentDto: CreatePaymentDto) {
    const debt = await this.findUserDebt(userId, debtId);

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      debtId,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Update debt status
    await this.updateDebtStatus(debt);

    return {
      success: true,
      data: savedPayment,
    };
  }

  private async findUserDebt(userId: string, debtId: string): Promise<Debt> {
    const debt = await this.debtRepository.findOne({
      where: { id: debtId },
      relations: ['payments'],
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    if (debt.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return debt;
  }

  private async updateDebtStatus(debt: Debt) {
    const regularPayments = debt.payments?.filter(p => !p.preliminary) || [];
    const totalPaid = regularPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const debtAmount = Number(debt.amount);

    let status: DebtStatus;
    if (totalPaid >= debtAmount) {
      status = DebtStatus.CLOSED;
    } else if (totalPaid > 0) {
      status = DebtStatus.PARTIAL;
    } else {
      status = DebtStatus.ACTIVE;
    }

    if (debt.status !== status) {
      debt.status = status;
      await this.debtRepository.save(debt);
    }
  }

  private formatDebtForFrontend(debt: Debt) {
    const payments = debt.payments || [];
    const regularPayments = payments.filter(p => !p.preliminary);
    const totalPaid = regularPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      id: debt.id,
      name: debt.name,
      amount: Number(debt.amount),
      date: debt.date.toISOString().split('T')[0], // Форматируем дату как YYYY-MM-DD
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
}
