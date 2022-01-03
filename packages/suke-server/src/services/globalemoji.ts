import { Inject, Service } from "typedi";
import { Emoji } from "@suke/suke-core/src/types/Emoji";
import redis from "redis";

export interface FindGlobalEmojiOpts {
    name? : string;
    id? : string;
}

@Service()
export class GlobalEmojiService {
    @Inject("redis")
    private redisClient : redis.RedisClientType;
    private globalEmoteCache : Array<Emoji | null>;

    private async getGlobalEmotesCache() : Promise<Array<Emoji>> {
        if(!(this.globalEmoteCache)) {
            this.globalEmoteCache = JSON.parse(await this.redisClient.get("GlobalEmojiCache"))
            return this.globalEmoteCache
        }

        return this.globalEmoteCache
    }

    private async binary_search(id : string) : Promise<Emoji | null> {
        const globalEmotesCache = await this.getGlobalEmotesCache()

        let startIndex = 0
        let stopIndex = globalEmotesCache.length
        let middle = Math.floor((stopIndex + startIndex) / 2)


        while(+globalEmotesCache[middle].id !== +id && startIndex < stopIndex) {
            if(+id < +globalEmotesCache[middle].id) {
                stopIndex = middle - 1
            } else if(+id > +globalEmotesCache[middle].id) {
                startIndex = middle + 1
            }

            middle = Math.floor((stopIndex + startIndex) / 2)
        }

        return +globalEmotesCache[middle].id !== +id ? null : globalEmotesCache[middle]
    }

    public async findById(id : string) : Promise<Emoji | null> {
        return this.binary_search(id)
    }
}