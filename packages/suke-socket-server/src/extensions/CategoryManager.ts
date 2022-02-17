import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { RedisClientType, SocketServer } from "../server";
import { getRepository, Repository } from "typeorm";


/**
 * Handles caching category data such as viewer counts
 */
export class CategoryManager {
    /**
     * A Map where the key is the category's "value" or name. 
     * The value is another map where the key is a channel id and its viewer count.
     */
    private categoryCache: Map<string, Map<string, number>>;
    private categoryRepository: Repository<CategoryModel>;
    private redisClient: RedisClientType;

    constructor(private server: SocketServer) {
        this.categoryCache = new Map();
        this.categoryRepository = getRepository(CategoryModel);
        this.redisClient = server.getRedisClient();
    }

    public async updateRoomViewerCount(roomId: string, category: string, viewerCount: number): Promise<void> {
        const newCategoryMap = this.categoryCache.get(category) || new Map();
        newCategoryMap.set(roomId, viewerCount);
        this.categoryCache.set(category, newCategoryMap);

    
        const channelKey = this.getChannelKey(roomId);
        const categoryChannelsKey = `category_channels:${category}`;

        await this.redisClient.ZREM(categoryChannelsKey, channelKey);
        await this.redisClient.ZADD(categoryChannelsKey, [{value: channelKey, score: viewerCount}]);
    }

    private getChannelKey(key: string) {
        return `channel:${key.toLowerCase()}`;
    }
}

