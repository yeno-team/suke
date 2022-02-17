import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { RedisClientType } from "@suke/suke-server/src/config";
import Container, { Inject, Service } from "typedi";
import { getRepository, Repository } from "typeorm";
import { ScheduledTask } from "../ScheduledTask";
import { InjectRepository } from "typeorm-typedi-extensions";


export class CategoryViewerTask implements ScheduledTask {
    intervalTime = 10000;
    private redisClient: RedisClientType;
    private categoryRepository: Repository<CategoryModel>;

    async execute(): Promise<void> {
        this.redisClient = Container.get<RedisClientType>('redis');
        this.categoryRepository = getRepository(CategoryModel);
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
    }
}