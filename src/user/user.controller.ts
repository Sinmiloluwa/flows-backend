import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}
    
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: User) {
        // Remove password from response
        const { password, ...userProfile } = user.toJSON();
        return userProfile;
    }
}
