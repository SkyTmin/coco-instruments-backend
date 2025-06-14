import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { Debt } from '@database/entities/debt.entity';
import { Payment } from '@database/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Debt, Payment])],
  controllers: [DebtsController],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}