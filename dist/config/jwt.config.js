"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtConfig = void 0;
const config_1 = require("@nestjs/config");
exports.JwtConfig = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    accessTokenTtl: process.env.JWT_ACCESS_TOKEN_TTL || '15m',
    refreshTokenTtl: process.env.JWT_REFRESH_TOKEN_TTL || '7d',
}));
//# sourceMappingURL=jwt.config.js.map