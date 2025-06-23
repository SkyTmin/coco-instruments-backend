import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
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
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    private readonly isDevelopment;
    private readonly errorCount;
    private readonly lastErrors;
    private readonly maxErrorHistory;
    catch(exception: unknown, host: ArgumentsHost): void;
    private buildErrorResponse;
    private trackError;
    private getErrorKey;
    private logError;
    private getClientIp;
    private serializeException;
    private getLogIcon;
    private addSecurityHeaders;
    private getErrorNameFromStatus;
    private generateRequestId;
    private sanitizeHeaders;
    private sanitizeObject;
    private isSensitiveField;
    getErrorMetrics(): ErrorMetrics;
    clearErrorMetrics(): void;
}
export {};
