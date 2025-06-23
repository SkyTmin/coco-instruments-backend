export declare const JwtConfig: (() => {
    secret: string;
    accessTokenTtl: string;
    refreshTokenTtl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    accessTokenTtl: string;
    refreshTokenTtl: string;
}>;
