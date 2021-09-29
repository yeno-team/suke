import { UserChannel, UserChannelModel } from "@suke/suke-core/src/entities/UserChannel";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";


@Service()
export class UserChannelService {
    constructor(
        @InjectRepository(UserChannelModel) private userChannelRepository: Repository<UserChannelModel>
    ) {}

    public async findById(id: number): Promise<UserChannelModel> {
        return (await this.userChannelRepository.findByIds([id]))[0];
    }

    public async create(channel: UserChannel): Promise<UserChannelModel> {
        const newChannel = new UserChannelModel();
        newChannel.desc = channel.desc;
        newChannel.id = channel.id;
        newChannel.desc_title = channel.desc_title;
        newChannel.followers = channel.followers;

        return newChannel.save();
    }
}