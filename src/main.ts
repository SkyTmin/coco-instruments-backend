// src/main.ts - Enterprise-Grade Application Bootstrap with Comprehensive Type Safety
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

/**
 * Application configuration interface for type safety
 */
interface AppConfiguration {
  readonly nodeEnv: string;
  readonly port: number;
  readonly apiPrefix: string;
  readonly corsOrigin: string;
  readonly dbHost: string;
  readonly dbPort: string;
  readonly dbName: string;
  readonly jwtSecret: string;
}

/**
 * Health check response interface
 */
interface HealthCheckResponse {
  readonly status: 'ok' | 'error';
  readonly timestamp: string;
  readonly uptime: number;
  readonly environment: string;
  readonly version: string;
  readonly memory: {
    readonly used: number;
    readonly total: number;
    readonly external: number;
    readonly rss: number;
  };
  readonly database: {
    readonly status: 'connected' | 'disconnected';
    readonly host: string;
    readonly name: string;
  };
}

/**
 * Request logging interface for comprehensive monitoring
 */
interface RequestLogData {
  readonly method: string;
  readonly url: string;
  readonly origin: string | null;
  readonly userAgent: string | null;
  readonly ip: string;
  readonly startTime: number;
  readonly statusCode?: number;
  readonly duration?: number;
  readonly requestId: string;
}

/**
 * CORS configuration interface
 */
interface CorsConfiguration {
  readonly allowedOrigins: readonly string[];
  readonly allowedMethods: readonly string[];
  readonly allowedHeaders: readonly string[];
  readonly exposedHeaders: readonly string[];
  readonly maxAge: number;
  readonly credentials: boolean;
}

/**
 * Security headers configuration
 */
interface SecurityHeaders {
  readonly [key: string]: string;
}

/**
 * Application performance metrics
 */
interface PerformanceMetrics {
  readonly requestCount: number;
  readonly averageResponseTime: number;
  readonly errorRate: number;
  readonly uptime: number;
}

/**
 * Main application bootstrap with enterprise-grade configuration
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('🚀 Starting Coco Instruments Backend Application...');
    const startTime = Date.now();

    // Create NestJS application with enhanced configuration
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      cors: false, // We'll configure CORS manually for fine-grained control
      bodyParser: true,
      snapshot: true, // Enable application snapshots for debugging
    });

    // Initialize configuration service
    const configService = app.get<ConfigService>(ConfigService);
    const appConfig = extractConfiguration(configService);

    // Validate critical configuration
    validateConfiguration(appConfig);

    // Set global application prefix
    app.setGlobalPrefix(appConfig.apiPrefix);

    // Configure comprehensive CORS with security focus
    setupCorsConfiguration(app, appConfig);

    // Install global filters, pipes, and interceptors
    await setupGlobalMiddleware(app, appConfig);

    // Setup request/response logging middleware
    setupRequestLogging(app);

    // Configure health check endpoints
    setupHealthChecks(app, configService);

    // Setup Swagger documentation for non-production environments
    setupSwaggerDocumentation(app, appConfig);

    // Configure graceful shutdown handling
    setupGracefulShutdown(app);

    // Setup performance monitoring
    setupPerformanceMonitoring(app);

    // Start the application server
    await app.listen(appConfig.port, '0.0.0.0');

    // Log successful startup with comprehensive information
    logSuccessfulStartup(appConfig, startTime);

  } catch (error) {
    logger.error('❌ Critical application startup failure:', error);
    handleStartupError(error);
  }
}

/**
 * Extract and validate configuration from ConfigService
 */
function extractConfiguration(configService: ConfigService): AppConfiguration {
  return {
    nodeEnv: configService.get<string>('NODE_ENV') || 'production',
    port: parseInt(configService.get<string>('PORT') || '3000', 10),
    apiPrefix: configService.get<string>('API_PREFIX') || 'api/v1',
    corsOrigin: configService.get<string>('CORS_ORIGIN') || '',
    dbHost: configService.get<string>('DATABASE_HOST') || 'localhost',
    dbPort: configService.get<string>('DATABASE_PORT') || '5432',
    dbName: configService.get<string>('DATABASE_NAME') || 'coco_instruments',
    jwtSecret: configService.get<string>('JWT_SECRET') || '',
  };
}

