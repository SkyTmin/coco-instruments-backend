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

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDebts(userId: string, sort?: string, status?: DebtStatus) {
    const query = this.debtRepository
      .createQueryBuilder('debt')
      .leftJoinAndSelect('debt.payments', 'payment')
      .where('debt.userId = :userId', { userId });

    if (status) {
      query.andWhere('debt.status = :status', { status });
    }

    // Apply sorting
    switch (sort) {
      case 'date-asc':
        query.orderBy('debt.date', 'ASC');
        break;
      case 'amount-desc':
        query.orderBy('debt.amount', 'DESC');
        break;
      case 'amount-asc':
        query.orderBy('debt.amount', 'ASC');
        break;
      case 'status':
        query.orderBy('debt.status', 'ASC');
        break;
      default: // date-desc
        query.orderBy('debt.date', 'DESC');
    }

    const debts = await query.getMany();

    return {
      data: debts.map(this.formatDebt),
    };
  }

  async createDebt(userId: string, createDebtDto: CreateDebtDto) {
    const debt = this.debtRepository.create({
      ...createDebtDto,
      userId,
    });

    const savedDebt = await this.debtRepository.save(debt);

    return {
      data: this.formatDebt(savedDebt),
    };
  }

  async updateDebt(userId: string, debtId: string, updateDebtDto: UpdateDebtDto) {
    const debt = await this.findUserDebt(userId, debtId);

    Object.assign(debt, updateDebtDto);

    const savedDebt = await this.debtRepository.save(debt);

    return {
      data: this.formatDebt(savedDebt),
    };
  }

  async deleteDebt(userId: string, debtId: string) {
    const debt = await this.findUserDebt(userId, debtId);

    await this.debtRepository.remove(debt);
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

  private formatDebt(debt: Debt) {
    const payments = debt.payments || [];
    const regularPayments = payments.filter(p => !p.preliminary);
    const totalPaid = regularPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      id: debt.id,
      name: debt.name,
      amount: Number(debt.amount),
      date: debt.date,
      category: debt.category,
      status: debt.status,
      note: debt.note,
      payments: payments.map(payment => ({
        id: payment.id,
        amount: Number(payment.amount),
        date: payment.date,
        note: payment.note,
        preliminary: payment.preliminary,
      })),
      totalPaid,
      remaining: Math.max(0, Number(debt.amount) - totalPaid),
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    };
  }
}