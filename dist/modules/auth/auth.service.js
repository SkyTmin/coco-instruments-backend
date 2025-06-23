"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../database/entities/user.entity");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    configService;
    constructor(userRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, name, password } = registerDto;
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: email.toLowerCase() },
            });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = this.userRepository.create({
                email: email.toLowerCase(),
                name: name.trim(),
                password: hashedPassword,
            });
            const savedUser = await this.userRepository.save(user);
            console.log('✅ User registered successfully:', savedUser.email);
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
        }
        catch (error) {
            console.error('❌ Registration error:', error);
            throw error;
        }
    }
    async login(user) {
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
        }
        catch (error) {
            console.error('❌ Login error:', error);
            throw new common_1.UnauthorizedException('Login failed');
        }
    }
    async refresh(userId, refreshToken) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId, isActive: true },
            });
            if (!user || !user.refreshToken) {
                console.error('❌ Refresh token validation failed - no user or token');
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!refreshTokenMatches) {
                console.error('❌ Refresh token validation failed - token mismatch');
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            console.log('✅ Refresh token validated successfully for user:', user.email);
            const tokens = await this.generateTokens(user.id);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return {
                success: true,
                data: tokens,
            };
        }
        catch (error) {
            console.error('❌ Token refresh error:', error);
            throw error;
        }
    }
    async logout(userId) {
        try {
            await this.userRepository.update(userId, {
                refreshToken: null,
            });
            console.log('✅ User logged out successfully:', userId);
            return {
                success: true,
                message: 'Logout successful',
            };
        }
        catch (error) {
            console.error('❌ Logout error:', error);
            throw new common_1.UnauthorizedException('Logout failed');
        }
    }
    async validateUser(email, password) {
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
        }
        catch (error) {
            console.error('❌ User validation error:', error);
            return null;
        }
    }
    async validateUserById(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId, isActive: true },
            });
            if (!user) {
                console.error('❌ User not found by ID:', userId);
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (error) {
            console.error('❌ User validation by ID error:', error);
            throw new common_1.UnauthorizedException('User validation failed');
        }
    }
    async generateTokens(userId) {
        try {
            const payload = { sub: userId };
            const secret = this.configService.get('jwt.secret');
            if (!secret) {
                throw new Error('JWT secret not configured');
            }
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(payload, {
                    secret,
                    expiresIn: this.configService.get('jwt.accessTokenTtl'),
                }),
                this.jwtService.signAsync(payload, {
                    secret,
                    expiresIn: this.configService.get('jwt.refreshTokenTtl'),
                }),
            ]);
            console.log('✅ Tokens generated successfully for user:', userId);
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            console.error('❌ Token generation error:', error);
            throw new common_1.UnauthorizedException('Failed to generate tokens');
        }
    }
    async updateRefreshToken(userId, refreshToken) {
        try {
            const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
            await this.userRepository.update(userId, {
                refreshToken: hashedRefreshToken,
            });
            console.log('✅ Refresh token updated for user:', userId);
        }
        catch (error) {
            console.error('❌ Failed to update refresh token:', error);
            throw new common_1.UnauthorizedException('Failed to update refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map