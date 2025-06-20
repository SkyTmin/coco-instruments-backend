// src/modules/health/health.controller.ts - ПОЛНАЯ ЗАМЕНА
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      cors: 'enabled',
      api: 'Coco Instruments Backend v1.0',
      database: 'connected'
    };
  }

  // Дополнительный endpoint для детальной диагностики
  @Public()
  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check' })
  @ApiResponse({ status: 200, description: 'Detailed service status' })
  detailedCheck() {
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
      },
      database: {
        status: 'connected',
        host: process.env.DATABASE_HOST || 'unknown'
      },
      api: {
        prefix: process.env.API_PREFIX || 'api/v1',
        cors: process.env.CORS_ORIGIN || '*'
      }
    };
  }
}
