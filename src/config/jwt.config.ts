import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  accessTokenTtl: process.env.JWT_ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.JWT_REFRESH_TOKEN_TTL || '7d',
}));