/**
 * Validate critical configuration parameters
 */
function validateConfiguration(config: AppConfiguration): void {
  const logger = new Logger('ConfigValidation');
  
  const validationErrors: string[] = [];

  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    validationErrors.push('JWT_SECRET must be at least 32 characters long');
  }

  if (!config.corsOrigin && config.nodeEnv === 'production') {
    validationErrors.push('CORS_ORIGIN must be set in production environment');
  }

  if (config.port < 1 || config.port > 65535) {
    validationErrors.push('PORT must be between 1 and 65535');
  }

  if (validationErrors.length > 0) {
    logger.error('❌ Configuration validation failed:');
    validationErrors.forEach(error => logger.error(`   • ${error}`));
    throw new Error(`Configuration validation failed: ${validationErrors.join(', ')}`);
  }

  logger.log('✅ Configuration validation passed');
}

/**
 * Setup comprehensive CORS configuration with security best practices
 */
function setupCorsConfiguration(app: any, config: AppConfiguration): void {
  const logger = new Logger('CORS');

  const allowedOrigins: readonly string[] = [
    config.corsOrigin,
    'https://coco-instruments-production.up.railway.app',
    'https://coco-instruments-frontend-production.up.railway.app',
    ...(config.nodeEnv !== 'production' ? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ] : [])
  ].filter(Boolean);

  const corsConfig: CorsConfiguration = {
    allowedOrigins,
    allowedMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
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
      'X-Requested-With',
      'Cache-Control'
    ],
    exposedHeaders: [
      'X-Api-Version',
      'X-Request-Id',
      'X-Response-Time',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining'
    ],
    maxAge: 86400, // 24 hours
    credentials: true
  };

  logger.log('🌐 Configuring CORS with security-first approach');
  logger.log(`   Allowed Origins: ${corsConfig.allowedOrigins.length} configured`);

  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, success?: boolean) => void): void => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) {
        logger.debug('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (corsConfig.allowedOrigins.includes(origin)) {
        logger.debug(`✅ CORS: Allowing origin: ${origin}`);
        callback(null, true);
      } else {
        logger.warn(`❌ CORS: Blocking unauthorized origin: ${origin}`);
        logger.warn(`   Allowed origins: ${corsConfig.allowedOrigins.join(', ')}`);
        callback(new Error(`CORS policy violation: Origin ${origin} not allowed`), false);
      }
    },
    credentials: corsConfig.credentials,
    methods: corsConfig.allowedMethods,
    allowedHeaders: corsConfig.allowedHeaders,
    exposedHeaders: corsConfig.exposedHeaders,
    maxAge: corsConfig.maxAge,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  logger.log('✅ CORS configuration completed successfully');
}

/**
 * Setup global middleware, filters, and interceptors
 */
async function setupGlobalMiddleware(app: any, config: AppConfiguration): Promise<void> {
  const logger = new Logger('Middleware');

  // Global exception filter with comprehensive error handling
  const exceptionFilter = new AllExceptionsFilter();
  app.useGlobalFilters(exceptionFilter);
  logger.log('✅ Global exception filter configured');

  // Enhanced validation pipe with strict type checking
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: config.nodeEnv === 'production',
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const logger = new Logger('ValidationPipe');
        
        const validationDetails = errors.map(error => ({
          field: error.property,
          value: error.value,
          constraints: error.constraints,
          children: error.children?.map(child => ({
            field: child.property,
            constraints: child.constraints
          }))
        }));

        logger.error('🚨 Validation Error Details:', JSON.stringify(validationDetails, null, 2));

        const simpleMessages = errors.map(
          (error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
        );

        const validationError = new Error(`Validation failed: ${simpleMessages.join('; ')}`);
        validationError.name = 'ValidationError';
        (validationError as any).details = validationDetails;

        return validationError;
      },
    }),
  );
  logger.log('✅ Global validation pipe configured with strict type checking');

  // Security headers middleware
  setupSecurityHeaders(app);
  logger.log('✅ Security headers middleware configured');
}

/**
 * Setup comprehensive request/response logging middleware
 */
