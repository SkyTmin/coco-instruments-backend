// src/modules/auth/strategies/jwt.strategy.ts - Исправленная JWT стратегия
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: TokenPayload) {
    try {
      console.log('🔐 JWT Strategy - validating payload:', payload);
      
      if (!payload.sub) {
        console.error('❌ JWT Strategy - No user ID in payload');
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.authService.validateUserById(payload.sub);
      
      if (!user) {
        console.error('❌ JWT Strategy - User not found:', payload.sub);
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        console.error('❌ JWT Strategy - User is inactive:', payload.sub);
        throw new UnauthorizedException('User account is disabled');
      }

      console.log('✅ JWT Strategy - User validated successfully:', user.id);
      return user;
    } catch (error) {
      console.error('❌ JWT Strategy validation error:', error.message);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
