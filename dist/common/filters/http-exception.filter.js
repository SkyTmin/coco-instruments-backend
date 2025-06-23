"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
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
};
const HTTP_ERROR_MAP = {
    [common_1.HttpStatus.BAD_REQUEST]: 'Bad Request',
    [common_1.HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [common_1.HttpStatus.PAYMENT_REQUIRED]: 'Payment Required',
    [common_1.HttpStatus.FORBIDDEN]: 'Forbidden',
    [common_1.HttpStatus.NOT_FOUND]: 'Not Found',
    [common_1.HttpStatus.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
    [common_1.HttpStatus.NOT_ACCEPTABLE]: 'Not Acceptable',
    [common_1.HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: 'Proxy Authentication Required',
    [common_1.HttpStatus.REQUEST_TIMEOUT]: 'Request Timeout',
    [common_1.HttpStatus.CONFLICT]: 'Conflict',
    [common_1.HttpStatus.GONE]: 'Gone',
    [common_1.HttpStatus.LENGTH_REQUIRED]: 'Length Required',
    [common_1.HttpStatus.PRECONDITION_FAILED]: 'Precondition Failed',
    [common_1.HttpStatus.PAYLOAD_TOO_LARGE]: 'Payload Too Large',
    [common_1.HttpStatus.URI_TOO_LONG]: 'URI Too Long',
    [common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported Media Type',
    [common_1.HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: 'Requested Range Not Satisfiable',
    [common_1.HttpStatus.EXPECTATION_FAILED]: 'Expectation Failed',
    [common_1.HttpStatus.I_AM_A_TEAPOT]: "I'm a Teapot",
    [common_1.HttpStatus.MISDIRECTED]: 'Misdirected Request',
    [common_1.HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    [ADDITIONAL_HTTP_STATUSES.LOCKED]: 'Locked',
    [common_1.HttpStatus.FAILED_DEPENDENCY]: 'Failed Dependency',
    [ADDITIONAL_HTTP_STATUSES.TOO_EARLY]: 'Too Early',
    [ADDITIONAL_HTTP_STATUSES.UPGRADE_REQUIRED]: 'Upgrade Required',
    [common_1.HttpStatus.PRECONDITION_REQUIRED]: 'Precondition Required',
    [common_1.HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
    [ADDITIONAL_HTTP_STATUSES.REQUEST_HEADER_FIELDS_TOO_LARGE]: 'Request Header Fields Too Large',
    [ADDITIONAL_HTTP_STATUSES.UNAVAILABLE_FOR_LEGAL_REASONS]: 'Unavailable For Legal Reasons',
    [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [common_1.HttpStatus.NOT_IMPLEMENTED]: 'Not Implemented',
    [common_1.HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
    [common_1.HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
    [common_1.HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
    [common_1.HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: 'HTTP Version Not Supported',
    [ADDITIONAL_HTTP_STATUSES.VARIANT_ALSO_NEGOTIATES]: 'Variant Also Negotiates',
    [ADDITIONAL_HTTP_STATUSES.INSUFFICIENT_STORAGE]: 'Insufficient Storage',
    [ADDITIONAL_HTTP_STATUSES.LOOP_DETECTED]: 'Loop Detected',
    [ADDITIONAL_HTTP_STATUSES.NOT_EXTENDED]: 'Not Extended',
    [ADDITIONAL_HTTP_STATUSES.NETWORK_AUTHENTICATION_REQUIRED]: 'Network Authentication Required',
};
const SENSITIVE_FIELDS = [
    'password', 'token', 'secret', 'key', 'credential', 'authorization',
    'cookie', 'x-api-key', 'refreshToken', 'accessToken', 'jwt'
];
const SENSITIVE_HEADERS = [
    'authorization', 'cookie', 'x-api-key', 'x-auth-token', 'x-access-token'
];
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    isDevelopment = process.env.NODE_ENV !== 'production';
    errorCount = new Map();
    lastErrors = [];
    maxErrorHistory = 100;
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const errorResponse = this.buildErrorResponse(exception, request);
        this.trackError(exception, request);
        this.logError(exception, request, errorResponse);
        this.addSecurityHeaders(response);
        response.status(errorResponse.statusCode).json(errorResponse);
    }
    buildErrorResponse(exception, request) {
        const timestamp = new Date().toISOString();
        const path = request.url;
        const method = request.method;
        const requestId = this.generateRequestId();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'Internal Server Error';
        let message = 'An unexpected error occurred';
        let details = undefined;
        let stack = undefined;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse;
                message = responseObj.message || exception.message;
                error = responseObj.error || this.getErrorNameFromStatus(statusCode);
                details = responseObj.details;
            }
            else {
                message = exceptionResponse;
                error = this.getErrorNameFromStatus(statusCode);
            }
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            statusCode = common_1.HttpStatus.BAD_REQUEST;
            error = 'Database Query Failed';
            message = this.isDevelopment ? exception.message : 'Invalid data operation';
            details = this.isDevelopment ? {
                query: exception.query,
                parameters: exception.parameters,
                driverError: this.sanitizeObject(exception.driverError)
            } : undefined;
        }
        else if (exception instanceof typeorm_1.EntityNotFoundError) {
            statusCode = common_1.HttpStatus.NOT_FOUND;
            error = 'Entity Not Found';
            message = 'Requested resource not found';
        }
        else if (exception instanceof Error) {
            if (exception.name === 'ValidationError') {
                statusCode = common_1.HttpStatus.BAD_REQUEST;
                error = 'Validation Error';
                message = exception.message;
                details = exception.details;
            }
            else {
                message = this.isDevelopment ? exception.message : 'Internal server error';
                error = 'Internal Server Error';
            }
            if (this.isDevelopment) {
                stack = exception.stack;
            }
        }
        else {
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
    trackError(exception, request) {
        const errorKey = this.getErrorKey(exception);
        const count = (this.errorCount.get(errorKey) || 0) + 1;
        this.errorCount.set(errorKey, count);
        this.lastErrors.unshift({
            error: errorKey,
            timestamp: Date.now(),
            count
        });
        if (this.lastErrors.length > this.maxErrorHistory) {
            this.lastErrors.length = this.maxErrorHistory;
        }
        if (count > 10) {
            this.logger.error(`🚨 High error frequency detected: ${errorKey} (${count} occurrences)`);
        }
    }
    getErrorKey(exception) {
        if (exception instanceof Error) {
            return `${exception.name}: ${exception.message}`;
        }
        return String(exception);
    }
    logError(exception, request, errorResponse) {
        const { statusCode, message, requestId, path, method } = errorResponse;
        const userAgent = request.get('User-Agent') || 'Unknown';
        const ip = this.getClientIp(request);
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
            body: this.sanitizeObject(request.body),
            query: request.query,
            params: request.params
        };
        const logMessage = `${this.getLogIcon(statusCode)} ${method} ${path} - ${statusCode} - ${message}`;
        if (statusCode >= 500) {
            this.logger.error(logMessage, {
                ...logContext,
                exception: this.serializeException(exception),
                stack: exception instanceof Error ? exception.stack : undefined
            });
        }
        else if (statusCode >= 400) {
            this.logger.warn(logMessage, logContext);
        }
        else {
            this.logger.log(logMessage, logContext);
        }
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            request.headers['x-real-ip'] ||
            request.connection?.remoteAddress ||
            request.socket?.remoteAddress ||
            'Unknown');
    }
    serializeException(exception) {
        if (exception instanceof Error) {
            const errorObj = {
                name: exception.name,
                message: exception.message,
            };
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
    getLogIcon(statusCode) {
        if (statusCode >= 500)
            return '🚨';
        if (statusCode >= 400)
            return '⚠️';
        return 'ℹ️';
    }
    addSecurityHeaders(response) {
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
        };
        Object.entries(securityHeaders).forEach(([header, value]) => {
            response.setHeader(header, value);
        });
    }
    getErrorNameFromStatus(statusCode) {
        return HTTP_ERROR_MAP[statusCode] || 'Unknown Error';
    }
    generateRequestId() {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 15);
        return `req_${timestamp}_${randomPart}`;
    }
    sanitizeHeaders(headers) {
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
    sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }
        const result = {};
        const objectRecord = obj;
        Object.entries(objectRecord).forEach(([key, value]) => {
            if (this.isSensitiveField(key)) {
                result[key] = '[REDACTED]';
            }
            else if (typeof value === 'object' && value !== null) {
                result[key] = this.sanitizeObject(value);
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
    isSensitiveField(fieldName) {
        const lowerFieldName = fieldName.toLowerCase();
        return SENSITIVE_FIELDS.some(sensitiveField => lowerFieldName.includes(sensitiveField.toLowerCase()));
    }
    getErrorMetrics() {
        return {
            totalUniqueErrors: this.errorCount.size,
            recentErrors: this.lastErrors.slice(0, 10),
            topErrors: Array.from(this.errorCount.entries())
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
        };
    }
    clearErrorMetrics() {
        this.errorCount.clear();
        this.lastErrors.length = 0;
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map