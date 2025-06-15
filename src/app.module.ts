import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ClothingModule } from './modules/clothing/clothing.module';
import { GeodesyModule } from './modules/geodesy/geodesy.module';
import { HealthModule } from './modules/health/health.module';

import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import { JwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, DatabaseConfig, JwtConfig],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ✅ нужно импортировать ConfigModule
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          host: config.get<string>('DATABASE_HOST', 'localhost'),
          port: parseInt(config.get<string>('DATABASE_PORT') || '5432', 10),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          synchronize: config.get<string>('DATABASE_SYNCHRONIZE') === 'true' || !isProduction,
          ssl: config.get<string>('DATABASE_SSL') === 'true' ? {
            rejectUnauthorized: false,
          } : false,
          logging: !isProduction,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
          extra: {
            max: 100,
            connectionTimeoutMillis: 2000,
          },
        };
      },
    }),

    AuthModule,
    FinanceModule,
    ClothingModule,
    GeodesyModule,
    HealthModule,
  ],
})
export class AppModule {}
