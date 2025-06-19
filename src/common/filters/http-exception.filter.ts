// src/common/filters/http-exception.filter.ts - Enterprise-Grade Exception Handling with Full Type Safety
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

interface ErrorResponse {
  readonly statusCode: number;
  readonly error: string;
  readonly message: string | string[];
  readonly timestamp: string;
  readonly path: string;
  readonly method: string;
  readonly requestId: string;
  readonly details?: Record<string, unknown>;
  readonly stack?: string;
}

interface ErrorContext {
  readonly requestId: string;
  readonly method: string;
  readonly path: string;
  readonly statusCode: number;
  readonly ip: string;
  readonly userAgent: string;
  readonly origin: string;
  readonly headers: Record<string, string>;
  readonly body: Record<string, unknown>;
  readonly query: Record<string, unknown>;
  readonly params: Record<string, unknown>;
}

interface ErrorSummary {
  readonly error: string;
  readonly timestamp: number;
  readonly count: number;
}

interface ErrorMetrics {
  readonly totalUniqueErrors: number;
  readonly recentErrors: readonly ErrorSummary[];
  readonly topErrors: readonly [string, number][];
}

// Additional HTTP status codes that might be missing in older NestJS versions
const ADDITIONAL_HTTP_STATUSES = {
  LOCKED: 423,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
} as const;

