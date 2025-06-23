import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                name: string;
            };
        };
    }>;
    login(user: User): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                name: string;
            };
        };
    }>;
    refresh(userId: string, refreshToken: string): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    validateUserById(userId: string): Promise<User>;
    private generateTokens;
    private updateRefreshToken;
}
