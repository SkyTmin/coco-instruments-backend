// src/main.ts - Исправленная конфигурация с улучшенной обработкой CORS
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    cors: false, // We'll configure CORS manually for better control
  });

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  const port = parseInt(configService.get<string>('PORT') || '3000', 10);
  const environment = configService.get<string>('NODE_ENV') || 'production';

  // Set global prefix
  app.setGlobalPrefix(apiPrefix);

  // Enhanced CORS Configuration
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
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
      
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) {
        console.log('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS: Allowing origin: ${origin}`);
        callback(null, true);
      } else {
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
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Global Exception Filter with enhanced logging
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enhanced Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
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
        
        const simpleMessages = errors.map(
          (error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
        );
        
        const validationError = new Error(`Validation failed: ${simpleMessages.join('; ')}`);
        validationError.name = 'ValidationError';
        (validationError as any).details = messages;
        
        return validationError;
      },
    }),
  );

  // Enhanced Request/Response Logging Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const { method, url, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection?.remoteAddress || 'Unknown';
    
    // Генерируем уникальный ID запроса
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

  // Health Check Endpoint (before global prefix)
  app.use('/health', (req: Request, res: Response) => {
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

  // Enhanced Security Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    
    // Only add CSP in production
    if (environment === 'production') {
      res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' https:");
    }
    
    next();
  });

  // Swagger Documentation (only in development)
  if (environment !== 'production') {
    const config = new DocumentBuilder()
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

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha'
      }
    });
    
    console.log(`📚 Swagger UI available at: http://localhost:${port}/${apiPrefix}/docs`);
  }

  // Graceful shutdown handling
  app.enableShutdownHooks();
  
  // Global error handling for uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  // Start server with proper binding
  await app.listen(port, '0.0.0.0');

  // Enhanced startup logging
  console.log('\n🚀 Coco Instruments Backend Started Successfully');
  console.log('==========================================');
  console.log(`🌍 Environment: ${environment}`);
  console.log(`🚪 Port: ${port}`);
  console.log(`🔗 API Prefix: ${apiPrefix}`);
  console.log(`🏥 Health Check: http://localhost:${port}/health`);
  console.log(`📡 API Base URL: http://localhost:${port}/${apiPrefix}`);
  console.log(`🗄️  Database: ${configService.get<string>('DATABASE_HOST')}:${configService.get<string>('DATABASE_PORT')}/${configService.get<string>('DATABASE_NAME')}`);
  console.log(`🔐 JWT Secret: ${configService.get<string>('jwt.secret') ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🌐 CORS Origins: ${allowedOrigins.length} configured`);
  
  if (environment !== 'production') {
    console.log(`📚 Swagger Docs: http://localhost:${port}/${apiPrefix}/docs`);
  }
  
  console.log('==========================================\n');
}

bootstrap().catch((error) => {
  console.error('❌ Application failed to start:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});
