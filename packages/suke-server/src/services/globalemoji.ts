import { Inject, Service } from "typedi";
import { Emoji } from "@suke/suke-core/src/entities/Emoji";
import redis from "redis";
import { RedisClientType } from "@suke/suke-server/src/config";

export interface FindGlobalEmojiOpts {
    name? : string;
    id? : string;
}

@Service()
export class GlobalEmojiCacheService {
    @Inject("redis")
    private redisClient : RedisClientType;

    public async getGlobalEmojiCache() : Promise<Array<Emoji> | null> {
        const globalEmojisCache = await this.redisClient.get('GlobalEmojiCache');

        if(!(globalEmojisCache)) {
            return null;
        }

        return JSON.parse(globalEmojisCache);
    }

    public async setGlobalEmojiCache(emojis : Array<Emoji>) : Promise<void> {
        await this.redisClient.set("GlobalEmojiCache", JSON.stringify(emojis));
    }

    private async binary_search(id : string) : Promise<Emoji | null> {
        const globalEmojiCache = await this.getGlobalEmojiCache();

        let startIndex = 0;
        let stopIndex = globalEmojiCache.length;
        let middle = Math.floor((stopIndex + startIndex) / 2);


        while(+globalEmojiCache[middle].id !== +id && startIndex < stopIndex) {
            if(+id < +globalEmojiCache[middle].id) {
                stopIndex = middle - 1;
            } else if(+id > +globalEmojiCache[middle].id) {
                startIndex = middle + 1;
            }

            middle = Math.floor((stopIndex + startIndex) / 2);
        }

        return +globalEmojiCache[middle].id !== +id ? null : globalEmojiCache[middle];
    }

    public async findById(id : string) : Promise<Emoji | null> {
        return this.binary_search(id);
    }
}