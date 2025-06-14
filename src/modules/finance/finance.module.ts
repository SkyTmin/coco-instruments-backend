import { Module } from '@nestjs/common';
import { CocoMoneyModule } from './coco-money/coco-money.module';
import { DebtsModule } from './debts/debts.module';

@Module({
  imports: [CocoMoneyModule, DebtsModule],
  exports: [CocoMoneyModule, DebtsModule],
})
export class FinanceModule {}