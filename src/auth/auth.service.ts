import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private userService: UserService
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

    login() {
        // Login logic goes here
        console.log('User logged in successfully');
    }

    logout() {
        // Logout logic goes here
        console.log('User logged out successfully');
    }
}
