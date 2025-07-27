import { User } from './entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: typeof User);
    findByEmail(email: string): Promise<User | null>;
}
