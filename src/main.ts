import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: false, // Отключаем встроенный CORS, настроим вручную
  });
  
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // ✅ Middleware для обработки CORS вручную
  app.use((req: any, res: any, next: any) => {
    // Разрешенные origins
    const allowedOrigins = [
      'https://coco-instruments-production.up.railway.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];

    const origin = req.headers.origin;
    
    // Если origin в списке разрешенных или это не браузерный запрос
    if (!origin || allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '*');
    } else {
      // В production для отладки временно разрешаем все
      res.header('Access-Control-Allow-Origin', '*');
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    
    // Обработка preflight запросов
    if (req.method === 'OPTIONS') {
      res.header('Content-Length', '0');
      return res.status(204).end();
    }
    
    next();
  });

  // ✅ Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map(
          error => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
        );
        return new Error(messages.join('; '));
      },
    }),
  );

  // ✅ Swagger (только в dev-среде)
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Coco Instruments API')
      .setDescription('The Coco Instruments API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Включаем shutdown hooks
  app.enableShutdownHooks();

  const port = parseInt(configService.get<string>('PORT') || '3000', 10);
  const server = await app.listen(port, '0.0.0.0');
  
  // Увеличиваем таймауты
  server.setTimeout(60000); // 60 секунд
  
  console.log(`🚀 App running at: ${await app.getUrl()}`);
  console.log(`📍 CORS configured with custom middleware`);
  console.log(`🔧 Environment: ${configService.get<string>('NODE_ENV')}`);
  console.log(`🌐 API Prefix: ${apiPrefix}`);
  console.log(`✅ Health check: ${await app.getUrl()}/${apiPrefix}/health`);
}

bootstrap().catch(err => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});
