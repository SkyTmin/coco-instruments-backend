// src/common/filters/http-exception.filter.ts - Enterprise-Grade Exception Handling
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
  details?: any;
  stack?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);
    
    // Log error with appropriate level
    this.logError(exception, request, errorResponse);
    
    // Add security headers
    this.addSecurityHeaders(response);
    
    // Send response
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;
    const requestId = this.generateRequestId();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'An unexpected error occurred';
    let details: any = undefined;
    let stack: string | undefined = undefined;

    // Handle different exception types
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || this.getErrorNameFromStatus(statusCode);
        details = responseObj.details;
      } else {
        message = exceptionResponse as string;
        error = this.getErrorNameFromStatus(statusCode);
      }
    } 
    else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Database Query Failed';
      message = this.isDevelopment ? exception.message : 'Invalid data operation';
      details = this.isDevelopment ? {
        query: exception.query,
        parameters: exception.parameters,
        driverError: exception.driverError
      } : undefined;
    }
    else if (exception instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      error = 'Entity Not Found';
      message = 'Requested resource not found';
    }
    else if (exception instanceof Error) {
      // Handle validation errors
      if (exception.name === 'ValidationError') {
        statusCode = HttpStatus.BAD_REQUEST;
        error = 'Validation Error';
        message = exception.message;
        details = (exception as any).details;
      } else {
        message = this.isDevelopment ? exception.message : 'Internal server error';
        error = 'Internal Server Error';
      }
    }

    // Include stack trace in development
    if (this.isDevelopment && exception instanceof Error) {
      stack = exception.stack;
    }

    return {
      statusCode,
      error,
      message,
      timestamp,
      path,
      method,
      requestId,
      details,
      stack
    };
  }

  private logError(exception: unknown, request: Request, errorResponse: ErrorResponse) {
    const { statusCode, message, requestId, path, method } = errorResponse;
    const userAgent = request.get('User-Agent') || 'Unknown';
    const ip = request.ip || 'Unknown';
    const origin = request.get('Origin') || 'None';

    const logContext = {
      requestId,
      method,
      path,
      statusCode,
      ip,
      userAgent,
      origin,
      headers: this.sanitizeHeaders(request.headers),
      body: this.sanitizeBody(request.body),
      query: request.query,
      params: request.params
    };

    if (statusCode >= 500) {
      this.logger.error(
        `🚨 Server Error: ${message}`,
        {
          ...logContext,
          exception: exception instanceof Error ? {
            name: exception.name,
            message: exception.message,
            stack: exception.stack
          } : exception
        }
      );
    } else if (statusCode >= 400) {
      this.logger.warn(
        `⚠️ Client Error: ${message}`,
        logContext
      );
    } else {
      this.logger.log(
        `ℹ️ Request processed: ${message}`,
        logContext
      );
    }
  }

  private addSecurityHeaders(response: Response) {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Content-Security-Policy', "default-src 'self'");
  }

  private getErrorNameFromStatus(statusCode: number): string {
    const errorMap = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
      [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
      [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
      [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout'
    };

    return errorMap[statusCode] || 'Unknown Error';
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitized = { ...headers };
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credential'];
    const sanitized = { ...body };
    
    const sanitizeObject = (obj: any): any => {
      if (!obj || typeof obj !== 'object') {
        return obj;
      }
      
      const result = Array.isArray(obj) ? [...obj] : { ...obj };
      
      Object.keys(result).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          result[key] = '[REDACTED]';
        } else if (typeof result[key] === 'object') {
          result[key] = sanitizeObject(result[key]);
        }
      });
      
      return result;
    };
    
    return sanitizeObject(sanitized);
  }
}
