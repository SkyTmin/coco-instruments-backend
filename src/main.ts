import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Request, Response, NextFunction } from 'express'; // ✅ Типы

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: false, // Отключаем встроенный CORS
  });

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // ✅ Кастомный CORS middleware с типами
  app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = [
      'https://coco-instruments-production.up.railway.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ];

    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '*');
    } else {
      res.header('Access-Control-Allow-Origin', '*'); // На проде — временно
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      res.header('Content-Length', '0');
      return res.status(204).end();
    }

    next();
  });

  // ✅ Глобальный фильтр ошибок
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Глобальные пайпы валидации
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
          (error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
        );
        return new Error(messages.join('; '));
      },
    }),
  );

  // ✅ Swagger (только для dev)
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

  app.enableShutdownHooks();

  const port = parseInt(configService.get<string>('PORT') || '3000', 10);
  const server = await app.listen(port, '0.0.0.0'); // 🔥 обязательно 0.0.0.0 в Docker
  server.setTimeout(60000);

  const url = (await app.getUrl()).replace('0.0.0.0', 'localhost');

  console.log(`🚀 App running at: ${url}`);
  console.log(`📍 CORS configured with custom middleware`);
  console.log(`🔧 Environment: ${configService.get<string>('NODE_ENV')}`);
  console.log(`🌐 API Prefix: ${apiPrefix}`);
  console.log(`✅ Health check: ${url}/${apiPrefix}/health`);
}

bootstrap().catch((err) => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});