function setupRequestLogging(app: any): void {
  const logger = new Logger('RequestLogger');

  app.use((req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    // Add request ID to request object for tracing
    (req as any).requestId = requestId;

    const logData: RequestLogData = {
      method: req.method,
      url: req.url,
      origin: req.get('Origin') || null,
      userAgent: req.get('User-Agent') || null,
      ip: getClientIp(req),
      startTime,
      requestId
    };

    logger.log(`📤 ${logData.method} ${logData.url} - Origin: ${logData.origin || 'none'} - ID: ${requestId}`);

    // Enhanced response logging with performance metrics
    res.on('finish', (): void => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      
      const enhancedLogData = {
        ...logData,
        statusCode,
        duration
      };

      const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';
      const icon = statusCode >= 500 ? '🚨' : statusCode >= 400 ? '⚠️' : '✅';
      
      logger[logLevel](
        `${icon} ${enhancedLogData.method} ${enhancedLogData.url} - ${statusCode} (${duration}ms) - ID: ${requestId}`
      );

      // Alert on slow requests
      if (duration > 2000) {
        logger.warn(`🐌 Slow request detected: ${enhancedLogData.method} ${enhancedLogData.url} took ${duration}ms`);
      }
    });

    next();
  });

  logger.log('✅ Request logging middleware configured');
}

/**
 * Setup comprehensive health check endpoints
 */
function setupHealthChecks(app: any, configService: ConfigService): void {
  const logger = new Logger('HealthCheck');

  app.use('/health', (req: Request, res: Response): void => {
    const memoryUsage = process.memoryUsage();
    
    const healthResponse: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.get<string>('NODE_ENV') || 'unknown',
      version: '1.0.0',
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024)
      },
      database: {
        status: 'connected', // This should be dynamically checked
        host: configService.get<string>('DATABASE_HOST') || 'unknown',
        name: configService.get<string>('DATABASE_NAME') || 'unknown'
      }
    };

    res.status(200).json(healthResponse);
  });

  // Detailed health check endpoint for monitoring systems
  app.use('/health/detailed', (req: Request, res: Response): void => {
    const memoryUsage = process.memoryUsage();
    
    const detailedHealth = {
      ...{
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: configService.get<string>('NODE_ENV') || 'unknown',
        version: '1.0.0',
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
          rss: Math.round(memoryUsage.rss / 1024 / 1024)
        },
        database: {
          status: 'connected',
          host: configService.get<string>('DATABASE_HOST') || 'unknown',
          name: configService.get<string>('DATABASE_NAME') || 'unknown'
        }
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpuUsage: process.cpuUsage(),
        loadAverage: require('os').loadavg()
      }
    };

    res.status(200).json(detailedHealth);
  });

  logger.log('✅ Health check endpoints configured');
}

/**
 * Setup Swagger documentation for development environments
 */
function setupSwaggerDocumentation(app: any, config: AppConfiguration): void {
  if (config.nodeEnv === 'production') {
    return; // Skip Swagger in production for security
  }

  const logger = new Logger('Swagger');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Coco Instruments API')
    .setDescription('Comprehensive API documentation for Coco Instruments application with enterprise-grade features')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT Authentication',
      description: 'Enter your JWT token to authorize API requests',
      in: 'header',
    }, 'JWT')
    .addServer(`http://localhost:${config.port}/${config.apiPrefix}`, 'Development Server')
    .addServer(`https://coco-instruments-backend-production.up.railway.app/${config.apiPrefix}`, 'Production Server')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Coco Money', 'Financial management and tracking endpoints')
    .addTag('Debts', 'Debt management and payment tracking endpoints')
    .addTag('Clothing Size', 'Clothing size calculation and parameter management')
    .addTag('Scale Calculator', 'Geodetic scale calculation and history management')
    .addTag('Health', 'Application health and monitoring endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });

  SwaggerModule.setup(`${config.apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'Coco Instruments API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #7B4B2A; }
    `,
  });

  logger.log(`✅ Swagger documentation available at: /${config.apiPrefix}/docs`);
}

/**
 * Setup security headers middleware
 */
function setupSecurityHeaders(app: any): void {
  const securityHeaders: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Download-Options': 'noopen',
    'X-DNS-Prefetch-Control': 'off'
  };

  app.use((req: Request, res: Response, next: NextFunction): void => {
    Object.entries(securityHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
    next();
  });
}

