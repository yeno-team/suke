import { Inject, Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { UserModel } from '@suke/suke-core/src/entities/User'
import { Repository } from 'typeorm'


@Service()
export class UserService {
    constructor(
        @InjectRepository(UserModel) private userRepository: Repository<UserModel>
    ) {}

    public async findUserById(id: number): Promise<UserModel> {
        return (await this.userRepository.findByIds([id]))[0];
    }
}