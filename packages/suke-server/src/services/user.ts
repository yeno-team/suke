import { Inject, Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { User, UserModel } from '@suke/suke-core/src/entities/User'
import { Repository } from 'typeorm'


@Service()
export class UserService {
    constructor(
        @InjectRepository(UserModel) private userRepository: Repository<UserModel>
    ) {}

    public async findUserById(id: number): Promise<UserModel> {
        return (await this.userRepository.findByIds([id]))[0];
    }

    public async createUser(user: User): Promise<UserModel> {
        const newUser = new UserModel();
        newUser.email = user.email;
        newUser.id = user.id;
        newUser.name = user.name;
        newUser.password = user.password;
        newUser.role = user.role;
        newUser.salt = user.salt;
        
        
        return newUser.save();
    }
}