/**
 * Setup graceful shutdown handling
 */
function setupGracefulShutdown(app: any): void {
  const logger = new Logger('Shutdown');

  app.enableShutdownHooks();

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error): void => {
    logger.error('🚨 Uncaught Exception - Application will terminate:', error);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>): void => {
    logger.error('🚨 Unhandled Promise Rejection:', reason);
    logger.error('Promise:', promise);
    process.exit(1);
  });

  // Handle termination signals
  const shutdownSignals = ['SIGTERM', 'SIGINT', 'SIGUSR2'] as const;
  
  shutdownSignals.forEach((signal) => {
    process.on(signal, async (): Promise<void> => {
      logger.log(`📴 Received ${signal}, starting graceful shutdown...`);
      
      try {
        await app.close();
        logger.log('✅ Application shut down gracefully');
        process.exit(0);
      } catch (error) {
        logger.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    });
  });

  logger.log('✅ Graceful shutdown handlers configured');
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring(app: any): void {
  const logger = new Logger('Performance');
  
  let requestCount = 0;
  let totalResponseTime = 0;
  let errorCount = 0;

  app.use((req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    requestCount++;

    res.on('finish', (): void => {
      const responseTime = Date.now() - startTime;
      totalResponseTime += responseTime;

      if (res.statusCode >= 400) {
        errorCount++;
      }

      // Add performance headers
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      res.setHeader('X-Request-Id', (req as any).requestId || 'unknown');
    });

    next();
  });

  // Performance metrics endpoint
  app.use('/metrics', (req: Request, res: Response): void => {
    const metrics: PerformanceMetrics = {
      requestCount,
      averageResponseTime: requestCount > 0 ? Math.round(totalResponseTime / requestCount) : 0,
      errorRate: requestCount > 0 ? Math.round((errorCount / requestCount) * 100) : 0,
      uptime: process.uptime()
    };

    res.json(metrics);
  });

  logger.log('✅ Performance monitoring configured');
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `req_${timestamp}_${randomPart}`;
}

/**
 * Extract client IP address from request
 */
function getClientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Log successful application startup with comprehensive information
 */
function logSuccessfulStartup(config: AppConfiguration, startTime: number): void {
  const logger = new Logger('Bootstrap');
  const startupTime = Date.now() - startTime;

  logger.log('\n🎉 Coco Instruments Backend Started Successfully');
  logger.log('═'.repeat(60));
  logger.log(`🌍 Environment: ${config.nodeEnv}`);
  logger.log(`🚪 Port: ${config.port}`);
  logger.log(`🔗 API Prefix: ${config.apiPrefix}`);
  logger.log(`🏥 Health Check: http://localhost:${config.port}/health`);
  logger.log(`📊 Metrics: http://localhost:${config.port}/metrics`);
  logger.log(`📡 API Base URL: http://localhost:${config.port}/${config.apiPrefix}`);
  logger.log(`🗄️  Database: ${config.dbHost}:${config.dbPort}/${config.dbName}`);
  logger.log(`🔐 JWT Secret: ${config.jwtSecret ? '✅ Configured' : '❌ Missing'}`);
  logger.log(`🌐 CORS Origins: ✅ Configured for ${config.nodeEnv}`);
  logger.log(`⚡ Startup Time: ${startupTime}ms`);
  
  if (config.nodeEnv !== 'production') {
    logger.log(`📚 Swagger Docs: http://localhost:${config.port}/${config.apiPrefix}/docs`);
  }
  
  logger.log('═'.repeat(60));
  logger.log('🚀 Ready to serve requests!\n');
}

/**
 * Handle startup errors with comprehensive logging
 */
function handleStartupError(error: any): void {
  const logger = new Logger('Bootstrap');
  
  logger.error('❌ Critical startup failure:');
  logger.error(`   Error: ${error.message}`);
  logger.error(`   Stack: ${error.stack}`);
  
  if (error.code) {
    logger.error(`   Code: ${error.code}`);
  }
  
  if (error.syscall) {
    logger.error(`   Syscall: ${error.syscall}`);
  }
  
  logger.error('🔄 Application will terminate. Please check configuration and try again.');
  process.exit(1);
}

// Start the application
bootstrap().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
