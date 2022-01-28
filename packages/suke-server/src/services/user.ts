import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, UserModel } from '@suke/suke-core/src/entities/User';
import { Repository } from 'typeorm';
import { UserChannel, UserChannelModel } from '@suke/suke-core/src/entities/UserChannel';
import { UserChannelService } from './channel';
import * as bcrypt from 'bcrypt';
import { Follower } from '@suke/suke-core/src/entities/Follower';

@Service()
export class UserService {
    constructor(
        @InjectRepository(UserModel) private userRepository: Repository<UserModel>,
        @InjectRepository(Follower) private followerRepository: Repository<Follower>,
        private userChannelService: UserChannelService    
    ) {}

    public async findById(id: number): Promise<UserModel | undefined> {
        return (await this.userRepository.findByIds([id], {relations: ['channel', 'channel.followers', 'following', 'following.followedTo']}))[0];
    }

    public async findByName(name: string): Promise<UserModel | undefined> {
        return (await this.userRepository.findOne({
            where: [
                {
                    name: name
                }
            ],
            relations: ['channel', 'channel.followers', 'channel.followers.follower', 'following', 'following.followedTo']
        }));
    }

    public async create(user: User, rawPassword: string): Promise<UserModel> {
        const newChannel = new UserChannel({
            id: 0,
            followers: [],
            desc_title: 'About Me',
            desc: "Welcome to my channel!",
            roledUsers: []
        });

        const createdChannel = await this.userChannelService.create(newChannel);

        const newUser = new UserModel();

        newUser.email = user.email;
        newUser.id = user.id;
        newUser.name = user.name;
        newUser.role = user.role;
        newUser.channel = createdChannel;
        newUser.following = [];
        
        const saltedPassword = await bcrypt.hash(rawPassword, 6);
        newUser.salt = saltedPassword;
        
        return newUser.save();
    }

    /**
     * OPTIMIZATION NOTICE:
     * both followChannel and unfollowChannel can be optimized using binary search when checking if the user has followed.
     */
    public async followChannel(channel: UserChannelModel, userFollowing: UserModel): Promise<void> {
        const found = channel.followers.find(v => v.follower.id === userFollowing.id);
        
        if (found) {
            throw new Error("Already Followed.");
        }

        const followerObj = new Follower();
        followerObj.date = new Date();
        followerObj.followedTo = channel;
        followerObj.follower = userFollowing;
        
        followerObj.save();
    }

    public async unfollowChannel(channel: UserChannelModel, userUnfollowing: UserModel): Promise<void> {
        const found = channel.followers.find(v => v.follower.id === userUnfollowing.id);
        
        if (found == null) {
            throw new Error("Not followed to User.");
        }

        

        const removedFollowers = channel.followers.filter(v => v.follower.id == userUnfollowing.id);
        await this.followerRepository.remove(removedFollowers);
    }
}