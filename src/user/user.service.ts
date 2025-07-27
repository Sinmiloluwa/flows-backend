import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: typeof User
      ) {}

      findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
      }
}
