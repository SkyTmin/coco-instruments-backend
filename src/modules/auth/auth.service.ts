// src/modules/auth/auth.service.ts - Исправленный сервис аутентификации
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    try {
      // Check if user exists
      const existingUser = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12); // Увеличили salt rounds

      // Create user
      const user = this.userRepository.create({
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);
      console.log('✅ User registered successfully:', savedUser.email);

      // Generate tokens
      const tokens = await this.generateTokens(savedUser.id);
      await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          user: {
            id: savedUser.id,
            email: savedUser.email,
            name: savedUser.name,
          },
          ...tokens,
        },
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  async login(user: User) {
    try {
      console.log('✅ User login successful:', user.email);
      
      const tokens = await this.generateTokens(user.id);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          ...tokens,
        },
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new UnauthorizedException('Login failed');
    }
  }

  async refresh(userId: string, refreshToken: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, isActive: true },
      });

      if (!user || !user.refreshToken) {
        console.error('❌ Refresh token validation failed - no user or token');
        throw new UnauthorizedException('Invalid refresh token');
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        console.error('❌ Refresh token validation failed - token mismatch');
        throw new UnauthorizedException('Invalid refresh token');
      }

      console.log('✅ Refresh token validated successfully for user:', user.email);

      const tokens = await this.generateTokens(user.id);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        data: tokens,
      };
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      await this.userRepository.update(userId, {
        refreshToken: null,
      });
      
      console.log('✅ User logged out successfully:', userId);
      
      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw new UnauthorizedException('Logout failed');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        console.log('❌ User not found during validation:', email);
        return null;
      }

      if (!user.isActive) {
        console.log('❌ User account is disabled:', email);
        return null;
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        console.log('❌ Invalid password for user:', email);
        return null;
      }

      console.log('✅ User validation successful:', email);
      return user;
    } catch (error) {
      console.error('❌ User validation error:', error);
      return null;
    }
  }

  async validateUserById(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, isActive: true },
      });

      if (!user) {
        console.error('❌ User not found by ID:', userId);
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.error('❌ User validation by ID error:', error);
      throw new UnauthorizedException('User validation failed');
    }
  }

  private async generateTokens(userId: string) {
    try {
      const payload: TokenPayload = { sub: userId };
      const secret = this.configService.get<string>('jwt.secret');
      
      if (!secret) {
        throw new Error('JWT secret not configured');
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret,
          expiresIn: this.configService.get<string>('jwt.accessTokenTtl'),
        }),
        this.jwtService.signAsync(payload, {
          secret,
          expiresIn: this.configService.get<string>('jwt.refreshTokenTtl'),
        }),
      ]);

      console.log('✅ Tokens generated successfully for user:', userId);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('❌ Token generation error:', error);
      throw new UnauthorizedException('Failed to generate tokens');
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
      await this.userRepository.update(userId, {
        refreshToken: hashedRefreshToken,
      });
      
      console.log('✅ Refresh token updated for user:', userId);
    } catch (error) {
      console.error('❌ Failed to update refresh token:', error);
      throw new UnauthorizedException('Failed to update refresh token');
    }
  }
}
