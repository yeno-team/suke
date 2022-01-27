import { Service } from "typedi";
import { Request , Response } from "express";
import { BaseController } from "./BaseController";
import { BetterTTVApiWrapper } from "@suke/wrappers/src/betterttv";
import { BetterTTVEmoteOpts } from "@suke/wrappers/src/betterttv/types";
import Jimp from "jimp";

@Service()
export class EmojiController extends BaseController {
    public route = "/api/emotes/:username?"
    
    constructor(
        private betterTTVApiWrapper : BetterTTVApiWrapper
    ) {
        super();
    }

    public Get = async (req : Request , res : Response ) : Promise<void> => {
        // Create the emoji patellete 
        const trendingEmotes = this.betterTTVApiWrapper.getEmotes(new BetterTTVEmoteOpts({
            type : "trending",
            limit : 100,
            offset : 0
        }));

        const trendingEmotesOne = this.betterTTVApiWrapper.getEmotes(new BetterTTVEmoteOpts({
            type : "trending",
            limit : 100,
            offset : 100
        }));

        const emotes = await (await Promise.all([trendingEmotes , trendingEmotesOne])).flat();


        const iconHeight = 32;
        const iconWidth = 32;
        const cols = 32;
        const width = cols * iconWidth;
        
        const rows = Math.floor(emotes.length / cols);
        const height = rows * iconHeight;
        
        const main = await new Jimp(width , height , 0x0);

        let index = 0;

        const jimpEmotes : Array<Jimp> = await Promise.all(emotes.map(async ({ url }) => {
            try {
                const jimpEmote = await Jimp.read(url.href);
                await jimpEmote.resize(iconWidth , iconHeight);
                return jimpEmote;
            // eslint-disable-next-line no-empty
            } catch (e) {
            }
        }));

        for(let curRow = 0; curRow < rows; curRow++) {
            for(let curCol = 0; curCol < cols; curCol++) {                
                if(!jimpEmotes[index]) continue;

                await main.composite(jimpEmotes[index] , iconWidth * curCol , iconHeight * curRow);
                index += 1;
            }
        }
        
        await main.write("./faggot.png");

        res.status(200).json({ success : true });

    }
}