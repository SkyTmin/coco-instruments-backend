import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@database/entities/user.entity';
interface AuthRequest extends Request {
    user: User;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(req: AuthRequest, loginDto: LoginDto): Promise<{
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
    refresh(req: AuthRequest & {
        user: {
            id: string;
            refreshToken: string;
        };
    }, refreshTokenDto: RefreshTokenDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(user: User): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(user: User): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
        };
    }>;
}
export {};
