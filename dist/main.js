"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
        cors: false,
    });
    const configService = app.get(config_1.ConfigService);
    const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
    const port = parseInt(configService.get('PORT') || '3000', 10);
    const environment = configService.get('NODE_ENV') || 'production';
    app.setGlobalPrefix(apiPrefix);
    const corsOrigin = configService.get('CORS_ORIGIN');
    const allowedOrigins = [
        corsOrigin,
        'https://coco-instruments-production.up.railway.app',
        'https://coco-instruments-frontend-production.up.railway.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
    ].filter(Boolean);
    console.log('🌐 CORS Configuration:');
    console.log(`   Environment: ${environment}`);
    console.log(`   Allowed Origins: ${allowedOrigins.join(', ')}`);
    app.enableCors({
        origin: (origin, callback) => {
            console.log(`🌐 CORS Check - Origin: ${origin || 'none'}`);
            if (!origin) {
                console.log('✅ CORS: Allowing request with no origin');
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                console.log(`✅ CORS: Allowing origin: ${origin}`);
                callback(null, true);
            }
            else {
                console.log(`❌ CORS: Blocking origin: ${origin}`);
                console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
                callback(new Error(`CORS policy violation: Origin ${origin} not allowed`), false);
            }
        },
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Accept',
            'Accept-Version',
            'Authorization',
            'Content-Length',
            'Content-MD5',
            'Content-Type',
            'Date',
            'Origin',
            'X-Api-Version',
            'X-CSRF-Token',
            'X-Requested-With'
        ],
        exposedHeaders: [
            'X-Api-Version',
            'X-Request-Id',
            'X-Response-Time'
        ],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.use('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment,
            version: '1.0.0',
            cors: 'enabled',
            database: 'connected'
        });
    });
    app.use(`/${apiPrefix}/health`, (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment,
            version: '1.0.0',
            api: 'Coco Instruments Backend',
            cors: 'enabled',
            database: 'connected'
        });
    });
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: environment === 'production',
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const messages = errors.map(error => ({
                field: error.property,
                value: error.value,
                constraints: error.constraints,
                children: error.children
            }));
            console.error('🚨 Validation Error:', JSON.stringify(messages, null, 2));
            const simpleMessages = errors.map((error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`);
            const validationError = new Error(`Validation failed: ${simpleMessages.join('; ')}`);
            validationError.name = 'ValidationError';
            validationError.details = messages;
            return validationError;
        },
    }));
    app.use((req, res, next) => {
        const startTime = Date.now();
        const { method, url, headers } = req;
        const userAgent = headers['user-agent'] || 'Unknown';
        const ip = req.ip || req.connection?.remoteAddress || 'Unknown';
        const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        res.setHeader('X-Request-Id', requestId);
        console.log(`📤 ${method} ${url} - Origin: ${headers.origin || 'none'} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}`);
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const { statusCode } = res;
            const logLevel = statusCode >= 400 ? '❌' : '✅';
            console.log(`${logLevel} ${method} ${url} - ${statusCode} (${duration}ms) - ID: ${requestId}`);
        });
        next();
    });
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
        if (environment === 'production') {
            res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' https:");
        }
        next();
    });
    if (environment !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Coco Instruments API')
            .setDescription('Comprehensive API for Coco Instruments application')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        })
            .addServer(`http://localhost:${port}/${apiPrefix}`, 'Development server')
            .addServer(`https://coco-instruments-backend-production.up.railway.app/${apiPrefix}`, 'Production server')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha'
            }
        });
        console.log(`📚 Swagger UI available at: http://localhost:${port}/${apiPrefix}/docs`);
    }
    app.enableShutdownHooks();
    process.on('uncaughtException', (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('🚨 Uncaught Exception:', errorMessage);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
    await app.listen(port, '0.0.0.0');
    console.log('\n🚀 Coco Instruments Backend Started Successfully');
    console.log('==========================================');
    console.log(`🌍 Environment: ${environment}`);
    console.log(`🚪 Port: ${port}`);
    console.log(`🔗 API Prefix: ${apiPrefix}`);
    console.log(`🏥 Health Check: http://localhost:${port}/health`);
    console.log(`🏥 API Health Check: http://localhost:${port}/${apiPrefix}/health`);
    console.log(`📡 API Base URL: http://localhost:${port}/${apiPrefix}`);
    console.log(`🗄️  Database: ${configService.get('DATABASE_HOST')}:${configService.get('DATABASE_PORT')}/${configService.get('DATABASE_NAME')}`);
    console.log(`🔐 JWT Secret: ${configService.get('jwt.secret') ? '✅ Configured' : '❌ Missing'}`);
    console.log(`🌐 CORS Origins: ${allowedOrigins.length} configured`);
    if (environment !== 'production') {
        console.log(`📚 Swagger Docs: http://localhost:${port}/${apiPrefix}/docs`);
    }
    console.log('==========================================\n');
}
bootstrap().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('❌ Application failed to start:', errorMessage);
    console.error('Stack trace:', errorStack);
    process.exit(1);
});
//# sourceMappingURL=main.js.map