// Type-safe error map with comprehensive HTTP status coverage
const HTTP_ERROR_MAP: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.PAYMENT_REQUIRED]: 'Payment Required',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HttpStatus.NOT_ACCEPTABLE]: 'Not Acceptable',
  [HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: 'Proxy Authentication Required',
  [HttpStatus.REQUEST_TIMEOUT]: 'Request Timeout',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.GONE]: 'Gone',
  [HttpStatus.LENGTH_REQUIRED]: 'Length Required',
  [HttpStatus.PRECONDITION_FAILED]: 'Precondition Failed',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'Payload Too Large',
  [HttpStatus.URI_TOO_LONG]: 'URI Too Long',
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported Media Type',
  [HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: 'Requested Range Not Satisfiable',
  [HttpStatus.EXPECTATION_FAILED]: 'Expectation Failed',
  [HttpStatus.I_AM_A_TEAPOT]: "I'm a Teapot",
  [HttpStatus.MISDIRECTED]: 'Misdirected Request',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [ADDITIONAL_HTTP_STATUSES.LOCKED]: 'Locked',
  [HttpStatus.FAILED_DEPENDENCY]: 'Failed Dependency',
  [ADDITIONAL_HTTP_STATUSES.TOO_EARLY]: 'Too Early',
  [ADDITIONAL_HTTP_STATUSES.UPGRADE_REQUIRED]: 'Upgrade Required',
  [HttpStatus.PRECONDITION_REQUIRED]: 'Precondition Required',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [ADDITIONAL_HTTP_STATUSES.REQUEST_HEADER_FIELDS_TOO_LARGE]: 'Request Header Fields Too Large',
  [ADDITIONAL_HTTP_STATUSES.UNAVAILABLE_FOR_LEGAL_REASONS]: 'Unavailable For Legal Reasons',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HttpStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
  [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: 'HTTP Version Not Supported',
  [ADDITIONAL_HTTP_STATUSES.VARIANT_ALSO_NEGOTIATES]: 'Variant Also Negotiates',
  [ADDITIONAL_HTTP_STATUSES.INSUFFICIENT_STORAGE]: 'Insufficient Storage',
  [ADDITIONAL_HTTP_STATUSES.LOOP_DETECTED]: 'Loop Detected',
  [ADDITIONAL_HTTP_STATUSES.NOT_EXTENDED]: 'Not Extended',
  [ADDITIONAL_HTTP_STATUSES.NETWORK_AUTHENTICATION_REQUIRED]: 'Network Authentication Required',
} as const;

// Sensitive fields that should be redacted in logs
const SENSITIVE_FIELDS = [
  'password', 'token', 'secret', 'key', 'credential', 'authorization', 
  'cookie', 'x-api-key', 'refreshToken', 'accessToken', 'jwt'
] as const;

// Sensitive headers that should be redacted
const SENSITIVE_HEADERS = [
  'authorization', 'cookie', 'x-api-key', 'x-auth-token', 'x-access-token'
] as const;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';
  private readonly errorCount = new Map<string, number>();
  private readonly lastErrors: ErrorSummary[] = [];
  private readonly maxErrorHistory = 100;

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);
    
    // Track error for metrics
    this.trackError(exception, request);
    
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
    let details: Record<string, unknown> | undefined = undefined;
    let stack: string | undefined = undefined;

    // Handle different exception types with comprehensive type checking
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string | string[]) || exception.message;
        error = (responseObj.error as string) || this.getErrorNameFromStatus(statusCode);
        details = responseObj.details as Record<string, unknown>;
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
        driverError: this.sanitizeObject(exception.driverError)
      } : undefined;
    }
    else if (exception instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      error = 'Entity Not Found';
      message = 'Requested resource not found';
    }
    else if (exception instanceof Error) {
      // Handle validation errors and other Error instances
      if (exception.name === 'ValidationError') {
        statusCode = HttpStatus.BAD_REQUEST;
        error = 'Validation Error';
        message = exception.message;
        details = (exception as unknown as { details?: Record<string, unknown> }).details;
      } else {
        message = this.isDevelopment ? exception.message : 'Internal server error';
        error = 'Internal Server Error';
      }
      
      // Include stack trace only in development
      if (this.isDevelopment) {
        stack = exception.stack;
      }
    }
    else {
      // Handle non-Error exceptions
      message = this.isDevelopment ? String(exception) : 'Internal server error';
      error = 'Internal Server Error';
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

  private trackError(exception: unknown, request: Request): void {
    const errorKey = this.getErrorKey(exception);
    const count = (this.errorCount.get(errorKey) || 0) + 1;
    this.errorCount.set(errorKey, count);
    
    this.lastErrors.unshift({
      error: errorKey,
      timestamp: Date.now(),
      count
    });
    
    // Maintain error history limit
    if (this.lastErrors.length > this.maxErrorHistory) {
      this.lastErrors.length = this.maxErrorHistory;
    }
    
    // Alert on high error frequency
    if (count > 10) {
      this.logger.error(`🚨 High error frequency detected: ${errorKey} (${count} occurrences)`);
    }
  }

  private getErrorKey(exception: unknown): string {
    if (exception instanceof Error) {
      return `${exception.name}: ${exception.message}`;
    }
    return String(exception);
  }

  private logError(exception: unknown, request: Request, errorResponse: ErrorResponse): void {
    const { statusCode, message, requestId, path, method } = errorResponse;
    const userAgent = request.get('User-Agent') || 'Unknown';
    const ip = this.getClientIp(request);
    const origin = request.get('Origin') || 'None';

    const logContext: ErrorContext = {
      requestId,
      method,
      path,
      statusCode,
      ip,
      userAgent,
      origin,
      headers: this.sanitizeHeaders(request.headers as Record<string, string>),
      body: this.sanitizeObject(request.body) as Record<string, unknown>,
      query: request.query as Record<string, unknown>,
      params: request.params as Record<string, unknown>
    };

    const logMessage = `${this.getLogIcon(statusCode)} ${method} ${path} - ${statusCode} - ${message}`;

    if (statusCode >= 500) {
      this.logger.error(logMessage, {
        ...logContext,
        exception: this.serializeException(exception),
        stack: exception instanceof Error ? exception.stack : undefined
      });
    } else if (statusCode >= 400) {
      this.logger.warn(logMessage, logContext);
    } else {
      this.logger.log(logMessage, logContext);
    }
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (request.headers['x-real-ip'] as string) ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'Unknown'
    );
  }

  private serializeException(exception: unknown): Record<string, unknown> {
    if (exception instanceof Error) {
      const errorObj: Record<string, unknown> = {
        name: exception.name,
        message: exception.message,
      };
      
      // Add cause if it exists (for newer TypeScript/Node versions)
      if ('cause' in exception && exception.cause !== undefined) {
        errorObj.cause = exception.cause;
      }
      
      if (this.isDevelopment && exception.stack) {
        errorObj.stack = exception.stack;
      }
      
      return errorObj;
    }
    return { exception: String(exception) };
  }

  private getLogIcon(statusCode: number): string {
    if (statusCode >= 500) return '🚨';
    if (statusCode >= 400) return '⚠️';
    return 'ℹ️';
  }

  private addSecurityHeaders(response: Response): void {
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'",
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    } as const;

    Object.entries(securityHeaders).forEach(([header, value]) => {
      response.setHeader(header, value);
    });
  }

  private getErrorNameFromStatus(statusCode: number): string {
    return HTTP_ERROR_MAP[statusCode] || 'Unknown Error';
  }

  private generateRequestId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `req_${timestamp}_${randomPart}`;
  }

  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers };
    
    SENSITIVE_HEADERS.forEach(header => {
      const lowerHeader = header.toLowerCase();
      Object.keys(sanitized).forEach(key => {
        if (key.toLowerCase() === lowerHeader) {
          sanitized[key] = '[REDACTED]';
        }
      });
    });
    
    return sanitized;
  }

  private sanitizeObject(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const result: Record<string, unknown> = {};
    const objectRecord = obj as Record<string, unknown>;
    
    Object.entries(objectRecord).forEach(([key, value]) => {
      if (this.isSensitiveField(key)) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.sanitizeObject(value);
      } else {
        result[key] = value;
      }
    });
    
    return result;
  }

  private isSensitiveField(fieldName: string): boolean {
    const lowerFieldName = fieldName.toLowerCase();
    return SENSITIVE_FIELDS.some(sensitiveField => 
      lowerFieldName.includes(sensitiveField.toLowerCase())
    );
  }

  /**
   * Get error metrics for monitoring and alerting
   */
  public getErrorMetrics(): ErrorMetrics {
    return {
      totalUniqueErrors: this.errorCount.size,
      recentErrors: this.lastErrors.slice(0, 10),
      topErrors: Array.from(this.errorCount.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    };
  }

  /**
   * Clear error metrics (useful for testing or periodic cleanup)
   */
  public clearErrorMetrics(): void {
    this.errorCount.clear();
    this.lastErrors.length = 0;
  }
}
