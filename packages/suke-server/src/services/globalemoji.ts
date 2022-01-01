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

    private async getGlobalEmotesCache() : Promise<Array<Emoji>> {
        const globalEmotesCache = await this.redisClient.get("GlobalEmojiCache")

        if(!(globalEmotesCache)) {
            return []
        }

        return JSON.parse(globalEmotesCache)
    }

    private async find(opts : FindGlobalEmojiOpts) : Promise<Emoji | null> {
        if(!(opts.id) && !(opts.name)) {
            throw new Error("GlobalEmojiService : Must provide property id or name property.")
        }

        const globalEmotesCache = await this.getGlobalEmotesCache()

        if(globalEmotesCache.length <= 0) {
            return null
        }
        
        let result : Emoji | null = null

        for(let i = 0; i < globalEmotesCache.length; i++) {
            const globalEmote = globalEmotesCache[i]
            
            const id = opts.id ?? globalEmote.id
            const name = opts.name ?? globalEmote.name
            
            if(globalEmote.id === id && globalEmote.name === name) {
                result = globalEmote
                break
            }
        }

        return result

    }

    public async findById(id : string) : Promise<Emoji | null> {
        return this.find({ id })
    }
    
    public async findByName(name : string) : Promise<Emoji | null> {
        return this.find({ name })
    }

}