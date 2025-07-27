import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
        
        const user = await this.userRepository.create({ 
            ...registerDto, 
            password: hashedPassword 
        });
       
        const { password, ...result } = user.toJSON();
        return result;
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { 
            sub: user.id, 
            email: user.email, 
            username: user.username 
        };
        const token = this.jwtService.sign(payload);

        const { password: _, ...userResult } = user.toJSON();
        return {
            user: userResult,
            access_token: token
        };
    }

    logout() {
        // Since JWT tokens are stateless, logout is typically handled client-side
        // by removing the token from storage (localStorage, cookies, etc.)
        // For server-side logout, you could implement token blacklisting here
        
        return {
            message: 'Logout successful',
            timestamp: new Date().toISOString()
        };
    }
}
