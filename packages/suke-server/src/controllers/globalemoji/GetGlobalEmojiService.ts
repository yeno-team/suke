import { Service } from "typedi";
import { BetterTTVApiWrapper } from "@suke/wrappers/src/betterttv";
import { BetterTTVEmote, BetterTTVEmoteOpts, BetterTTVEmoteResponse } from "@suke/wrappers/src/betterttv/types";
import { Emoji } from "@suke/suke-core/src/entities/Emoji";

@Service()
export class GlobalEmojiGetService {
    constructor(
        private betterTTVApiWrapper : BetterTTVApiWrapper
    ) {}

    private async getTrendingEmojis(pages = 4) : Promise<Array<BetterTTVEmote>> {
        const promises : Array<Promise<BetterTTVEmoteResponse>> = []

        for(let i = 0; i < pages; i++) {
            promises.push(this.betterTTVApiWrapper.getEmotes(new BetterTTVEmoteOpts({
                type : "trending",
                limit : 100,
                offset : i * 100
            })))
        }
        
        const emojis : Array<BetterTTVEmote> = await (await Promise.all(promises)).flat()
        return emojis
    }

    public async getGlobalEmojis(pages : number) : Promise<Array<Emoji>> {
        const globalEmojis : Array<Emoji> = []
        const trendingEmojis = await this.getTrendingEmojis(pages)

        for(let i = 0; i < trendingEmojis.length ; i++) {
            const { url , name } = trendingEmojis[i]

            globalEmojis.push(new Emoji({
                type : "global",
                id : i.toString(),
                url,
                name
            }))
        }

        return globalEmojis;
    }
}