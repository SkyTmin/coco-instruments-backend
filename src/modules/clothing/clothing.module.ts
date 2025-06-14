import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingController } from './clothing.controller';
import { ClothingService } from './clothing.service';
import { ClothingParameter } from '@database/entities/clothing-parameter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClothingParameter])],
  controllers: [ClothingController],
  providers: [ClothingService],
  exports: [ClothingService],
})
export class ClothingModule {}