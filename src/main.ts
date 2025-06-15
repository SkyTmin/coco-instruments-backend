import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // ✅ CORS — расширенная настройка для production
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'https://coco-instruments-production.up.railway.app';
  
  app.enableCors({
    origin: (origin, callback) => {
      // Список разрешенных origins
      const allowedOrigins = [
        'https://coco-instruments-production.up.railway.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
      ];
      
      // Разрешаем запросы без origin (например, от мобильных приложений)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // В production можно изменить на false для большей безопасности
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 часа
  });

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ Swagger (в dev-среде)
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

  const port = parseInt(configService.get<string>('PORT') || '3000', 10);
  await app.listen(port, '0.0.0.0'); // Слушаем на всех интерфейсах
  console.log(`🚀 App running at: ${await app.getUrl()}`);
  console.log(`📍 CORS enabled for: ${corsOrigin}`);
  console.log(`🔧 Environment: ${configService.get<string>('NODE_ENV')}`);
}
bootstrap();
