import { IUserChannel, UserChannel, UserChannelModel } from "@suke/suke-core/src/entities/UserChannel";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";


@Service()
export class UserChannelService {
    constructor(
        @InjectRepository(UserChannelModel) private userChannelRepository: Repository<UserChannelModel>
    ) {}

    public async findById(id: number): Promise<UserChannelModel> {
        return (await this.userChannelRepository.findByIds([id], {relations: ["followers"]}))[0];
    }

    public async create(channel: UserChannel): Promise<UserChannelModel> {
        const newChannel = new UserChannelModel();
        newChannel.desc = channel.desc;
        newChannel.id = channel.id;
        newChannel.desc_title = channel.desc_title;
        newChannel.followers = channel.followers;

        return newChannel.save();
    }

    public async edit(channelId: number, editedChannelData: Partial<IUserChannel>): Promise<UserChannelModel> {
        const channel = await this.findById(channelId);

        if (editedChannelData.desc != null) {
            channel.desc = editedChannelData.desc;
        }

        if (editedChannelData.desc_title != null) {
            channel.desc_title = editedChannelData.desc_title;
        }

        if (editedChannelData.followers != null) {
            channel.followers = editedChannelData.followers;
        }

        return channel.save();
    }
}