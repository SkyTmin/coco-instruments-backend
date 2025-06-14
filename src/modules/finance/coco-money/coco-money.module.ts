import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CocoMoneyController } from './coco-money.controller';
import { CocoMoneyService } from './coco-money.service';
import { Sheet } from '@database/entities/sheet.entity';
import { Expense } from '@database/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sheet, Expense])],
  controllers: [CocoMoneyController],
  providers: [CocoMoneyService],
  exports: [CocoMoneyService],
})
export class CocoMoneyModule {}