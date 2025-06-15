import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ClothingModule } from './modules/clothing/clothing.module';
import { GeodesyModule } from './modules/geodesy/geodesy.module';
import { HealthModule } from './modules/health/health.module';

import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import { JwtConfig } from './config/jwt.config';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, DatabaseConfig, JwtConfig],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        console.log('🔧 Database Configuration:');
        console.log(`  Environment: ${config.get('NODE_ENV')}`);
        console.log(`  Host: ${config.get<string>('DATABASE_HOST')}`);
        console.log(`  Database: ${config.get<string>('DATABASE_NAME')}`);
        console.log(`  SSL: ${config.get<string>('DATABASE_SSL')}`);
        console.log(`  Synchronize: ${config.get<string>('DATABASE_SYNCHRONIZE')}`);

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
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          extra: {
            max: 100,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 30000,
          },
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
    }),

    AuthModule,
    FinanceModule,
    ClothingModule,
    GeodesyModule,
    HealthModule,
  ],
  providers: [
    // Глобальная защита JWT (Public декоратор отключает для определенных роутов)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
