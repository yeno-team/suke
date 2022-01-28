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
        this.startUpdateTimer();
    }

    private startUpdateTimer() {
        /**
         * MAYBE MOVE THIS INTO SOMETHING THAT IS OUTSIDE THE SCOPE OF THE APPLICATION WHERE IT CAN RUN ON ITS OWN
         * Something like using node-schedule
         */
        setInterval(async () => {
            /**
             * Update categories viewer count in db every 10 seconds
             */

            const categoryChannelsKeys = await this.redisClient.KEYS("category_channels:*");
            
            for (const key of categoryChannelsKeys) {
                const category = await this.categoryRepository.findOne({ where: { value: key.split("category_channels:")[1] } });
                
                if (category != null) {
                    const set = await this.redisClient.ZRANGE_WITHSCORES(key, 0, -1);
                    const totalViewerCount = set.reduce((prev, curr) => prev + curr.score, 0);
                    category.viewerCount = Math.max(totalViewerCount, 0);
                    category.save();
                }
            }
        }, 10000);
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

