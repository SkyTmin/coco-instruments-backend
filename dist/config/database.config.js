"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const config_1 = require("@nestjs/config");
exports.DatabaseConfig = (0, config_1.registerAs)('database', () => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (!process.env.DATABASE_PASSWORD) {
        throw new Error('❌ DATABASE_PASSWORD is not set in the environment!');
    }
    return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME || 'coco_instruments',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || !isProduction,
        logging: !isProduction,
        ssl: process.env.DATABASE_SSL === 'true' ? {
            rejectUnauthorized: false,
        } : false,
        extra: {
            max: 100,
            connectionTimeoutMillis: 2000,
        },
    };
});
//# sourceMappingURL=database.config.js.map