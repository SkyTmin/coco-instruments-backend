"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./modules/auth/auth.module");
const finance_module_1 = require("./modules/finance/finance.module");
const clothing_module_1 = require("./modules/clothing/clothing.module");
const geodesy_module_1 = require("./modules/geodesy/geodesy.module");
const health_module_1 = require("./modules/health/health.module");
const app_config_1 = require("./config/app.config");
const database_config_1 = require("./config/database.config");
const jwt_config_1 = require("./config/jwt.config");
const jwt_auth_guard_1 = require("./modules/auth/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.AppConfig, database_config_1.DatabaseConfig, jwt_config_1.JwtConfig],
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const isProduction = config.get('NODE_ENV') === 'production';
                    console.log('🔧 Database Configuration:');
                    console.log(`  Environment: ${config.get('NODE_ENV')}`);
                    console.log(`  Host: ${config.get('DATABASE_HOST')}`);
                    console.log(`  Database: ${config.get('DATABASE_NAME')}`);
                    console.log(`  SSL: ${config.get('DATABASE_SSL')}`);
                    console.log(`  Synchronize: ${config.get('DATABASE_SYNCHRONIZE')}`);
                    return {
                        type: 'postgres',
                        url: config.get('DATABASE_URL'),
                        host: config.get('DATABASE_HOST', 'localhost'),
                        port: parseInt(config.get('DATABASE_PORT') || '5432', 10),
                        username: config.get('DATABASE_USERNAME'),
                        password: config.get('DATABASE_PASSWORD'),
                        database: config.get('DATABASE_NAME'),
                        synchronize: config.get('DATABASE_SYNCHRONIZE') === 'true' || !isProduction,
                        ssl: config.get('DATABASE_SSL') === 'true' ? {
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
            auth_module_1.AuthModule,
            finance_module_1.FinanceModule,
            clothing_module_1.ClothingModule,
            geodesy_module_1.GeodesyModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map