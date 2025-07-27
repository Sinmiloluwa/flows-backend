import { RegisterDto } from './dtos/register.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userRepository;
    private userService;
    private jwtService;
    constructor(userRepository: typeof User, userService: UserService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<any>;
    login(email: string, password: string): Promise<{
        user: any;
        access_token: string;
    }>;
    logout(): {
        message: string;
        timestamp: string;
    };
}
