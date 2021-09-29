import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { User, UserModel } from '@suke/suke-core/src/entities/User'
import { Repository } from 'typeorm'
import { UserChannel } from '@suke/suke-core/src/entities/UserChannel';
import { UserChannelService } from './channel';
import bcrypt from 'bcrypt';

@Service()
export class UserService {
    constructor(
        @InjectRepository(UserModel) private userRepository: Repository<UserModel>,
        private userChannelService: UserChannelService    
    ) {}

    public async findById(id: number): Promise<UserModel | undefined> {
        return (await this.userRepository.findByIds([id]))[0];
    }

    public async findByName(name: string): Promise<UserModel | undefined> {
        return (await this.userRepository.findOne({
            where: [
                {
                    username: name
                }
            ]
        }))
    }

    public async create(user: User, rawPassword: string): Promise<UserModel> {
        const newChannel = new UserChannel({
            id: 0,
            followers: 0,
            desc_title: 'About Me',
            desc: "Welcome to my channel!",
        });

        const createdChannel = await this.userChannelService.create(newChannel);

        const newUser = new UserModel();

        newUser.email = user.email;
        newUser.id = user.id;
        newUser.name = user.name;
        newUser.role = user.role;
        newUser.channel = createdChannel;
        
        const saltedPassword = await bcrypt.hash(rawPassword, 6);
        newUser.salt = saltedPassword;
        
        return newUser.save();
    }
}