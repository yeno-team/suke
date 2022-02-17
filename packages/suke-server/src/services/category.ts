import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { RealtimeRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { RedisClientType } from "@suke/suke-server/src/config";
import { Inject, Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";


@Service()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryModel) private categoryRepository: Repository<CategoryModel>,
        @Inject("redis") private redisClient: RedisClientType
    ){}

    public async findById(id: number): Promise<CategoryModel> {
        return (await this.categoryRepository.findByIds([id], { select: ["label", "value", "viewerCount"] }))[0];
    }

    public async getCategories(pageNumber = 1, limit = 40): Promise<CategoryModel[]> {
        return await this.categoryRepository.find({ 
            order: {
                viewerCount: 'DESC'
            },
            take: limit,
            skip: Math.max(pageNumber - 1, 0) * limit
        });
    }

    public async getCategoryChannels(categoryVal: string, pageNumber = 1, limit = 20, order: "ASC" | "DESC" = "DESC"): Promise<RealtimeRoomData[]> {
        if (pageNumber <= 0) throw new Error("Page Number should be greater than 0");
        
        const startIndex = (pageNumber-1) * limit;
        const endIndex = pageNumber * limit;

        const sortedChannels = await this.redisClient.ZRANGE("category_channels:" + categoryVal, startIndex, endIndex, order === "DESC" ? {REV: true} : {});

        const data: RealtimeRoomData[] = [];

        for (const key of sortedChannels) {
            const channel = await this.redisClient.get(key);

            if (channel != null) {
                const parsedChannel: RealtimeRoomData = JSON.parse(channel);
                data.push({
                    ...parsedChannel,
                    password: "*".repeat(parsedChannel.password.length)
                });
            }
        }

        return data;
    }
}