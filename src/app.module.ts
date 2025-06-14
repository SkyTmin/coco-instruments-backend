import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ClothingModule } from './modules/clothing/clothing.module';
import { GeodesyModule } from './modules/geodesy/geodesy.module';
import { DatabaseConfig } from './config/database.config';
import { AppConfig } from './config/app.config';
import { JwtConfig } from './config/jwt.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, DatabaseConfig, JwtConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: DatabaseConfig,
      inject: [ConfigModule],
    }),
    AuthModule,
    FinanceModule,
    ClothingModule,
    GeodesyModule,
    HealthModule,
  ],
})
export class AppModule {}